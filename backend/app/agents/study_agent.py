# ================================
# STUDY AGENT LOGIC (AGENTIC AI)
# ================================

def determine_study_state(heart_rate, gsr, stress_trend):
    """
    Determines the mental state of the student
    using physiological signals + stress trend.
    """
    if heart_rate < 85 and gsr < 3 and stress_trend != "Increasing":
        return "Focused"
    elif heart_rate >= 85 or gsr >= 4:
        return "Stressed"
    else:
        return "Fatigued"


def calculate_utility(state, study_time, break_time, stress_trend):
    """
    Utility function to score a study-break option.
    Higher utility = better choice.
    """
    utility = 0

    # Base score by mental state
    if state == "Focused":
        utility += 50
    elif state == "Fatigued":
        utility += 30
    else:  # Stressed
        utility += 10

    # Reward productive time
    utility += study_time // 2

    # Penalize long breaks
    utility -= break_time // 2

    # Learning adjustment using stress trend
    if stress_trend == "Increasing":
        utility -= 10
    elif stress_trend == "Decreasing":
        utility += 10

    return max(utility,5)


def adjust_for_learning(stress_trend, utility_score):
    """
    Simple learning agent logic.
    """
    if stress_trend == "Increasing" and utility_score < 40:
        return "ReduceLoad"
    return "NoChange"


def get_stress_trend(previous_states):
    """
    Determines stress trend from previous agent decisions.
    """
    if not previous_states or len(previous_states) < 2:
        return "Stable"

    if previous_states.count("Stressed") >= 2:
        return "Increasing"
    elif previous_states.count("Focused") >= 2:
        return "Decreasing"
    else:
        return "Stable"


def generate_schedule(state, subject_strength, stress_trend):
    """
    Utility-based decision making for study schedule.
    """
    if state == "Focused":
        options = [(50, 10), (40, 10)]
    elif state == "Stressed":
        options = [(30, 15), (25, 20)]
    else:  # Fatigued
        options = [(20, 20), (25, 25)]

    best_option = None
    best_utility = -999

    for study, break_ in options:
        score = calculate_utility(state, study, break_, stress_trend)
        if score > best_utility:
            best_utility = score
            best_option = (study, break_)

    # Learning agent adjustment
    learning_action = adjust_for_learning(stress_trend, best_utility)

    if learning_action == "ReduceLoad":
        best_option = (
            max(20, best_option[0] - 10),
            best_option[1] + 5
        )

    return best_option[0], best_option[1]

def plan_daily_schedule(
    goal_minutes,
    state,
    subject_strength,
    stress_trend
):
    """
    Level 7 Agent:
    Goal-based + Health-aware + Adaptive planning
    """

    from app.agents.study_agent import (
        generate_schedule,
        balance_health_and_goal
    )

    sessions = []
    completed = 0

    while completed < goal_minutes:
        study_time, break_time = generate_schedule(
            state,
            subject_strength,
            stress_trend
        )

        # 🔹 Multi-objective decision
        action = balance_health_and_goal(
            stress_trend,
            completed,
            goal_minutes
        )

        if action == "ProtectHealth":
            study_time = min(study_time, 20)
            break_time += 5

        elif action == "PushGoal":
            study_time += 10
            break_time = max(5, break_time - 5)

        sessions.append({
            "study_duration": study_time,
            "break_duration": break_time
        })

        completed += study_time

        # Safety stop
        if len(sessions) >= 6:
            break

    return {
        "planned_sessions": sessions,
        "goal_minutes": goal_minutes,
        "completed_minutes": completed,
        "goal_met": completed >= goal_minutes
    }


def balance_health_and_goal(
    stress_trend,
    completed_minutes,
    goal_minutes
):
    """
    Multi-objective decision layer.
    Balances health and productivity.
    """

    if stress_trend == "Increasing":
        return "ProtectHealth"

    if stress_trend == "Decreasing" and completed_minutes < goal_minutes:
        return "PushGoal"

    return "Maintain"
