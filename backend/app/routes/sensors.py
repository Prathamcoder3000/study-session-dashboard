from fastapi import APIRouter
from app.models.sensor_models import SensorInput
from app.database import sensor_collection

router = APIRouter()

@router.post("/sensor-data")
def add_sensor_data(data: SensorInput):
    sensor_collection.insert_one(data.dict())
    return {"message": "Sensor data stored"}
