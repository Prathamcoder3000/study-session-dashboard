from pydantic import BaseModel
from datetime import datetime

class SensorInput(BaseModel):
    student_id: str
    subject: str
    subject_strength: int
    heart_rate: int
    gsr: float
    timestamp: datetime = datetime.utcnow()
