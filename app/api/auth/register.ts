import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import User from '@/lib/models/User'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request started')
    
    let dbAvailable = true
    try {
      await connectDB()
      console.log('Database connected')
    } catch (dbError) {
      dbAvailable = false
      console.warn('Database connection error, falling back to local storage:', (dbError as any)?.message || String(dbError))
    }

    const { email, password, name } = await request.json()
    console.log('Request body parsed:', { email, name })

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Please provide email, password, and name' },
        { status: 400 }
      )
    }

    // Check if user already exists (DB or local)
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

    if (dbAvailable) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      const user = await User.create({ email, password: hashedPassword, name })
      console.log('User created (DB):', user._id)
      return NextResponse.json({ message: 'User registered successfully', user: { id: user._id, email: user.email, name: user.name } }, { status: 201 })
    }

    // DB not available — use local fallback JSON file
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
    const usersFile = path.join(dataDir, 'localUsers.json')
    let localUsers = []
    try {
      if (fs.existsSync(usersFile)) {
        localUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]')
      }
    } catch (e) {
      console.warn('Could not read local users file, creating fresh one')
      localUsers = []
    }

    if (localUsers.find((u: any) => u.email === email)) {
      return NextResponse.json({ error: 'User already exists (local)' }, { status: 400 })
    }

    const localUser = { id: `local_${Date.now()}`, email, password: hashedPassword, name }
    localUsers.push(localUser)
    fs.writeFileSync(usersFile, JSON.stringify(localUsers, null, 2))
    console.log('User created (local):', localUser.id)
    return NextResponse.json({ message: 'User registered locally (DB unreachable)', user: { id: localUser.id, email: localUser.email, name: localUser.name } }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
