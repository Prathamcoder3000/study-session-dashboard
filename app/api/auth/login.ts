import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import User from '@/lib/models/User'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Login request started')

    let dbAvailable = true
    try {
      await connectDB()
      console.log('Database connected')
    } catch (dbError) {
      dbAvailable = false
      console.warn('Database connection error, falling back to local storage:', (dbError as any)?.message || String(dbError))
    }

    const { email, password } = await request.json()
    console.log('Login request:', { email })

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      )
    }

    // Find user (DB first, fallback to local file)
    if (dbAvailable) {
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
      if (user.password !== hashedPassword) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }
      console.log('User logged in (DB):', user._id)
      return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email, name: user.name } }, { status: 200 })
    }

    // Local fallback
    const usersFile = path.join(process.cwd(), 'data', 'localUsers.json')
    let localUsers: any[] = []
    try {
      if (fs.existsSync(usersFile)) {
        localUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]')
      }
    } catch (e) {
      console.warn('Could not read local users file')
      localUsers = []
    }

    const found = localUsers.find((u) => u.email === email)
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    if (!found || found.password !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    console.log('User logged in (local):', found.id)
    return NextResponse.json({ message: 'Login successful (local)', user: { id: found.id, email: found.email, name: found.name } }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
