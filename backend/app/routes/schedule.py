from fastapi import APIRouter
from app.database import agent_collection

router = APIRouter()

@router.get("/schedule/{student_id}")
def get_schedule(student_id: str):
    data = list(
        agent_collection.find(
            {"student_id": student_id},
            {"_id": 0}
        )
    )
    return data
