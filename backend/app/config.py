import os
from dotenv import load_dotenv

load_dotenv()  # load .env FIRST

MONGO_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = "study_session_db"
