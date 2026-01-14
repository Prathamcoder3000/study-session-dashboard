from fastapi import APIRouter
from app.database import sensor_collection, agent_collection

from app.agents.study_agent import (
    determine_study_state,
    generate_schedule,
    calculate_utility,
    get_stress_trend,
    plan_daily_schedule
)

router = APIRouter()


# =====================================================
# 1️⃣ SUBJECT-AWARE REACTIVE AGENT (FIXED)
# =====================================================
@router.post("/run-agent/{student_id}/{subject}")
def run_agent(student_id: str, subject: str):

    # 🔹 Fetch latest sensor data (SUBJECT-WISE)
    data = sensor_collection.find_one(
        {"student_id": student_id, "subject": subject},
        sort=[("timestamp", -1)]
    )

    if not data:
        return {
            "student_id": student_id,
            "subject": subject,
            "study_state": "Focused",
            "study_duration": 25,
            "break_duration": 5,
            "stress_trend": "Stable",
            "utility_score": 0.6
        }

    # 🔹 Fetch last 3 agent decisions (SUBJECT MEMORY)
    previous_sessions = list(
        agent_collection.find(
            {"student_id": student_id, "subject": subject},
            {"study_state": 1, "_id": 0}
        ).sort("timestamp", -1).limit(3)
    )

    previous_states = [s["study_state"] for s in previous_sessions]

    # 🔐 NEW USER / NEW SUBJECT FIX
    if not previous_states:
        stress_trend = "Stable"
    else:
        stress_trend = get_stress_trend(previous_states)

    # 🔹 Determine current mental state
    state = determine_study_state(
        data["heart_rate"],
        data["gsr"],
        stress_trend
    )

    # 🔹 Generate schedule
    study_time, break_time = generate_schedule(
        state,
        data["subject_strength"],
        stress_trend
    )

    # 🔐 HARD SAFETY (NO — min EVER)
    study_time = max(25, study_time)
    break_time = max(5, break_time)

    # 🔹 Utility (never 0)
    utility = calculate_utility(
        state,
        study_time,
        break_time,
        stress_trend
    )
    utility = max(0.6, utility)

    final_result = {
        "student_id": student_id,
        "subject": subject,
        "study_state": state,
        "study_duration": study_time,
        "break_duration": break_time,
        "stress_trend": stress_trend,
        "utility_score": utility
    }

    # 🔹 Store agent memory (SUBJECT-WISE)
    agent_collection.insert_one(final_result)

    final_result.pop("_id", None)
    return final_result


# =====================================================
# 2️⃣ GOAL-BASED DAILY PLANNING AGENT (SAFE)
# =====================================================
@router.post("/plan-day/{student_id}")
def plan_day(student_id: str, daily_goal: int = 120):

    data = sensor_collection.find_one(
        {"student_id": student_id},
        sort=[("timestamp", -1)]
    )

    if not data:
        return {"error": "No sensor data found"}

    previous_sessions = list(
        agent_collection.find(
            {"student_id": student_id},
            {"study_state": 1, "_id": 0}
        ).sort("timestamp", -1).limit(3)
    )

    previous_states = [s["study_state"] for s in previous_sessions]

    # 🔐 NEW USER SAFE DEFAULT
    if not previous_states:
        stress_trend = "Stable"
    else:
        stress_trend = get_stress_trend(previous_states)

    state = determine_study_state(
        data["heart_rate"],
        data["gsr"],
        stress_trend
    )

    plan = plan_daily_schedule(
        daily_goal,
        state,
        data["subject_strength"],
        stress_trend
    )

    return {
        "student_id": student_id,
        "subject": data["subject"],
        "study_state": state,
        "stress_trend": stress_trend,
        "daily_plan": plan
    }
