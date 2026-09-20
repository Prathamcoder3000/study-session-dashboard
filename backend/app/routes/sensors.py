from fastapi import APIRouter
from app.models.sensor_models import SensorInput
from app.database import sensor_collection
from datetime import datetime


router = APIRouter()

@router.post("/sensor-data")
def add_sensor_data(data: SensorInput):
    record = data.dict()
    record["timestamp"] = datetime.utcnow()  # 👈 ADD THIS
    sensor_collection.insert_one(record)
    return {"message": "Sensor data stored"}


@router.get("/latest-heart-rate/{student_id}")
def get_latest_heart_rate(student_id: str):
    data = sensor_collection.find_one(
        {"student_id": student_id},
        sort=[("timestamp", -1)]
    )

    if not data:
        return {"heart_rate": None}

    return {"heart_rate": data.get("heart_rate")}
