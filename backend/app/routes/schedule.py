from fastapi import APIRouter
from app.database import agent_collection, sensor_collection

router = APIRouter()

# 🔹 EXISTING STATIC SCHEDULE (from AI agent)
@router.get("/schedule/{student_id}")
def get_schedule(student_id: str):
    data = list(
        agent_collection.find(
            {"student_id": student_id},
            {"_id": 0}
        )
    )
    return data


# 🔹 FUNCTION: Decide study plan using heart rate + GSR + original plan
def calculate_dynamic_schedule(heart_rate, gsr, planned_study, planned_break):

    if heart_rate is None:
        return planned_study, planned_break, "Unknown"

    # 🔴 HIGH STRESS
    if heart_rate > 95 or gsr > 4.5:
        study = max(20, planned_study - 15)   # reduce study time
        brk = planned_break + 5               # increase break
        stress = "High Stress"

    # 🟢 RELAXED
    elif heart_rate < 75 and gsr < 2.5:
        study = planned_study + 10            # increase study time
        brk = max(5, planned_break - 2)       # reduce break
        stress = "Relaxed"

    # 🟡 NORMAL
    else:
        study = planned_study
        brk = planned_break
        stress = "Normal"

    return study, brk, stress


# 🔹 FUNCTION: Get latest sensor data
def get_latest_sensor_data(student_id: str):
    data = sensor_collection.find_one(
        {"student_id": student_id},
        sort=[("timestamp", -1)]
    )
    return data


# 🔹 NEW API: Dynamic Schedule based on LIVE sensors
@router.get("/dynamic-schedule/{student_id}")
def dynamic_schedule(student_id: str):

    sensor = get_latest_sensor_data(student_id)

    if not sensor:
        return {"error": "No sensor data found"}

    heart_rate = sensor.get("heart_rate")
    gsr = sensor.get("gsr_value", 0)

    # 🔹 Get planned study & break from AI schedule if exists
    schedule = agent_collection.find_one(
        {"student_id": student_id},
        sort=[("_id", -1)]
    )

    planned_study = schedule.get("planned_study_duration", 40) if schedule else 40
    planned_break = schedule.get("preferred_break_duration", 5) if schedule else 5

    study_time, break_time, stress_state = calculate_dynamic_schedule(
        heart_rate, gsr, planned_study, planned_break
    )

    return {
        "heart_rate": heart_rate,
        "gsr": gsr,
        "stress_state": stress_state,
        "planned_study_duration": planned_study,
        "planned_break_duration": planned_break,
        "recommended_study_duration": study_time,
        "recommended_break_duration": break_time
    }

