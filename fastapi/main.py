from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import pandas as pd
import boto3
import json
import uuid
from dotenv import load_dotenv
import os
import pprint
import random
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

s3 = boto3.client("s3")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:5173",
    ],  # Allows all origins, adjust as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, adjust as needed
    allow_headers=["*"],  # Allows all headers, adjust as needed
)


def get_from_S3(key: str, bucket: str = "trending-feeds", expires_in: int = 3_600):
    return s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": bucket,
            "Key": key,
        },
        ExpiresIn=expires_in,
    )


def get_meta(uuid: str, bucket: str = "trending-feeds"):
    response = s3.get_object(Bucket=bucket, Key=f"public/{uuid}/meta.json")
    return json.load(response["Body"])


def record_stimuli():

    return


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.get("/validate/{participant_id}")
async def validate_participant(participant_id: str):
    """
    Given a participant ID, gives back a list of feed URLs assigned to them.

    For each feed URL, you also need to give back the images for each post
    and the JSON associated with the rotation so that the buttons can be drawn.
    """

    show_proof = random.choice([True, False])
    rotations = [
        random.randint(0, 9),
        random.randint(0, 9),
        random.randint(0, 9),
    ]

    feeds = [
        "5e95e7a5-6f6e-47a1-8677-8707e1b63e02",
        "ebb00a74-0230-4380-ba31-d4c2593f212a",
        "3992c1e1-17e6-4991-85fa-f9da14f30568",
    ]

    meta = {feed_uuid: get_meta(feed_uuid) for feed_uuid in feeds}

    """
    TODO: Record the treatments given to the participant, store it in session-starts
    cluster on MongoDB.
    """

    return {
        "valid": True,
        "feeds": feeds,
        "feedURLs": [
            get_from_S3(
                f"public/{feeds[0]}/"
                + meta[feeds[0]]["feeds"][str(rotations[0])][
                    "proof" if show_proof else "noProof"
                ]["feedUUID"]
                + ".jpg"
            ),
            get_from_S3(
                f"public/{feeds[1]}/"
                + meta[feeds[1]]["feeds"][str(rotations[1])][
                    "proof" if show_proof else "noProof"
                ]["feedUUID"]
                + ".jpg"
            ),
            get_from_S3(
                f"public/{feeds[2]}/"
                + meta[feeds[2]]["feeds"][str(rotations[2])][
                    "proof" if show_proof else "noProof"
                ]["feedUUID"]
                + ".jpg"
            ),
        ],
        "feedData": {
            feeds[0]: meta[feeds[0]]["feeds"][str(rotations[0])][
                "proof" if show_proof else "noProof"
            ]["articleBounds"],
            feeds[1]: meta[feeds[1]]["feeds"][str(rotations[1])][
                "proof" if show_proof else "noProof"
            ]["articleBounds"],
            feeds[2]: meta[feeds[2]]["feeds"][str(rotations[2])][
                "proof" if show_proof else "noProof"
            ]["articleBounds"],
        },
        "postURLs": {
            feed_uuid: {
                post_uuid: get_from_S3(f"public/{feed_uuid}/{post_uuid}.jpg")
                for post_uuid in meta[feeds[i]]["feeds"][str(rotations[i])][
                    "proof" if show_proof else "noProof"
                ]["posts"]
            }
            for i, feed_uuid in enumerate(feeds)
        },
    }


@app.post("/submit/")
async def submit_response(response: dict):

    try:

        client = AsyncIOMotorClient(
            f"mongodb+srv://{os.environ.get('MONGO_USER')}:{os.environ.get('MONGO_SECRET')}@responses.vpbn1v3.mongodb.net/?retryWrites=true&w=majority&appName=responses"
        )

        collection = client.get_database("trending-feeds").get_collection("responses")

        await collection.insert_one(response)

        client.close()

        return {
            "status": "success",
            "completionCode": os.environ.get("COMPLETION_CODE", "XXXXXX"),
            "completionURL": os.environ.get(
                "COMPLETION_URL", "https://www.google.com/"
            ),
        }

    except Exception as e:

        return {"status": "error", "message": str(e)}
