import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Import after all other imports
let User: any = null
let connectDB: any = null

async function initializeDB() {
  if (!User) {
    const { default: UserModel } = await import('@/lib/models/User')
    const { connectDB: connectFn } = await import('@/lib/db/connect')
    User = UserModel
    connectDB = connectFn
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action')

    // Initialize DB
    try {
      await initializeDB()
      if (connectDB) await connectDB()
    } catch (dbError: any) {
      console.error('Database initialization error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: dbError?.message || String(dbError),
          type: 'DB_CONNECTION_ERROR'
        },
        { status: 500 }
      )
    }

    if (action === 'register') {
      try {
        const body = await request.json()
        const { email, password, name } = body

        if (!email || !password || !name) {
          return NextResponse.json(
            { error: 'Missing required fields: email, password, name' },
            { status: 400 }
          )
        }

        // Check existing user
        try {
          const existingUser = await User.findOne({ email })
          if (existingUser) {
            return NextResponse.json(
              { error: 'User already exists with this email' },
              { status: 400 }
            )
          }
        } catch (queryError: any) {
          console.error('User query error:', queryError)
          return NextResponse.json(
            { error: 'Failed to check user', details: queryError?.message },
            { status: 500 }
          )
        }

        // Create user
        try {
          const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
          const user = await User.create({
            email,
            password: hashedPassword,
            name,
          })

          return NextResponse.json(
            {
              message: 'User registered successfully',
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
              },
            },
            { status: 201 }
          )
        } catch (createError: any) {
          console.error('User creation error:', createError)
          return NextResponse.json(
            { error: 'Failed to create user', details: createError?.message },
            { status: 500 }
          )
        }
      } catch (parseError: any) {
        console.error('Request parse error:', parseError)
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        )
      }
    } else if (action === 'login') {
      try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
          return NextResponse.json(
            { error: 'Email and password are required' },
            { status: 400 }
          )
        }

        try {
          const user = await User.findOne({ email }).select('+password')
          if (!user) {
            return NextResponse.json(
              { error: 'Invalid email or password' },
              { status: 401 }
            )
          }

          const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
          if (user.password !== hashedPassword) {
            return NextResponse.json(
              { error: 'Invalid email or password' },
              { status: 401 }
            )
          }

          return NextResponse.json(
            {
              message: 'Login successful',
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
              },
            },
            { status: 200 }
          )
        } catch (queryError: any) {
          console.error('Login query error:', queryError)
          return NextResponse.json(
            { error: 'Login failed', details: queryError?.message },
            { status: 500 }
          )
        }
      } catch (parseError: any) {
        console.error('Request parse error:', parseError)
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use ?action=register or ?action=login' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Unhandled error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || String(error),
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
