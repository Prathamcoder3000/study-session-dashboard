"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface StudySession {
  _id: string
  userId: string
  subject: string
  topic: string
  duration: number
  difficulty: "Easy" | "Medium" | "Hard"
  notes: string
  effectiveness: number
  date: string
  status: "In Progress" | "Completed" | "Paused"
}

export function StudySessionDashboardWithDB() {
  const router = useRouter()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    duration: 30,
    difficulty: "Medium",
    notes: "",
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    const storedUserId = localStorage.getItem("userId")
    if (!storedUserId) {
      router.push("/login")
      return
    }
    setUserId(storedUserId)
  }, [router])

  useEffect(() => {
    if (userId) {
      fetchSessions()
    }
  }, [userId])

  const fetchSessions = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/study-sessions?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setSessions(data.sessions)
      } else {
        setError(data.error || "Failed to fetch sessions")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to fetch sessions")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject || !formData.topic) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSessions([data.session, ...sessions])
        setFormData({
          subject: "",
          topic: "",
          duration: 30,
          difficulty: "Medium",
          notes: "",
        })
        setShowForm(false)
        setError("")
      } else {
        setError(data.error || "Failed to create session")
      }
    } catch (err) {
      console.error("Create error:", err)
      setError("Failed to create session")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSession = async (sessionId: string, updates: Partial<StudySession>) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/study-sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (response.ok) {
        setSessions(sessions.map((s) => (s._id === sessionId ? data.session : s)))
        setEditingId(null)
        setError("")
      } else {
        setError(data.error || "Failed to update session")
      }
    } catch (err) {
      console.error("Update error:", err)
      setError("Failed to update session")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/study-sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSessions(sessions.filter((s) => s._id !== sessionId))
        setError("")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete session")
      }
    } catch (err) {
      console.error("Delete error:", err)
      setError("Failed to delete session")
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userId")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const isDarkMode = theme === "dark"

  // Calculate statistics
  const stats = {
    totalSessions: sessions.length,
    totalHours: sessions.reduce((sum, s) => sum + s.duration, 0) / 60,
    completedSessions: sessions.filter((s) => s.status === "Completed").length,
    avgEffectiveness:
      sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + s.effectiveness, 0) / sessions.length)
        : 0,
  }

  // Prepare chart data
  const chartData = sessions.reduce((acc: any[], session) => {
    const existing = acc.find((item) => item.subject === session.subject)
    if (existing) {
      existing.duration += session.duration
      existing.sessions += 1
    } else {
      acc.push({
        subject: session.subject,
        duration: session.duration,
        sessions: 1,
      })
    }
    return acc
  }, [])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
        } border-b sticky top-0 z-50`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Study Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Button onClick={toggleTheme} size="icon" variant="ghost">
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={isDarkMode ? "bg-slate-900 border-slate-800" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-gray-500 mt-1">sessions tracked</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-slate-900 border-slate-800" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalHours.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">hours studied</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-slate-900 border-slate-800" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.completedSessions}</div>
              <p className="text-xs text-gray-500 mt-1">sessions completed</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-slate-900 border-slate-800" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Avg Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.avgEffectiveness}/10</div>
              <p className="text-xs text-gray-500 mt-1">average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              isDarkMode
                ? "bg-red-900/20 border border-red-800"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            />
            <div className="flex-1">
              <p className={isDarkMode ? "text-red-300" : "text-red-700"}>{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-gray-400 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Create Session Form */}
        {showForm && (
          <Card className={`mb-6 ${isDarkMode ? "bg-slate-900 border-slate-800" : ""}`}>
            <CardHeader>
              <CardTitle>Add Study Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={isDarkMode ? "bg-slate-800 border-slate-700 text-white" : ""}
                  />
                  <Input
                    placeholder="Topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className={isDarkMode ? "bg-slate-800 border-slate-700 text-white" : ""}
                  />
                  <Input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) })
                    }
                    className={isDarkMode ? "bg-slate-800 border-slate-700 text-white" : ""}
                  />
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value as any })
                    }
                    className={`px-3 py-2 rounded-md border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <Input
                  placeholder="Notes (optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={isDarkMode ? "bg-slate-800 border-slate-700 text-white" : ""}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Session"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Study Session
          </Button>
        )}

        {/* Charts */}
        {chartData.length > 0 && (
          <Card className={`mb-6 ${isDarkMode ? "bg-slate-900 border-slate-800" : ""}`}>
            <CardHeader>
              <CardTitle>Study Time by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e5e7eb"} />
                  <XAxis dataKey="subject" stroke={isDarkMode ? "#94a3b8" : "#6b7280"} />
                  <YAxis stroke={isDarkMode ? "#94a3b8" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1e293b" : "#fff",
                      border: `1px solid ${isDarkMode ? "#334155" : "#e5e7eb"}`,
                      color: isDarkMode ? "#e2e8f0" : "#000",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="duration" fill="#8b5cf6" name="Duration (min)" />
                  <Bar dataKey="sessions" fill="#06b6d4" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <Card className={isDarkMode ? "bg-slate-900 border-slate-800" : ""}>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !sessions.length ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No study sessions yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${isDarkMode ? "text-white" : ""}`}>
                            {session.subject} - {session.topic}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              session.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : session.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {session.difficulty}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {session.effectiveness}/10
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                        </div>
                        {session.notes && (
                          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {session.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (session.status === "In Progress") {
                              handleUpdateSession(session._id, { status: "Completed" })
                            }
                          }}
                          disabled={session.status === "Completed"}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSession(session._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
