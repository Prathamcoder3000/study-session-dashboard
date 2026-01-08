import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import StudySession from '@/lib/models/StudySession'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await StudySession.findById(params.id)

    if (!session) {
      return NextResponse.json(
        { error: 'Study session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Study session retrieved successfully',
        session,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const updateData = await request.json()

    const session = await StudySession.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!session) {
      return NextResponse.json(
        { error: 'Study session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Study session updated successfully',
        session,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await StudySession.findByIdAndDelete(params.id)

    if (!session) {
      return NextResponse.json(
        { error: 'Study session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Study session deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
