import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import StudySession from '@/lib/models/StudySession'

// GET all study sessions for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const sessions = await StudySession.find({ userId }).sort({ createdAt: -1 })

    return NextResponse.json(
      {
        message: 'Study sessions retrieved successfully',
        sessions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// CREATE a new study session
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { userId, subject, topic, duration, difficulty, notes } = await request.json()

    if (!userId || !subject || !topic || !duration) {
      return NextResponse.json(
        { error: 'Please provide userId, subject, topic, and duration' },
        { status: 400 }
      )
    }

    const session = await StudySession.create({
      userId,
      subject,
      topic,
      duration,
      difficulty: difficulty || 'Medium',
      notes: notes || '',
    })

    return NextResponse.json(
      {
        message: 'Study session created successfully',
        session,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
