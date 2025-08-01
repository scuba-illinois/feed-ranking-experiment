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


def shuffle_copy(lst: list):
    shuffled = lst.copy()
    random.shuffle(shuffled)
    return shuffled


async def record_session_start(
    session: Session,
    feeds: list,
    rotations: list,
    show_proof: bool,
    option_randomized: dict,
):

    client = create_client()

    collection = None

    if (
        session.PROLIFIC_PID == "test"
        and session.STUDY_ID == "test"
        and session.SESSION_ID == "test"
    ):
        # If this is a test session, we use the test collection.
        collection = client.get_database("trending-feeds").get_collection(
            "session-starts"
        )
    else:

        collection = client.get_database("trending-feeds").get_collection(
            os.environ.get("MONGO_SESSION_STARTS_COLLECTION", "session-starts")
        )

    await collection.insert_one(
        {
            "timestamp": session.timestamp,
            "PROLIFIC_PID": session.PROLIFIC_PID,
            "STUDY_ID": session.STUDY_ID,
            "SESSION_ID": session.SESSION_ID,
            "feeds": [
                {"feedUUID": feeds[i], "rotation": rotations[i]} for i in range(3)
            ],
            "shown_proof": show_proof,
            "options_randomized": option_randomized,
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

    feeds = random.sample(
        [
            "749fc4f5-ce90-4a98-b5e7-39db62f1632b",
            "a602674f-7bc6-47e7-919b-bcde0dcf5f05",
            "1f9d2527-6430-4c8e-87cf-37a3e14323be",
            "c9dfbf3e-8655-4059-a1ac-fdb73fd88764",
            "cd299601-0ec4-49ab-a410-64489a867dea",
        ],
        k=3,
    )
    random.shuffle(feeds)

    # Determines how the Likert scale orders are randomized and
    # multiple choice options during exit questionnaire are randomized.
    option_randomized = {
        "likert": shuffle_copy(["relevance", "trustworthiness", "content_quality"]),
        "selection_multiple_choice": shuffle_copy(
            ["position", "content", "upvotes", "comments", "subreddit"]
        ),
        "selected_multiple_choice": shuffle_copy(
            ["relevance", "trustworthiness", "content_quality"]
        ),
        "nonselected_multiple_choice": shuffle_copy(
            ["relevance", "trustworthiness", "content_quality"]
        ),
    }

    meta = {feed_uuid: get_meta(feed_uuid) for feed_uuid in feeds}

    """
    Records the treatments given to the participant, store it in session-starts
    cluster on MongoDB.
    """
    try:
        await record_session_start(
            session, feeds, rotations, show_proof, option_randomized
        )
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error recording session start.",
        }

    return {
        "valid": True,
        "feeds": feeds,
        "optionsRandomized": option_randomized,
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


def verify_attention_check(response: dict) -> bool:
    attentionChecks = response["attentionChecks"]
    cases = []

    if attentionChecks["pre"] != 4:
        cases.append(False)

    if any([rating != 2 for rating in attentionChecks["feed"].values()]):
        cases.append(False)

    if attentionChecks["post"] != 1:
        cases.append(False)

    return False if len(cases) >= 2 else True


@app.post("/submit/")
async def submit_response(response: dict):

    try:

        client = create_client()

        if (
            response["prolific"].get("PROLIFIC_PID") == "test"
            and response["prolific"].get("STUDY_ID") == "test"
            and response["prolific"].get("SESSION_ID") == "test"
        ):
            collection = client.get_database("trending-feeds").get_collection(
                "responses"
            )
        else:
            collection = client.get_database("trending-feeds").get_collection(
                os.environ.get("MONGO_RESPONSES_COLLECTION", "responses")
            )

        await collection.insert_one(response)

        client.close()

        # Check whether the participant answered the attention check question correctly.
        passed_attention_check = verify_attention_check(response)

        completion_code = (
            os.environ.get("COMPLETION_CODE", "XXXXXX")
            if passed_attention_check
            else os.environ.get("FAILURE_COMPLETION_CODE", "XXXXXX")
        )
        completion_url = (
            os.environ.get("COMPLETION_URL", "https://www.google.com/")
            if passed_attention_check
            else os.environ.get("FAILURE_COMPLETION_URL", "https://www.google.com/")
        )

        return {
            "status": "success",
            "completionCode": completion_code,
            "completionURL": completion_url,
        }

    except Exception as e:

        return {"status": "error", "message": str(e)}
