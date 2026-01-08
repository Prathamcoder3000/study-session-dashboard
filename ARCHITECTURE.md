# MongoDB Integration Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Pages                                  │ │
│  │  • / (Home/Landing)                                      │ │
│  │  • /login (Login/Register)                               │ │
│  │  • /dashboard (Study Dashboard)                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  Components                              │ │
│  │  • LoginPageWithDB (Login/Register UI)                   │ │
│  │  • StudySessionDashboardWithDB (Dashboard UI)            │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Next.js API)                      │
│  ┌──────────────────────────────────────────────────────┬──┐ │
│  │          Authentication Routes                       │  │ │
│  │  POST /api/auth/register (Create User)              │  │ │
│  │  POST /api/auth/login (Verify User)                 │  │ │
│  └──────────────────────────────────────────────────────┴──┘ │
│  ┌──────────────────────────────────────────────────────┬──┐ │
│  │       Study Session Routes (CRUD)                   │  │ │
│  │  GET  /api/study-sessions?userId=X (List)           │  │ │
│  │  POST /api/study-sessions (Create)                  │  │ │
│  │  GET  /api/study-sessions/[id] (Read)               │  │ │
│  │  PUT  /api/study-sessions/[id] (Update)             │  │ │
│  │  DELETE /api/study-sessions/[id] (Delete)           │  │ │
│  └──────────────────────────────────────────────────────┴──┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Data Access Layer (lib/db)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           connect.ts (MongoDB Connection Manager)      │ │
│  │  • Manages connection pooling                          │ │
│  │  • Caches connection                                   │ │
│  │  • Handles connection reuse                            │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           Database Models Layer (lib/models)                │
│  ┌──────────────────────┐  ┌────────────────────────────┐   │
│  │   User.ts (Schema)   │  │ StudySession.ts (Schema)   │   │
│  │                      │  │                            │   │
│  │ • _id                │  │ • _id                      │   │
│  │ • email (unique)     │  │ • userId (ref: User)       │   │
│  │ • password (hashed)  │  │ • subject                  │   │
│  │ • name               │  │ • topic                    │   │
│  │ • createdAt          │  │ • duration (minutes)       │   │
│  │ • updatedAt          │  │ • difficulty               │   │
│  │                      │  │ • notes                    │   │
│  │                      │  │ • effectiveness (1-10)     │   │
│  │                      │  │ • status                   │   │
│  │                      │  │ • date                     │   │
│  │                      │  │ • createdAt                │   │
│  │                      │  │ • updatedAt                │   │
│  └──────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                            │
│  ┌──────────────────────┐  ┌────────────────────────────┐   │
│  │  Users Collection    │  │ StudySessions Collection   │   │
│  │  ├─ user@x.com       │  │ ├─ {userId, subject,...}   │   │
│  │  ├─ user2@y.com      │  │ ├─ {userId, subject,...}   │   │
│  │  └─ ...              │  │ └─ ...                     │   │
│  └──────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
User Visits App
    ↓
└─→ Logged In?
    ├─ YES → Go to Dashboard
    └─ NO  → Go to Login Page
              ↓
              User Enters Credentials
              ↓
              Register or Login?
              ├─ REGISTER
              │   ├─ POST /api/auth/register
              │   ├─ Validate Input
              │   ├─ Hash Password (SHA256)
              │   ├─ Create User in MongoDB
              │   ├─ Save userId to localStorage
              │   └─ Go to Dashboard
              │
              └─ LOGIN
                  ├─ POST /api/auth/login
                  ├─ Find User in MongoDB
                  ├─ Verify Password
                  ├─ Save userId to localStorage
                  └─ Go to Dashboard
```

---

## Study Session CRUD Flow

```
Dashboard Opens
    ↓
Fetch Sessions
    ├─ GET /api/study-sessions?userId=user_id
    ├─ Query MongoDB
    └─ Display in Table

User Actions:
    ├─ CREATE
    │   ├─ Fill Form
    │   ├─ POST /api/study-sessions
    │   ├─ Save to MongoDB
    │   └─ Refresh List
    │
    ├─ READ
    │   ├─ GET /api/study-sessions/[id]
    │   ├─ Query MongoDB
    │   └─ Show Details
    │
    ├─ UPDATE
    │   ├─ Click Edit/Complete
    │   ├─ PUT /api/study-sessions/[id]
    │   ├─ Update in MongoDB
    │   └─ Refresh List
    │
    └─ DELETE
        ├─ Click Delete
        ├─ DELETE /api/study-sessions/[id]
        ├─ Remove from MongoDB
        └─ Refresh List
```

---

## Data Flow: User Registration

```
User Form
  ↓
Validate Input (Email, Password, Name)
  ↓
POST /api/auth/register
  ├─ Connect to MongoDB
  ├─ Check if Email Exists
  │  ├─ YES → Return Error
  │  └─ NO → Continue
  ├─ Hash Password
  ├─ Create User Document
  ├─ Save to MongoDB
  ├─ Return User Data
  ↓
Store userId in localStorage
  ↓
Redirect to Dashboard
  ↓
Dashboard Fetches Sessions
  ├─ GET /api/study-sessions?userId=user_id
  └─ Display Empty (First Time)
```

---

## Data Flow: Create Study Session

```
User Fills Form
  ├─ Subject: "Mathematics"
  ├─ Topic: "Algebra"
  ├─ Duration: 60 minutes
  ├─ Difficulty: "Medium"
  └─ Notes: "Focus on equations"
  ↓
Validate Form
  ├─ Subject required
  ├─ Topic required
  ├─ Duration > 0
  └─ ✓ All Valid
  ↓
POST /api/study-sessions
  ├─ Connect to MongoDB
  ├─ Create Document
  │  ├─ userId: (from localStorage)
  │  ├─ subject: "Mathematics"
  │  ├─ topic: "Algebra"
  │  ├─ duration: 60
  │  ├─ difficulty: "Medium"
  │  ├─ notes: "Focus on equations"
  │  ├─ effectiveness: 5 (default)
  │  ├─ status: "In Progress"
  │  ├─ date: (now)
  │  ├─ createdAt: (now)
  │  └─ updatedAt: (now)
  ├─ Save to StudySessions Collection
  └─ Return Session Data
  ↓
Add to Sessions List
  ↓
Update Dashboard Statistics
  ├─ Total Sessions: +1
  ├─ Total Hours: +1
  └─ Chart Updated
  ↓
Clear Form & Close Modal
```

---

## File Dependencies

```
pages/
├── login/page.tsx
│   └── imports LoginPageWithDB
│       └── imports from lib/models
│       └── fetch calls to /api/auth/*
│
├── dashboard/page.tsx
│   └── imports StudySessionDashboardWithDB
│       └── imports from lib/models
│       └── fetch calls to /api/study-sessions/*
│
└── study-setup/page.tsx
    └── redirects to /dashboard

api/
├── auth/
│   ├── register.ts
│   │   ├── imports connectDB
│   │   └── imports User model
│   │
│   └── login.ts
│       ├── imports connectDB
│       └── imports User model
│
└── study-sessions/
    ├── route.ts
    │   ├── imports connectDB
    │   └── imports StudySession model
    │
    └── [id]/route.ts
        ├── imports connectDB
        └── imports StudySession model

lib/
├── db/
│   └── connect.ts
│       └── imports mongoose
│
└── models/
    ├── User.ts
    │   └── imports mongoose
    │
    └── StudySession.ts
        └── imports mongoose
```

---

## Environment Configuration

```
.env.local
├── MONGODB_URI
│   └─ mongodb+srv://user:pass@cluster.mongodb.net/db_name
│
└── NODE_ENV
    └─ development (or production)
```

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

---

## Technology Stack

```
Frontend Layer
├─ React 19.2.0
├─ Next.js 16.0.10
├─ TypeScript
├─ Tailwind CSS
├─ Recharts (charts)
└─ Radix UI (components)

Backend Layer
├─ Next.js API Routes
├─ Mongoose 9.1.0
├─ MongoDB Driver 7.0.0
└─ Node.js (runtime)

Database
├─ MongoDB
├─ MongoDB Atlas (cloud)
└─ Collections (Users, StudySessions)
```

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Scalable MongoDB integration
- ✅ RESTful API endpoints
- ✅ Type-safe TypeScript models
- ✅ Real-time data synchronization
- ✅ Secure authentication flow
- ✅ Comprehensive error handling
