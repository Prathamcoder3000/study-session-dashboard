"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Heart,
  Target,
  Clock,
  Download,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  User,
  Sun,
  Moon,
  TrendingDown,
  Zap,
  Brain,
  LucidePieChart,
  Lightbulb,
  Award,
  X,
  Calendar,
  Trash2,
} from "lucide-react" // Added LucidePieChart
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { useRouter } from "next/navigation"

interface StudySession {
  student_id: string
  subject: string
  subject_strength: string
  planned_study_duration: number
  preferred_time_of_day: string
  preferred_break_duration: number
  avg_heart_rate_bpm: number
  gsr_value: number
  stress_index: "Low" | "Medium" | "High"
  detected_study_state: string
  recommended_study_duration: number
  recommended_break_duration: number
  subject_priority: string
  daily_study_plan_text: string
}

type ScheduledReview = {
  id: string
  student: string
  date: string
  time: string
  notes: string
  createdAt: Date
}



// Mock functions and data structures from updates
// These would ideally be imported or defined more robustly
const getRecommendations = () => {
  // Placeholder for actual recommendation data structure
  return [
    {
      type: "warning",
      priority: "high",
      category: "Mental Health",
      title: "High Stress Detected",
      description: "High stress levels detected.",
      impact: 85,
      actionSteps: ["Step 1", "Step 2"],
      metric: "85% High Stress Sessions",
    },
    {
      type: "info",
      priority: "medium",
      category: "Time Management",
      title: "Peak Performance: Morning",
      description: "Morning sessions are most effective.",
      impact: 71,
      actionSteps: ["Schedule important tasks in the morning."],
      metric: "23% Lower Stress",
    },
  ]
}

const mockStudySessions: StudySession[] = [
  {
    student_id: "S01",
    subject: "Math",
    subject_strength: "Weak",
    planned_study_duration: 45,
    preferred_time_of_day: "Morning",
    preferred_break_duration: 10,
    avg_heart_rate_bpm: 78,
    gsr_value: 4.2,
    stress_index: "High",
    detected_study_state: "Stressed",
    recommended_study_duration: 30,
    recommended_break_duration: 15,
    subject_priority: "High",
    daily_study_plan_text: "Focus on algebra and calculus basics with frequent breaks",
  },
  {
    student_id: "S01",
    subject: "Physics",
    subject_strength: "Strong",
    planned_study_duration: 60,
    preferred_time_of_day: "Afternoon",
    preferred_break_duration: 10,
    avg_heart_rate_bpm: 72,
    gsr_value: 3.1,
    stress_index: "Low",
    detected_study_state: "Focused",
    recommended_study_duration: 50,
    recommended_break_duration: 10,
    subject_priority: "Medium",
    daily_study_plan_text: "Continue with mechanics and thermodynamics chapters",
  },
  {
    student_id: "S02",
    subject: "Chemistry",
    subject_strength: "Weak",
    planned_study_duration: 40,
    preferred_time_of_day: "Evening",
    preferred_break_duration: 15,
    avg_heart_rate_bpm: 85,
    gsr_value: 5.8,
    stress_index: "Medium",
    detected_study_state: "Anxious",
    recommended_study_duration: 25,
    recommended_break_duration: 20,
    subject_priority: "High",
    daily_study_plan_text: "Review organic chemistry reactions with visual aids",
  },
  {
    student_id: "S02",
    subject: "Math",
    subject_strength: "Strong",
    planned_study_duration: 55,
    preferred_time_of_day: "Morning",
    preferred_break_duration: 10,
    avg_heart_rate_bpm: 70,
    gsr_value: 2.9,
    stress_index: "Low",
    detected_study_state: "Focused",
    recommended_study_duration: 45,
    recommended_break_duration: 10,
    subject_priority: "Low",
    daily_study_plan_text: "Practice advanced problem sets and competitive math",
  },
  {
    student_id: "S02",
    subject: "Physics",
    subject_strength: "Weak",
    planned_study_duration: 50,
    preferred_time_of_day: "Afternoon",
    preferred_break_duration: 12,
    avg_heart_rate_bpm: 82,
    gsr_value: 4.7,
    stress_index: "High",
    detected_study_state: "Stressed",
    recommended_study_duration: 35,
    recommended_break_duration: 18,
    subject_priority: "High",
    daily_study_plan_text: "Work on conceptual understanding with practical examples",
  },
  {
    student_id: "S03",
    subject: "Biology",
    subject_strength: "Strong",
    planned_study_duration: 70,
    preferred_time_of_day: "Morning",
    preferred_break_duration: 10,
    avg_heart_rate_bpm: 68,
    gsr_value: 2.5,
    stress_index: "Low",
    detected_study_state: "Focused",
    recommended_study_duration: 60,
    recommended_break_duration: 10,
    subject_priority: "Low",
    daily_study_plan_text: "Deep dive into cellular biology and genetics",
  },
  {
    student_id: "S03",
    subject: "Chemistry",
    subject_strength: "Weak",
    planned_study_duration: 45,
    preferred_time_of_day: "Evening",
    preferred_break_duration: 15,
    avg_heart_rate_bpm: 88,
    gsr_value: 6.1,
    stress_index: "High",
    detected_study_state: "Anxious",
    recommended_study_duration: 30,
    recommended_break_duration: 20,
    subject_priority: "High",
    daily_study_plan_text: "Start with simple stoichiometry and gradually increase difficulty",
  },
]

export function StudySessionDashboard() {
  const [currentUser, setCurrentUser] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"home" | "analytics" | "recommendations">("home")
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [visibleRows, setVisibleRows] = useState(5)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false) // Changed name for consistency
  const [showReviewsList, setShowReviewsList] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [scheduleNotes, setScheduleNotes] = useState("")
  const [scheduledReviews, setScheduledReviews] = useState<ScheduledReview[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>(mockStudySessions) // Initialize with mock data

  const router = useRouter()
 

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || ""
    const name = localStorage.getItem("userName") || "User"
    setCurrentUser(userEmail)
    setUserName(name)

    const savedSessions = localStorage.getItem("studySessions")
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions)
      // Merge with mock data for demo purposes
      setStudySessions([...parsedSessions, ...mockStudySessions])
    }

    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      document.documentElement.classList.add("dark")
    }

    const savedReviews = localStorage.getItem("scheduledReviews")
    if (savedReviews) {
      setScheduledReviews(JSON.parse(savedReviews))
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName") // Added for consistency
    router.push("/")
  }

  const filteredSessions = studySessions.filter((s) => s.student_id === currentUser)

  const paginatedSessions = filteredSessions.slice(0, visibleRows)
  const hasMore = visibleRows < filteredSessions.length

  const handleViewMore = () => {
    setVisibleRows((prev) => Math.min(prev + 5, filteredSessions.length))
  }

  useEffect(() => {
    setVisibleRows(5)
  }, [filteredSessions]) // Depend on filteredSessions which now depends on currentUser

  const analytics = useMemo(() => {
    const avgHeartRate =
      filteredSessions.reduce((sum, s) => sum + s.avg_heart_rate_bpm, 0) / filteredSessions.length || 0
    const avgGSR = filteredSessions.reduce((sum, s) => sum + s.gsr_value, 0) / filteredSessions.length || 0

    const stressLow = filteredSessions.filter((s) => s.stress_index === "Low").length
    const stressMedium = filteredSessions.filter((s) => s.stress_index === "Medium").length
    const stressHigh = filteredSessions.filter((s) => s.stress_index === "High").length

    const avgStudyTime =
      filteredSessions.reduce((sum, s) => sum + s.recommended_study_duration, 0) / filteredSessions.length || 0
    const avgBreakTime =
      filteredSessions.reduce((sum, s) => sum + s.recommended_break_duration, 0) / filteredSessions.length || 0

    const subjectPerformance = filteredSessions.reduce(
      (acc, s) => {
        if (!acc[s.subject]) {
          acc[s.subject] = { weak: 0, strong: 0 }
        }
        if (s.subject_strength === "Weak") acc[s.subject].weak++
        else acc[s.subject].strong++
        return acc
      },
      {} as Record<string, { weak: number; strong: number }>,
    )

    const bestTimeOfDay = filteredSessions.reduce(
      (acc, s) => {
        const key = s.preferred_time_of_day
        if (!acc[key]) acc[key] = []
        acc[key].push(s.stress_index === "Low" ? 1 : s.stress_index === "Medium" ? 0.5 : 0)
        return acc
      },
      {} as Record<string, number[]>,
    )

    const bestTime =
      Object.entries(bestTimeOfDay)
        .map(([time, scores]) => ({
          time,
          avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        }))
        .sort((a, b) => b.avgScore - a.avgScore)[0]?.time || "Morning"

    const heartRateTrend = filteredSessions.map((s, idx) => ({
      session: `S${idx + 1}`, // Use index for session identifier if date is not reliable or for simpler chart labels
      heartRate: s.avg_heart_rate_bpm,
      gsr: s.gsr_value,
      // date: s.date, // Removed as date is not in the updated schema
    }))
    // .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Removed sorting by date

    const timeOfDayData = Object.entries(bestTimeOfDay).map(([time, scores]) => ({
      time,
      sessions: scores.length,
      avgScore: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100),
      lowStress: scores.filter((s) => s === 1).length,
      mediumStress: scores.filter((s) => s === 0.5).length,
      highStress: scores.filter((s) => s === 0).length,
    }))

    const subjectRadarData = Object.entries(subjectPerformance).map(([subject, perf]) => ({
      subject,
      score: perf.strong + perf.weak > 0 ? Math.round((perf.strong / (perf.strong + perf.weak)) * 100) : 0, // Avoid division by zero
      sessions: perf.strong + perf.weak,
    }))

    const stressPieData = [
      { name: "Low", value: stressLow, color: "#10b981" },
      { name: "Medium", value: stressMedium, color: "#f59e0b" },
      { name: "High", value: stressHigh, color: "#ef4444" },
    ]

    const studyEfficiency =
      filteredSessions.length > 0
        ? Math.round((stressLow / filteredSessions.length) * 100 * (avgStudyTime / (avgStudyTime + avgBreakTime)))
        : 0

    const productivityScore =
      filteredSessions.length > 0
        ? Math.round(((stressLow * 3 + stressMedium * 1.5 + stressHigh * 0.5) / (filteredSessions.length * 3)) * 100)
        : 0

    const focusTimeData = filteredSessions.map((s, idx) => ({
      session: `Session ${idx + 1}`, // Using a simple session label
      studyTime: s.recommended_study_duration,
      breakTime: s.recommended_break_duration,
      efficiency:
        s.recommended_study_duration + s.recommended_break_duration > 0
          ? Math.round(
              (s.recommended_study_duration / (s.recommended_study_duration + s.recommended_break_duration)) * 100,
            )
          : 0,
    }))

    return {
      avgHeartRate,
      avgGSR,
      stressDistribution: { low: stressLow, medium: stressMedium, high: stressHigh },
      stressPercentages: {
        low: Math.round((stressLow / filteredSessions.length) * 100),
        medium: Math.round((stressMedium / filteredSessions.length) * 100),
        high: Math.round((stressHigh / filteredSessions.length) * 100),
      },
      avgStudyTime,
      avgBreakTime,
      subjectPerformance,
      bestTimeOfDay: bestTime,
      heartRateTrend,
      timeOfDayData,
      subjectRadarData,
      stressPieData,
      studyEfficiency,
      productivityScore,
      focusTimeData,
    }
  }, [filteredSessions]) // Depend on filteredSessions

  // Updated recommendations generation to use new attribute names and data
  const getStudentRecommendations = () => {
    const recs: Array<{
      type: "warning" | "success" | "info"
      priority: "high" | "medium" | "low"
      category: string
      title: string
      description: string
      impact: number
      actionSteps: string[]
      metric: string
    }> = []

    const totalSessions = filteredSessions.length
    if (totalSessions === 0) return recs // Return early if no sessions

    // Stress-based recommendations
    if (analytics.stressPercentages.high > 40) {
      recs.push({
        type: "warning",
        priority: "high",
        category: "Mental Health",
        title: "High Stress Detected",
        description: `Over ${analytics.stressPercentages.high}% of your sessions show high stress levels. This may impact learning retention and overall wellbeing.`,
        impact: 85,
        actionSteps: [
          "Practice 5-10 minutes of mindfulness meditation before studying.",
          "Use the Pomodoro Technique (25 min study, 5 min break).",
          "Create a calm study environment with reduced distractions.",
          "Consider scheduling sessions during your peak productivity hours.",
        ],
        metric: `${analytics.stressPercentages.high}% High Stress Sessions`,
      })
    }

    // Heart rate recommendations
    if (analytics.avgHeartRate > 85) {
      recs.push({
        type: "warning",
        priority: "high",
        category: "Physiological",
        title: "Elevated Heart Rate Pattern",
        description: `Your average heart rate of ${analytics.avgHeartRate} bpm indicates heightened physiological stress during study sessions.`,
        impact: 78,
        actionSteps: [
          "Try box breathing: inhale 4 seconds, hold 4, exhale 4, hold 4.",
          "Take a 10-minute walk before starting study sessions.",
          "Ensure proper hydration throughout the day.",
          "Review and adjust caffeine intake timing.",
        ],
        metric: `${analytics.avgHeartRate} BPM Average`,
      })
    } else if (analytics.avgHeartRate < 75) {
      recs.push({
        type: "success",
        priority: "low",
        category: "Physiological",
        title: "Optimal Heart Rate",
        description: `Your average heart rate of ${analytics.avgHeartRate} bpm indicates excellent stress management during study sessions.`,
        impact: 92,
        actionSteps: [
          "Continue current stress management practices.",
          "Share your techniques with peers.",
          "Maintain a consistent sleep schedule.",
        ],
        metric: `${analytics.avgHeartRate} BPM Average`,
      })
    }

    // Time optimization recommendations
    recs.push({
      type: "info",
      priority: "medium",
      category: "Time Management",
      title: `Peak Performance: ${analytics.bestTimeOfDay}`,
      description: `Data analysis shows your ${analytics.bestTimeOfDay.toLowerCase()} sessions have generally lower stress levels and better focus.`,
      impact: 71,
      actionSteps: [
        `Schedule your most challenging subjects during ${analytics.bestTimeOfDay.toLowerCase()}.`,
        "Block this time in your calendar as protected study time.",
        "Tackle high-priority tasks when your brain is most alert.",
        "Use other times for review and lighter materials.",
      ],
      metric: `23% Lower Stress (Estimated)`, // Placeholder metric
    })

    // Subject-specific recommendations
    Object.entries(analytics.subjectPerformance).forEach(([subject, performance]) => {
      if (performance.weak > performance.strong) {
        const weakPercentage = Math.round((performance.weak / (performance.weak + performance.strong)) * 100)
        recs.push({
          type: "info",
          priority: weakPercentage > 60 ? "high" : "medium",
          category: "Subject Mastery",
          title: `${subject} Requires Attention`,
          description: `${weakPercentage}% of ${subject} sessions show weaker performance. Strategic intervention can improve outcomes.`,
          impact: 68,
          actionSteps: [
            "Break down complex topics into smaller, manageable chunks.",
            "Use active recall and spaced repetition techniques.",
            "Create summary notes and flashcards for key concepts.",
            "Consider study groups or tutoring for difficult areas.",
          ],
          metric: `${weakPercentage}% Weak Performance`,
        })
      }
    })

    // Break optimization
    if (analytics.avgBreakTime < 10) {
      recs.push({
        type: "warning",
        priority: "high",
        category: "Recovery",
        title: "Break Time Insufficient",
        description: `Your current ${analytics.avgBreakTime.toFixed(0)} min breaks are below optimal. Research shows 10-15 min breaks can improve retention by up to 20%.`,
        impact: 82,
        actionSteps: [
          "Implement 10-15 minute breaks after every 50-60 minutes of focused study.",
          "Use breaks for physical movement, not screen time.",
          "Try the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.",
          "Step outside for fresh air during longer breaks.",
        ],
        metric: `${analytics.avgBreakTime.toFixed(0)} Min Average`,
      })
    } else if (analytics.avgBreakTime > 20) {
      recs.push({
        type: "info",
        priority: "low",
        category: "Recovery",
        title: "Optimize Break Quality",
        description: `Your ${analytics.avgBreakTime.toFixed(0)} min breaks are well-timed. Focus on making them more effective for mental recovery.`,
        impact: 65,
        actionSteps: [
          "Engage in light physical activity (stretching, walking).",
          "Avoid social media during breaks to prevent cognitive drain.",
          "Practice brief meditation or deep breathing exercises.",
          "Stay hydrated and have healthy snacks available.",
        ],
        metric: `${analytics.avgBreakTime.toFixed(0)} Min Average`,
      })
    }

    // GSR-based arousal recommendations
    if (analytics.avgGSR > 4.5) {
      recs.push({
        type: "warning",
        priority: "medium",
        category: "Physiological",
        title: "High Arousal Detected",
        description: `An average GSR value of ${analytics.avgGSR.toFixed(1)} indicates elevated arousal. This may signal anxiety or overexcitement affecting focus.`,
        impact: 73,
        actionSteps: [
          "Practice progressive muscle relaxation before sessions.",
          "Reduce stimulant intake 2-3 hours before studying.",
          "Create pre-study rituals to signal calm focus time.",
          "Consider calming background music or white noise.",
        ],
        metric: `${analytics.avgGSR.toFixed(1)} µS GSR Level`,
      })
    }

    // Productivity recommendations based on study/break ratio
    const studyBreakRatio = analytics.avgStudyTime / analytics.avgBreakTime
    if (studyBreakRatio > 5 && analytics.avgBreakTime > 0) {
      recs.push({
        type: "warning",
        priority: "medium",
        category: "Balance",
        title: "Study-Break Imbalance",
        description: `Your study-to-break ratio of ${studyBreakRatio.toFixed(1)}:1 is high. Balanced intervals enhance long-term retention.`,
        impact: 70,
        actionSteps: [
          "Aim for a 3:1 or 4:1 study-to-break ratio.",
          "Set timers to enforce regular break intervals.",
          "Track energy levels to identify optimal work-rest patterns.",
          "Remember: breaks are part of learning, not lost time.",
        ],
        metric: `${studyBreakRatio.toFixed(1)}:1 Ratio`,
      })
    }

    // Sort by priority and impact
    return recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.impact - a.impact
    })
  }

  const recommendations = useMemo(() => {
    return getStudentRecommendations()
  }, [analytics, filteredSessions])

  const recStats = useMemo(() => {
    const total = recommendations.length
    const highPriority = recommendations.filter((r) => r.priority === "high").length
    const avgImpact = total > 0 ? Math.round(recommendations.reduce((sum, r) => sum + r.impact, 0) / total) : 0
    const categories = [...new Set(recommendations.map((r) => r.category))]

    return { total, highPriority, avgImpact, categories }
  }, [recommendations])

  const downloadCSV = () => {
    const headers = [
      "Student ID",
      "Subject",
      "Subject Strength",
      "Planned Duration (min)",
      "Preferred Time",
      "Preferred Break (min)",
      "Avg Heart Rate (BPM)",
      "GSR Value",
      "Stress Index",
      "Detected Study State",
      "Recommended Duration (min)",
      "Recommended Break (min)",
      "Priority", // Added Priority
      "Study Plan", // Added Study Plan
    ]
    const rows = filteredSessions.map((s) => [
      s.student_id,
      s.subject,
      s.subject_strength,
      s.planned_study_duration,
      s.preferred_time_of_day,
      s.preferred_break_duration,
      s.avg_heart_rate_bpm,
      s.gsr_value,
      s.stress_index,
      s.detected_study_state,
      s.recommended_study_duration,
      s.recommended_break_duration,
      s.subject_priority, // Added subject_priority
      s.daily_study_plan_text, // Added daily_study_plan_text
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `study-sessions-${currentUser}.csv` // Updated filename to use currentUser
    a.click()
  }

  const downloadActionPlan = () => {
    const student = currentUser // Use currentUser for the filename
    const recommendations = getStudentRecommendations()

    let content = `PERSONALIZED ACTION PLAN\n`
    content += `Student: ${userName} (${currentUser})\n` // Include userName and currentUser
    content += `Generated: ${new Date().toLocaleDateString()}\n`
    content += `\n${"=".repeat(50)}\n\n`

    recommendations.forEach((rec, index) => {
      content += `${index + 1}. ${rec.title}\n`
      content += `   Priority: ${rec.priority.toUpperCase()}\n`
      content += `   Category: ${rec.category}\n`
      content += `   Impact Score: ${rec.impact}/100\n`
      content += `   Metric: ${rec.metric}\n\n`
      content += `   Description:\n   ${rec.description}\n\n`
      content += `   Action Steps:\n`
      rec.actionSteps.forEach((step, i) => {
        content += `   ${i + 1}. ${step}\n`
      })
      content += `\n${"=".repeat(50)}\n\n`
    })

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `action-plan-${student.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt` // More robust filename
    a.click()
  }

  const handleScheduleReview = () => {
    if (scheduleDate && scheduleTime) {
      const newReview: ScheduledReview = {
        id: Date.now().toString(),
        student: currentUser, // Use currentUser for student ID
        date: scheduleDate,
        time: scheduleTime,
        notes: scheduleNotes,
        createdAt: new Date(),
      }

      const updatedReviews = [...scheduledReviews, newReview]
      setScheduledReviews(updatedReviews)
      localStorage.setItem("scheduledReviews", JSON.stringify(updatedReviews))

      // Generate and download .ics calendar file
      downloadCalendarEvent(newReview)

      setShowScheduleDialog(false)
      setScheduleDate("")
      setScheduleTime("")
      setScheduleNotes("")
    }
  }

  const downloadCalendarEvent = (review: ScheduledReview) => {
    const scheduledDateTime = new Date(`${review.date}T${review.time}`)
    const endDateTime = new Date(scheduledDateTime.getTime() + 60 * 60 * 1000) // 1 hour duration

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Study Session Dashboard//EN
    BEGIN:VEVENT
    UID:${review.id}@studydashboard.com
    DTSTAMP:${formatDate(new Date())}
    DTSTART:${formatDate(scheduledDateTime)}
    DTEND:${formatDate(endDateTime)}
    SUMMARY:Study Session Review - ${userName} (${review.student})
    DESCRIPTION:Scheduled review for ${userName}.${review.notes ? `\\n\\nNotes: ${review.notes}` : ""}
    LOCATION:Online Meeting
    STATUS:CONFIRMED
    BEGIN:VALARM
    TRIGGER:-PT15M
    ACTION:DISPLAY
    DESCRIPTION:Review session in 15 minutes
    END:VALARM
    END:VEVENT
    END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `review-${review.student}-${review.date}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // </CHANGE> Fixed critical typo in deleteScheduledReview function
  const deleteScheduledReview = (id: string) => {
    const updatedReviews = scheduledReviews.filter((review) => review.id !== id)
    setScheduledReviews(updatedReviews)
    localStorage.setItem("scheduledReviews", JSON.stringify(updatedReviews))
  }

  const getStressBadgeStyles = (level: "Low" | "Medium" | "High") => {
    if (theme === "dark") {
      switch (level) {
        case "Low":
          return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
        case "Medium":
          return "bg-amber-500/10 text-amber-400 border border-amber-500/30"
        case "High":
          return "bg-red-500/10 text-red-400 border border-red-500/30"
      }
    } else {
      switch (level) {
        case "Low":
          return "bg-emerald-50 text-emerald-700 border border-emerald-200"
        case "Medium":
          return "bg-amber-50 text-amber-700 border border-amber-200"
        case "High":
          return "bg-red-50 text-red-700 border border-red-200"
      }
    }
  }

    const agentResult =
    typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("latestAgentResult") || "null")
    : null

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-slate-950" : "bg-gray-50"}`}>
      <nav
        className={`border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${theme === "dark" ? "border-slate-800 bg-slate-900/80" : "border-gray-200 bg-white/80"}`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 transition-transform hover:scale-105">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1
                className={`text-xl font-bold transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                StudySync
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("home")}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "home"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "analytics"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "recommendations"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Recommendations
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-800 text-yellow-400 hover:bg-slate-700 border border-slate-700 shadow-lg shadow-yellow-500/10"
                    : "bg-gray-100 text-indigo-600 hover:bg-gray-200 border border-gray-300 shadow-sm"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Button
                onClick={handleLogout}
                className={`transition-all duration-200 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {activeTab === "home" && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2
                  className={`text-4xl font-bold mb-2 bg-gradient-to-r ${theme === "dark" ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"} bg-clip-text text-transparent`}
                >
                  Welcome, {userName}
                </h2>
                <p className={`text-lg transition-colors ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                  Monitor your study performance and wellness metrics in real-time
                </p>
              </div>
            </div>

            

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              {/* Card 1 - Stress Level */}
              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-red-500/10 via-slate-900/50 to-slate-900/50 border border-red-500/20"
                    : "bg-gradient-to-br from-red-50 to-white border border-red-100"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
                    Average Stress Level
                  </CardTitle>
                  <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 p-2.5 shadow-lg shadow-red-500/30">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.stressPercentages.high > 40
                      ? "High"
                      : analytics.stressPercentages.low > 50
                        ? "Low"
                        : "Medium"}
                  </div>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {analytics.avgHeartRate} bpm average
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 - Avg Heart Rate */}
              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-blue-500/10 via-slate-900/50 to-slate-900/50 border border-blue-500/20"
                    : "bg-gradient-to-br from-blue-50 to-white border border-blue-100"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
                    Study Performance
                  </CardTitle>
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg shadow-blue-500/30">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.avgStudyTime} mins
                  </div>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                  >
                    <Activity className="h-3 w-3" />
                    Average session duration
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 - Avg Study Time */}
              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-slate-900/50 border border-emerald-500/20"
                    : "bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
                    Break Efficiency
                  </CardTitle>
                  <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg shadow-emerald-500/30">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.avgBreakTime} mins
                  </div>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                  >
                    <Clock className="h-3 w-3" />
                    Recommended break time
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card
              className={`border-0 backdrop-blur shadow-xl ${
                theme === "dark" ? "bg-slate-900/50 border border-slate-800" : "bg-white border border-gray-200"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Recent Study Sessions
                  </CardTitle>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}
                  >
                    {paginatedSessions.length} of {filteredSessions.length} sessions
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Student ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Strength
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Planned (min)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Time of Day
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Break (min)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Avg HR (BPM)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          GSR
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Stress
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          State
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Rec. Study (min)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Rec. Break (min)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          Study Plan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSessions.map((session, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-700/30 hover:bg-slate-800/40 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{session.student_id}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{session.subject}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                session.subject_strength === "Strong"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {session.subject_strength}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{session.planned_study_duration} min</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{session.preferred_time_of_day}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            {session.preferred_break_duration} min
                          </td>
                          <td className="px-4 py-3 text-sm font-mono whitespace-nowrap">
                            {session.avg_heart_rate_bpm}
                          </td>
                          <td className="px-4 py-3 text-sm font-mono whitespace-nowrap">
                            {session.gsr_value.toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                                session.stress_index === "Low"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : session.stress_index === "Medium"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}
                            >
                              {session.stress_index}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{session.detected_study_state}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            {session.recommended_study_duration} min
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            {session.recommended_break_duration} min
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                session.subject_priority === "High"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : session.subject_priority === "Medium"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {session.subject_priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm max-w-xs whitespace-normal">
                            {session.daily_study_plan_text}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                  {hasMore && (
                    <Button
                      onClick={handleViewMore}
                      variant="outline"
                      className={`group transition-all duration-200 hover:scale-105 ${
                        theme === "dark"
                          ? "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      View More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                  <Button
                    onClick={downloadCSV}
                    className="ml-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2
                className={`text-4xl font-bold mb-2 bg-gradient-to-r ${theme === "dark" ? "from-purple-400 to-pink-400" : "from-purple-600 to-pink-600"} bg-clip-text text-transparent`}
              >
                Advanced Analytics
              </h2>
              <p className={`text-lg transition-colors ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                Deep insights into study patterns and performance metrics
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-purple-500/10 via-slate-900/50 to-slate-900/50 border border-purple-500/20"
                    : "bg-gradient-to-br from-purple-50 to-white border border-purple-100"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 shadow-lg shadow-purple-500/30">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <TrendingUp className={`h-4 w-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.productivityScore}%
                  </div>
                  <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                    Productivity Score
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-blue-500/10 via-slate-900/50 to-slate-900/50 border border-blue-500/20"
                    : "bg-gradient-to-br from-blue-50 to-white border border-blue-100"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg shadow-blue-500/30">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <TrendingUp className={`h-4 w-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.studyEfficiency}%
                  </div>
                  <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                    Study Efficiency
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-slate-900/50 border border-emerald-500/20"
                    : "bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg shadow-emerald-500/30">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <TrendingUp className={`h-4 w-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.avgHeartRate}
                  </div>
                  <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                    Avg Heart Rate (bpm)
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-orange-500/10 via-slate-900/50 to-slate-900/50 border border-orange-500/20"
                    : "bg-gradient-to-br from-orange-50 to-white border border-orange-100"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-500 p-2.5 shadow-lg shadow-orange-500/30">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <TrendingDown className={`h-4 w-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                  </div>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {analytics.avgGSR}
                  </div>
                  <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                    Avg GSR Value
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card
              className={`border-0 backdrop-blur shadow-xl transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className={`h-5 w-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                  <h3
                    className={`text-xl font-bold transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Physiological Trends Over Sessions
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  {/* Updated chart data preparation to use new attribute names */}
                  <AreaChart data={analytics.heartRateTrend}>
                    <defs>
                      <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorGSR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e5e7eb"} />
                    <XAxis dataKey="session" stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                    <YAxis stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                        border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorHR)"
                      name="Heart Rate (bpm)"
                    />
                    <Area
                      type="monotone"
                      dataKey="gsr"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorGSR)"
                      name="GSR Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50"
                    : "bg-white border border-gray-200"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className={`h-5 w-5 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`} />
                    <h3
                      className={`text-xl font-bold transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Performance by Time of Day
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    {/* Updated chart data preparation to use new attribute names */}
                    <BarChart data={analytics.timeOfDayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e5e7eb"} />
                      <XAxis dataKey="time" stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                      <YAxis stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                          border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          color: theme === "dark" ? "#fff" : "#000",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="lowStress" stackId="a" fill="#10b981" name="Low Stress" />
                      <Bar dataKey="mediumStress" stackId="a" fill="#f59e0b" name="Medium Stress" />
                      <Bar dataKey="highStress" stackId="a" fill="#ef4444" name="High Stress" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card
                className={`border-0 backdrop-blur shadow-xl transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50"
                    : "bg-white border border-gray-200"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <LucidePieChart className={`h-5 w-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
                    <h3
                      className={`text-xl font-bold transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Stress Level Distribution
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPie>
                      <Pie
                        data={analytics.stressPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name} (${entry.value})`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.stressPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                          border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          color: theme === "dark" ? "#fff" : "#000",
                        }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card
              className={`border-0 backdrop-blur shadow-xl transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                  <h3
                    className={`text-xl font-bold transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Subject Performance Analysis
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  {/* Updated chart data preparation to use new attribute names */}
                  <RadarChart data={analytics.subjectRadarData}>
                    <PolarGrid stroke={theme === "dark" ? "#334155" : "#e5e7eb"} />
                    <PolarAngleAxis dataKey="subject" stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                    <PolarRadiusAxis stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                    <Radar name="Performance Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                        border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card
              className={`border-0 backdrop-blur shadow-xl transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className={`h-5 w-5 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`} />
                  <h3
                    className={`text-xl font-bold transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Study vs Break Time Comparison
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  {/* Updated chart data preparation to use new attribute names */}
                  <BarChart data={analytics.focusTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e5e7eb"} />
                    <XAxis dataKey="session" stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                    <YAxis stroke={theme === "dark" ? "#94a3b8" : "#6b7280"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                        border: `1px solid ${theme === "dark" ? "#475569" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="studyTime" fill="#3b82f6" name="Study Time (min)" />
                    <Bar dataKey="breakTime" fill="#10b981" name="Break Time (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-8">
            {/* Header with statistics */}
            <div className="mb-8">
              <h2
                className={`text-4xl font-bold mb-3 bg-gradient-to-r ${theme === "dark" ? "from-green-400 to-emerald-400" : "from-green-600 to-emerald-600"} bg-clip-text text-transparent`}
              >
                AI-Powered Recommendations
              </h2>
              <p className={`text-lg mb-6 transition-colors ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                Personalized insights based on your study patterns and physiological data
              </p>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card
                  className={`border-0 backdrop-blur shadow-lg transition-all duration-300 ${
                    theme === "dark" ? "bg-slate-900/50" : "bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                          Total Insights
                        </p>
                        <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {recStats.total}
                        </p>
                      </div>
                      <Lightbulb className={`h-8 w-8 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`border-0 backdrop-blur shadow-lg transition-all duration-300 ${
                    theme === "dark" ? "bg-slate-900/50" : "bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                          High Priority
                        </p>
                        <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {recStats.highPriority}
                        </p>
                      </div>
                      <AlertCircle className={`h-8 w-8 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`border-0 backdrop-blur shadow-lg transition-all duration-300 ${
                    theme === "dark" ? "bg-slate-900/50" : "bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>Avg Impact</p>
                        <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {recStats.avgImpact}%
                        </p>
                      </div>
                      <Target className={`h-8 w-8 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`border-0 backdrop-blur shadow-lg transition-all duration-300 ${
                    theme === "dark" ? "bg-slate-900/50" : "bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>Categories</p>
                        <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {recStats.categories.length}
                        </p>
                      </div>
                      <Award className={`h-8 w-8 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid gap-6">
              {recommendations.map((rec, index) => (
                <Card
                  key={index}
                  className={`border-0 backdrop-blur shadow-xl transition-all duration-300 hover:scale-[1.01] ${
                    theme === "dark"
                      ? rec.type === "warning"
                        ? "bg-gradient-to-r from-amber-500/10 via-slate-900/50 to-slate-900/50 border border-amber-500/20"
                        : rec.type === "success"
                          ? "bg-gradient-to-r from-emerald-500/10 via-slate-900/50 to-slate-900/50 border border-emerald-500/20"
                          : "bg-gradient-to-r from-blue-500/10 via-slate-900/50 to-slate-900/50 border border-blue-500/20"
                      : rec.type === "warning"
                        ? "bg-gradient-to-r from-amber-50 to-white border border-amber-200"
                        : rec.type === "success"
                          ? "bg-gradient-to-r from-emerald-50 to-white border border-emerald-200"
                          : "bg-gradient-to-r from-blue-50 to-white border border-blue-200"
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Header with icon, title, and badges */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`rounded-lg p-3 ${
                          rec.type === "warning"
                            ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30"
                            : rec.type === "success"
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                              : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
                        }`}
                      >
                        {rec.type === "warning" ? (
                          <AlertCircle className="h-6 w-6 text-white" />
                        ) : rec.type === "success" ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Lightbulb className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {rec.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              rec.priority === "high"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : rec.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {rec.priority.toUpperCase()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              theme === "dark"
                                ? "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                                : "bg-gray-200 text-gray-700 border border-gray-300"
                            }`}
                          >
                            {rec.category}
                          </span>
                        </div>

                        {/* Metric badge */}
                        {rec.metric && (
                          <div className="flex items-center gap-2 mb-3">
                            <Activity className={`h-4 w-4 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} />
                            <span
                              className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                            >
                              {rec.metric}
                            </span>
                          </div>
                        )}

                        <p
                          className={`text-sm leading-relaxed mb-4 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                        >
                          {rec.description}
                        </p>

                        {/* Impact Score */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-semibold ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                            >
                              POTENTIAL IMPACT
                            </span>
                            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {rec.impact}%
                            </span>
                          </div>
                          <div
                            className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                rec.impact >= 80
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : rec.impact >= 60
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                              }`}
                              style={{ width: `${rec.impact}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Steps */}
                        <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"}`}>
                          <h4
                            className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                          >
                            <Zap className="h-4 w-4" />
                            Action Steps
                          </h4>
                          <ul className="space-y-2">
                            {rec.actionSteps.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className={`text-sm flex items-start gap-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                              >
                                <span
                                  className={`inline-block w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0 ${
                                    rec.type === "warning"
                                      ? "bg-amber-500/20 text-amber-400"
                                      : rec.type === "success"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-blue-500/20 text-blue-400"
                                  }`}
                                >
                                  {stepIndex + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Card */}
            <Card
              className={`border-0 backdrop-blur shadow-xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-900/80 to-slate-800/80"
                  : "bg-gradient-to-br from-white to-gray-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg p-3 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Next Steps for Success
                    </h3>
                    <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
                      Focus on the {recStats.highPriority} high-priority recommendations first for maximum impact.
                      Implement changes gradually - try 1-2 action steps per week to build sustainable habits. Track
                      your progress and revisit these insights weekly to monitor improvements in your study sessions.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={downloadActionPlan}
                        className={`${
                          theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        } text-white shadow-lg transition-all duration-300 hover:scale-105`}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Action Plan
                      </Button>
                      <Button
                        onClick={() => setShowScheduleDialog(true)}
                        variant="outline"
                        className={`${
                          theme === "dark"
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        } transition-all duration-300 hover:scale-105`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule Review
                      </Button>
                      <Button
                        onClick={() => setShowReviewsList(true)}
                        variant="outline"
                        className={`${
                          theme === "dark"
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        } transition-all duration-300 relative hover:scale-105`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        View Scheduled ({scheduledReviews.length})
                        {scheduledReviews.length > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs text-white flex items-center justify-center">
                            {scheduledReviews.length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {showScheduleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-xl p-6 shadow-2xl ${
              theme === "dark"
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Schedule Review
              </h3>
              <button
                onClick={() => setShowScheduleDialog(false)}
                className={`rounded-full p-1 transition-colors ${
                  theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  Student
                </label>
                <input
                  type="text"
                  value={userName} // Display user name
                  disabled
                  className={`w-full rounded-lg border px-3 py-2 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-800 text-slate-300"
                      : "border-gray-300 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-800 text-slate-300"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-800 text-slate-300"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  Notes (Optional)
                </label>
                <textarea
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="Add any notes or agenda items for the review..."
                  rows={3}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-800 text-slate-300 placeholder-slate-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleScheduleReview}
                  disabled={!scheduleDate || !scheduleTime}
                  className={`flex-1 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  } text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule & Download
                </Button>
                <Button
                  onClick={() => setShowScheduleDialog(false)}
                  variant="outline"
                  className={`flex-1 ${
                    theme === "dark"
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  } transition-all duration-300 hover:scale-105`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReviewsList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-2xl ${
              theme === "dark"
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Scheduled Reviews
                </h3>
              </div>
              <button
                onClick={() => setShowReviewsList(false)}
                className={`rounded-full p-1 transition-colors ${
                  theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {scheduledReviews.length === 0 ? (
              <div className={`text-center py-12 ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No reviews scheduled yet</p>
                <p className="text-sm mt-2">Schedule a review from the recommendations tab</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledReviews
                  .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
                  .map((review) => {
                    const reviewDate = new Date(`${review.date}T${review.time}`)
                    const isUpcoming = reviewDate > new Date()

                    return (
                      <div
                        key={review.id}
                        className={`rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] ${
                          theme === "dark"
                            ? "bg-slate-800/50 border border-slate-700"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                              >
                                {userName} {/* Display user name */}
                              </span>
                              {isUpcoming ? (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                  Upcoming
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                                  Past
                                </span>
                              )}
                            </div>

                            <div
                              className={`flex items-center gap-4 text-sm ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}
                            >
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {reviewDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {reviewDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>

                            {review.notes && (
                              <p className={`mt-2 text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                                {review.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => downloadCalendarEvent(review)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === "dark"
                                  ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                              }`}
                              title="Download calendar event"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteScheduledReview(review.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === "dark"
                                  ? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
                                  : "hover:bg-red-100 text-red-500 hover:text-red-700"
                              }`}
                              title="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
