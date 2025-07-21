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
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient


class Session(BaseModel):
    participantID: str
    timestamp: str
    PROLIFIC_PID: str = ""
    STUDY_ID: str = ""
    SESSION_ID: str = ""


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


def create_client():
    return AsyncIOMotorClient(
        f"mongodb+srv://{os.environ.get('MONGO_USER')}:{os.environ.get('MONGO_SECRET')}@responses.vpbn1v3.mongodb.net/?retryWrites=true&w=majority&appName=responses"
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


async def record_session_start(
    session: Session, feeds: list, rotations: list, show_proof: bool
):

    client = create_client()

    collection = client.get_database("trending-feeds").get_collection("session-starts")

    await collection.insert_one(
        {
            "participantID": session.participantID,
            "timestamp": session.timestamp,
            "PROLIFIC_PID": session.PROLIFIC_PID,
            "STUDY_ID": session.STUDY_ID,
            "SESSION_ID": session.SESSION_ID,
            "feeds": [
                {"feedUUID": feeds[i], "rotation": rotations[i]} for i in range(3)
            ],
            "shown_proof": show_proof,
        }
    )

    client.close()


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.post("/validate/")
async def validate_participant(session: Session):
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
        "75c8e402-ac6f-42f2-8d2c-8e8662b80be1",
        "f807d07e-5a77-49f9-bd02-8935b4d2dcf2",
        "08253bf4-c284-4599-8533-0ce3c632c691",
    ]
    random.shuffle(feeds)

    meta = {feed_uuid: get_meta(feed_uuid) for feed_uuid in feeds}

    """
    TODO: Record the treatments given to the participant, store it in session-starts
    cluster on MongoDB.
    """
    try:
        await record_session_start(session, feeds, rotations, show_proof)
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error recording session start.",
        }

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

        client = create_client()

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
