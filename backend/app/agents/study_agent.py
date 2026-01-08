def determine_study_state(heart_rate, gsr):
    if heart_rate < 85 and gsr < 3:
        return "Focused"
    elif heart_rate >= 85 and gsr >= 4:
        return "Stressed"
    else:
        return "Fatigued"


def generate_schedule(state, subject_strength):
    if state == "Focused":
        if subject_strength == "strong":
            return 50, 10
        else:
            return 40, 10

    if state == "Stressed":
        return 30, 15

    if state == "Fatigued":
        return 20, 20
