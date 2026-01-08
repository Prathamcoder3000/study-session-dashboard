import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

console.log('MONGODB_URI exists:', !!MONGODB_URI)

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local')
}

interface CachedConn {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use type-safe global access
const global_with_mongoose = global as unknown as {
  mongoose?: CachedConn
}

let cached: CachedConn = global_with_mongoose.mongoose ?? { conn: null, promise: null }

if (!global_with_mongoose.mongoose) {
  global_with_mongoose.mongoose = cached
}

export async function connectDB() {
  if (cached.conn) {
    console.log('✓ Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('🔄 Creating new MongoDB connection...')
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((connection) => {
        console.log('✓ MongoDB connected successfully')
        return connection
      })
      .catch((error) => {
        console.error('✗ MongoDB connection failed:', error.message)
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
