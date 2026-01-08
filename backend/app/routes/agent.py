from fastapi import APIRouter
from app.database import sensor_collection, agent_collection
from app.agents.study_agent import determine_study_state, generate_schedule

router = APIRouter()

@router.post("/run-agent/{student_id}")
def run_agent(student_id: str):
    data = sensor_collection.find_one(
        {"student_id": student_id},
        sort=[("timestamp", -1)]
    )

    if not data:
        return {"error": "No sensor data found"}

    state = determine_study_state(data["heart_rate"], data["gsr"])
    study_time, break_time = generate_schedule(
        state, data["subject_strength"]
    )

    result = {
        "student_id": student_id,
        "subject": data["subject"],
        "study_state": state,
        "study_duration": study_time,
        "break_duration": break_time
    }

    agent_collection.insert_one(result)
    # Remove MongoDB ObjectId before returning
    result.pop("_id", None)
    return result

