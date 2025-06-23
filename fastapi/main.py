from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd

# from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.get("/participants/{participant_id}")
def is_valid_participant(participant_id: str):
    # Load the CSV file into a DataFrame
    df = pd.read_csv("IDs.csv")

    # TODO: Should pull which feed UUIDs are assigned to them
    # and rotations for each feed.

    # Check if the participant_id exists in the DataFrame
    if participant_id in df["ID"].values:
        return {"valid": True}
    else:
        return {"valid": False}
