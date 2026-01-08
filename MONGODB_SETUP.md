# MongoDB Integration Guide for Study Session Dashboard

## Overview
Your Next.js study-session-dashboard project has been fully integrated with MongoDB. This guide will help you set up and use the database.

## Setup Instructions

### 1. MongoDB Connection
Update your `.env.local` file with your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/study_session_db?retryWrites=true&w=majority
NODE_ENV=development
```

To get your MongoDB URI:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a cluster
4. Get the connection string and replace with your username and password

### 2. Project Structure

```
lib/
  db/
    connect.ts          # MongoDB connection setup
  models/
    User.ts             # User model/schema
    StudySession.ts     # Study session model/schema

app/api/
  auth/
    login.ts            # Login endpoint
    register.ts         # Registration endpoint
  study-sessions/
    route.ts            # Get & Create study sessions
    [id]/route.ts       # Get, Update, Delete specific session

components/
  login-page-with-db.tsx              # Enhanced login component
  study-session-dashboard-with-db.tsx # Enhanced dashboard component
```

## API Endpoints

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Study Session Endpoints

#### Get All Sessions
- **GET** `/api/study-sessions?userId=user_id`
- **Response:**
```json
{
  "message": "Study sessions retrieved successfully",
  "sessions": [...]
}
```

#### Create New Session
- **POST** `/api/study-sessions`
- **Body:**
```json
{
  "userId": "user_id",
  "subject": "Mathematics",
  "topic": "Calculus",
  "duration": 60,
  "difficulty": "Hard",
  "notes": "Focus on derivatives"
}
```

#### Get Specific Session
- **GET** `/api/study-sessions/[id]`

#### Update Session
- **PUT** `/api/study-sessions/[id]`
- **Body:**
```json
{
  "status": "Completed",
  "effectiveness": 8
}
```

#### Delete Session
- **DELETE** `/api/study-sessions/[id]`

## Database Models

### User Model
```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password: string (hashed, required),
  name: string (required),
  createdAt: Date,
  updatedAt: Date
}
```

### StudySession Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  subject: string,
  topic: string,
  duration: number (in minutes),
  difficulty: "Easy" | "Medium" | "Hard",
  notes: string,
  effectiveness: number (1-10),
  date: Date,
  status: "In Progress" | "Completed" | "Paused",
  completedAt: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Features

### 1. User Authentication
- Register new users with email and strong password requirements
- Login with email and password
- Secure password hashing

### 2. Study Session Management
- Create new study sessions
- Track subject, topic, duration, and difficulty
- Update session status and effectiveness ratings
- Delete sessions
- View all user sessions with statistics

### 3. Dashboard Features
- View total sessions and study hours
- Track completion rate
- Calculate average effectiveness rating
- Visualize study time by subject with charts
- Light/Dark theme support

### 4. User Experience
- Responsive design
- Real-time error handling
- Loading states
- Theme persistence
- Automatic logout

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Security Notes

1. **Password Hashing**: Currently uses SHA256 (for production, use bcrypt)
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env.local` to version control
4. **API Authentication**: Consider adding JWT tokens for better security

## Enhancement Suggestions

1. Add JWT authentication tokens
2. Implement session refresh tokens
3. Add input validation middleware
4. Create admin dashboard
5. Add email verification
6. Implement password reset functionality
7. Add study session analytics
8. Create notification system
9. Add user profile management
10. Implement data export features

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB URI is correct in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database name in connection string

### API Errors
- Check browser console for detailed error messages
- Review server logs in terminal
- Ensure all required fields are provided in requests

### Authentication Issues
- Clear localStorage and log in again
- Check if user email already exists (for registration)
- Verify password meets all requirements

## Support
For MongoDB documentation: https://docs.mongodb.com/
For Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
