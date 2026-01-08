from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, sensors, agent, schedule

app = FastAPI(title="Smart Study Planner Backend")

# ✅ ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(sensors.router)
app.include_router(agent.router)
app.include_router(schedule.router)
