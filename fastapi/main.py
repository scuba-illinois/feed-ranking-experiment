from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import boto3
import json
from dotenv import load_dotenv
import os
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


def get_feed(key: str, bucket: str = "trending-feeds", expires_in: int = 3_600):
    return s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": bucket,
            "Key": key,
        },
        ExpiresIn=expires_in,
    )


def get_feed_data(key: str, bucket: str = "trending-feeds"):
    response = s3.get_object(Bucket=bucket, Key=key)
    return json.load(response["Body"])


def get_meta(uuid: str, bucket: str = "trending-feeds"):
    response = s3.get_object(Bucket=bucket, Key=f"public/{uuid}/meta.json")
    return json.load(response["Body"])


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

    """
    TODO: Eventually deprecate this when all snapshots are taken using JPGs.
    """
    JPG_SNAPSHOTS = {
        "38dbd51f-fbff-4541-813b-80678f03ba43",
        "5e24e85b-40db-4fa8-ae6e-cfe16cd6920e",
    }
    NO_PROOF_SNAPSHOTS = {"5e24e85b-40db-4fa8-ae6e-cfe16cd6920e"}

    # Load the CSV file into a DataFrame
    df = pd.read_csv("IDs.csv")

    # TODO: Eventually what snapshots and rotations should depends on the participant ID.

    # TODO: Eventually add back in whitelist check.
    if participant_id not in df["ID"].values and False:
        return {"valid": False}

    # Read the meta.json for each feed UUID.
    feeds = [
        "5e24e85b-40db-4fa8-ae6e-cfe16cd6920e",  # No proof snapshot
        "38dbd51f-fbff-4541-813b-80678f03ba43",  # New JPG snapshot
        # "20e1d2ef-2268-4d4b-a724-5f5d61cfc896",
        # "36a937d7-4fc4-4cbf-8705-83776c112078",
        "5c18c574-32db-4028-b4ea-40e949ff81ba",
    ]

    rotations = [0, 3, 4]

    meta = {}

    for feed_uuid in feeds:
        meta[feed_uuid] = get_meta(feed_uuid)

    return {
        "valid": True,
        "feeds": feeds,
        "feedURLs": [
            # get_feed("public/20e1d2ef-2268-4d4b-a724-5f5d61cfc896/rotation-0.png"),
            get_feed(
                f"public/{feeds[0]}/rotation-{rotations[0]}"
                + ("-no-proof" if feeds[0] in NO_PROOF_SNAPSHOTS else "")
                + (".jpg" if feeds[0] in JPG_SNAPSHOTS else ".png")
            ),
            get_feed(
                f"public/{feeds[1]}/rotation-{rotations[1]}"
                + ("-no-proof" if feeds[1] in NO_PROOF_SNAPSHOTS else "")
                + (".jpg" if feeds[1] in JPG_SNAPSHOTS else ".png")
            ),
            get_feed(
                f"public/{feeds[2]}/rotation-{rotations[2]}"
                + ("-no-proof" if feeds[2] in NO_PROOF_SNAPSHOTS else "")
                + (".jpg" if feeds[2] in JPG_SNAPSHOTS else ".png")
            ),
        ],
        "feedData": {
            feeds[0]: get_feed_data(
                f"public/{feeds[0]}/rotation-{rotations[0]}"
                + ("-no-proof" if feeds[0] in NO_PROOF_SNAPSHOTS else "")
                + ".json"
            ),
            feeds[1]: get_feed_data(
                f"public/{feeds[1]}/rotation-{rotations[1]}"
                + ("-no-proof" if feeds[1] in NO_PROOF_SNAPSHOTS else "")
                + ".json"
            ),
            feeds[2]: get_feed_data(
                f"public/{feeds[2]}/rotation-{rotations[2]}"
                + ("-no-proof" if feeds[2] in NO_PROOF_SNAPSHOTS else "")
                + ".json"
            ),
        },
        "postURLs": {
            feed_uuid: {
                uuid: s3.generate_presigned_url(
                    "get_object",
                    Params={
                        "Bucket": "trending-feeds",
                        "Key": f"public/{feed_uuid}/{uuid}"
                        + ("-no-proof" if feed_uuid in NO_PROOF_SNAPSHOTS else "")
                        + (".jpg" if feed_uuid in JPG_SNAPSHOTS else ".png"),
                    },
                    ExpiresIn=3_600,
                )
                for _, uuid in meta[feed_uuid]["originalOrdering"].items()
            }
            for feed_uuid in feeds
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
            "completionCode": "XXXXXX",
            "completionURL": "https://www.google.com/",
        }

    except Exception as e:

        return {"status": "error", "message": str(e)}
