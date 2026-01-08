import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
    },
    topic: {
      type: String,
      required: [true, 'Please provide a topic'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide duration in minutes'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    notes: {
      type: String,
      default: '',
    },
    effectiveness: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Paused'],
      default: 'In Progress',
    },
  },
  { timestamps: true }
)

export default mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema)
