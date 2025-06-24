from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import boto3
import json
from dotenv import load_dotenv
from pymongo import MongoClient
import os


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
def validate_participant(participant_id: str):
    """
    Given a participant ID, gives back a list of feed URLs assigned to them.

    For each feed URL, you also need to give back the images for each post
    and the JSON associated with the rotation so that the buttons can be drawn.
    """
    # Load the CSV file into a DataFrame
    df = pd.read_csv("IDs.csv")

    # TODO: Should pull which feed UUIDs are assigned to them
    # and rotations for each feed.

    if participant_id not in df["ID"].values:
        return {"valid": False}

        # Check if the participant_id exists in the DataFrame

    # Read the meta.json for each feed UUID.
    feeds = [
        "20e1d2ef-2268-4d4b-a724-5f5d61cfc896",
        "36a937d7-4fc4-4cbf-8705-83776c112078",
        "5c18c574-32db-4028-b4ea-40e949ff81ba",
    ]

    meta = {}

    for feed_uuid in feeds:
        meta[feed_uuid] = get_meta(feed_uuid)

    return {
        "valid": True,
        "feeds": feeds,
        "feedURLs": [
            get_feed("public/20e1d2ef-2268-4d4b-a724-5f5d61cfc896/rotation-0.png"),
            get_feed("public/36a937d7-4fc4-4cbf-8705-83776c112078/rotation-3.png"),
            get_feed("public/5c18c574-32db-4028-b4ea-40e949ff81ba/rotation-4.png"),
        ],
        "feedData": {
            "20e1d2ef-2268-4d4b-a724-5f5d61cfc896": get_feed_data(
                "public/20e1d2ef-2268-4d4b-a724-5f5d61cfc896/rotation-0.json"
            ),
            "36a937d7-4fc4-4cbf-8705-83776c112078": get_feed_data(
                "public/36a937d7-4fc4-4cbf-8705-83776c112078/rotation-3.json"
            ),
            "5c18c574-32db-4028-b4ea-40e949ff81ba": get_feed_data(
                "public/5c18c574-32db-4028-b4ea-40e949ff81ba/rotation-4.json"
            ),
        },
        "postURLs": {
            feed_uuid: {
                uuid: s3.generate_presigned_url(
                    "get_object",
                    Params={
                        "Bucket": "trending-feeds",
                        "Key": f"public/{feed_uuid}/{uuid}.png",
                    },
                    ExpiresIn=3_600,
                )
                for _, uuid in meta[feed_uuid]["originalOrdering"].items()
            }
            for feed_uuid in feeds
        },
    }


@app.post("/submit/")
def submit_response(response: dict):

    client = MongoClient(
        f"mongodb+srv://{os.environ.get('MONGO_USER')}:{os.environ.get('MONGO_SECRET')}@responses.vpbn1v3.mongodb.net/?retryWrites=true&w=majority&appName=responses"
    )

    try:

        collection = client.get_database("trending-feeds").get_collection("responses")

        collection.insert_one(response)

        client.close()

        return {"status": "success"}

    except Exception as e:

        return {"status": "error", "message": str(e)}
