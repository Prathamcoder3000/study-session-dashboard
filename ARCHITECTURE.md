# MongoDB Integration Architecture ------------->>>>>

## System Architecture ->

┌─────────────────────────────────────────────────────────────┐
│                    USER LAYER                               │
│  Student using web application                              │
│  • Study setup                                              │
│  • Dashboard interaction                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (Next.js)                   │
│  Pages                                                      │
│  • /login (Auth)                                            │
│  • /dashboard (Study Dashboard)                             │
│                                                             │
│  Components                                                 │
│  • LoginPageWithDB                                          │
│  • StudySessionDashboardWithDB                              │
│  • SensorDataSimulator                                      │
│                                                             │
│  Responsibilities                                           │
│  • User input                                               │
│  • Simulated sensor data (HR, GSR)                          │
│  • Display AI recommendations                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ REST / HTTP
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (FastAPI)                    │
│                                                             │
│  Authentication APIs                                        │
│  • POST /auth/register                                      │
│  • POST /auth/login                                         │
│                                                             │
│  Study & Sensor APIs                                        │
│  • POST /sensor-data                                       │
│  • POST /run-agent/{userId}                                 │
│  • GET  /schedule/{userId}                                  │
│                                                             │
│  Responsibilities                                           │
│  • Validation                                               │
│  • Orchestration                                            │
│  • Agent triggering                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓ Decision Request
┌─────────────────────────────────────────────────────────────┐
│        INTELLIGENCE LAYER (Agentic AI Engine)               │
│                                                             │
│  Level-2 Model-Based Agentic AI (Rule-Based)                │
│  • No Machine Learning Used                                 │
│                                                             │
│  Internal Modules                                           │
│  • Perception (Sensor Observation)                          │
│  • Internal State Model                                     │
│    - Focused                                                │
│    - Stressed                                               │
│    - Fatigued                                               │
│  • Rule Evaluation Engine                                   │
│  • Decision Generator                                       │
│                                                             │
│  Outputs                                                    │
│  • Study Duration                                           │
│  • Break Duration                                           │
│  • Priority Level                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓ Store / Fetch
┌─────────────────────────────────────────────────────────────┐
│                 DATA LAYER (MongoDB Atlas)                  │
│                                                             │
│  Collections                                                │
│  • Users                                                    │
│  • StudySessions                                            │
│  • SensorReadings                                           │
│  • AgentDecisions                                           │
│                                                             │
│  Stored Data                                                │
│  • User profiles                                            │
│  • Subject data                                             │
│  • Sensor values                                            │
│  • AI decisions                                             │
│  • Generated schedules                                      │
└─────────────────────────────────────────────────────────────┘


-----------------------------------------------------------------------------------

## Authentication Flow ->

          User Opens App
            ↓
          Check Login Status
            ├─ Logged In → Dashboard
            └─ Not Logged In → Login Page
                                ↓
                          Enter Credentials
                                ↓
                  ┌─────────────┴─────────────┐
                  │                           │
              REGISTER                     LOGIN
                  │                           │
          POST /auth/register         POST /auth/login
                  │                           │
          Validate Input              Validate Credentials
          Hash Password               Verify Password
          Store User in MongoDB       Fetch User
                  │                           │
          Return userId               Return userId
                  ↓                           ↓
          Save to localStorage → Redirect to Dashboard


-----------------------------------------------------------------------------------


## Study Session CRUD Flow

Dashboard Opens
    ↓
Fetch Sessions
    ├─ GET /schedule/{userId}
    ├─ Query MongoDB (StudySessions + AgentDecisions)
    └─ Display in Dashboard Table & Charts

User Actions:
    ├─ CREATE
    │   ├─ Fill Study Setup Form
    │   ├─ POST /sensor-data
    │   ├─ POST /run-agent/{userId}
    │   ├─ Agent generates plan
    │   ├─ Save StudySession + AgentDecision in MongoDB
    │   └─ Refresh Dashboard
    │
    ├─ READ
    │   ├─ GET /schedule/{userId}
    │   ├─ Fetch study + AI recommendation
    │   └─ Show details
    │
    ├─ UPDATE
    │   ├─ Modify subject/status
    │   ├─ PUT /study-session/{id}
    │   ├─ Update MongoDB
    │   └─ Refresh dashboard
    │
    └─ DELETE
        ├─ DELETE /study-session/{id}
        ├─ Remove from MongoDB
        └─ Refresh dashboard


-----------------------------------------------------------------------------------


## Data Flow: User Registration

`User Registration Form
   ↓
Validate Input (Email, Password, Name)
   ↓
POST /auth/register
   ├─ Connect to MongoDB
   ├─ Check Email Exists
   │   ├─ YES → Error response
   │   └─ NO → Continue
   ├─ Hash Password (SHA-256 / bcrypt)
   ├─ Create User Document
   ├─ Save in MongoDB
   ├─ Return userId
   ↓
Store userId (localStorage / session)
   ↓
Redirect to Dashboard
   ↓
Dashboard Requests Schedule
   ├─ GET /schedule/{userId}
   └─ Empty state shown (first login)


-----------------------------------------------------------------------------------


## Data Flow: Create Study Session

User Fills Study Setup
   ├─ Subject: Mathematics
   ├─ Topic: Algebra
   ├─ Subject Strength: Weak
   ├─ Simulated Heart Rate
   └─ Simulated GSR
   ↓
POST /sensor-data
   ├─ Validate sensor values
   └─ Store temporary readings
   ↓
POST /run-agent/{userId}
   ├─ Agent observes sensor + subject data
   ├─ Internal State Evaluation
   │   ├─ Focused
   │   ├─ Stressed
   │   └─ Fatigued
   ├─ Rule-Based Decision
   │   ├─ Study Duration
   │   ├─ Break Duration
   │   └─ Priority Level
   ↓
Store in MongoDB
   ├─ StudySessions collection
   └─ AgentDecisions collection
   ↓
GET /schedule/{userId}
   ↓
Update Dashboard
   ├─ Study Plan
   ├─ Break Plan
   └─ Analytics updated


-----------------------------------------------------------------------------------

## File Dependencies

frontend/
├── app/
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   └── study-setup/page.tsx
│
├── components/
│   ├── LoginForm.tsx
│   ├── StudySetupForm.tsx
│   ├── SensorSimulator.tsx
│   └── RecommendationDashboard.tsx
│
└── services/
    └── api.ts (FastAPI calls)

backend/
├── app/
│   ├── main.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── sensor.py
│   │   ├── agent.py
│   │   └── schedule.py
│   │
│   ├── agent/
│   │   ├── perception.py
│   │   ├── state_model.py
│   │   ├── rules.py
│   │   └── decision_engine.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── study_session.py
│   │   └── agent_decision.py
│   │
│   └── db/
│       └── connect.py


------------------------------------------------------------------------------------


## Environment Configuration

```
.env
├── MONGODB_URI=mongodb+srv://user:pass@cluster/db
├── SECRET_KEY=your_secret_key
├── ENV=development
└── PORT=8000


-----------------------------------------------------------------------------------

---

## Request-Response Examples

### Register Request
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response (200):
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Create Session Request
```
POST /api/study-sessions
{
  "userId": "507f1f77bcf86cd799439011",
  "subject": "Math",
  "topic": "Calculus",
  "duration": 60,
  "difficulty": "Hard",
  "notes": "Review derivatives"
}

Response (201):
{
  "message": "Study session created successfully",
  "session": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "subject": "Math",
    "topic": "Calculus",
    "duration": 60,
    "difficulty": "Hard",
    "notes": "Review derivatives",
    "effectiveness": 5,
    "status": "In Progress",
    "date": "2025-01-20T10:30:00Z",
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

-----------------------------------------------------------------------------------

## Technology Stack

Frontend
├─ Next.js (React)
├─ TypeScript
├─ Tailwind CSS
└─ Recharts

Backend
├─ Python
├─ FastAPI
├─ Uvicorn
└─ Rule-Based Agentic AI

Database
├─ MongoDB
└─ MongoDB Atlas


---
