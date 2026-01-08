// scripts/test-mongo.js
require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
console.log('MONGODB_URI present:', !!uri)
if (!uri) {
  console.error('Set MONGODB_URI in .env.local')
  process.exit(1)
}

mongoose.connect(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 10000 })
  .then(() => { console.log('Connected to MongoDB OK'); process.exit(0) })
  .catch(err => { console.error('Mongo connect error:', err.message); console.error(err); process.exit(2) })
