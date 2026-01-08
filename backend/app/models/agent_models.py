from pydantic import BaseModel
from datetime import datetime

class AgentOutput(BaseModel):
    student_id: str
    subject: str
    study_state: str
    study_duration: int
    break_duration: int
    timestamp: datetime = datetime.utcnow()
