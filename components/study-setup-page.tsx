"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Clock, Moon, Sun, Target, Coffee, AlertTriangle, FileText, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubjectEntry {
  subject: string
  subject_strength: number
  subject_priority: string
}

export default function StudySetupPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [subjects, setSubjects] = useState([{ subject: "", subject_strength: 0, subject_priority: "" }])
  const [formData, setFormData] = useState({
    planned_study_duration: "",
    preferred_time_of_day: "",
    preferred_break_duration: "",
    daily_study_plan_text: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [currentUserEmail, setCurrentUserEmail] = useState("")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const userEmail = localStorage.getItem("userEmail") || ""
    setCurrentUserEmail(userEmail)

    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [router])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  const addSubject = () => {
    setSubjects([...subjects, { subject: "", subject_strength: 0, subject_priority: "" }])
  }

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index)
      setSubjects(newSubjects)
    }
  }

  const handleSubjectChange = (index: number, field: keyof SubjectEntry, value: string | number) => {
    const newSubjects = [...subjects]
    newSubjects[index][field] = value
    setSubjects(newSubjects)

    if (errors[`subject_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`subject_${index}_${field}`]: "" }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    subjects.forEach((subject, index) => {
      if (!subject.subject.trim()) {
        newErrors[`subject_${index}_subject`] = "Subject is required"
      }
      if (!subject.subject_strength) {
        newErrors[`subject_${index}_subject_strength`] = "Strength is required"
      }
      if (!subject.subject_priority) {
        newErrors[`subject_${index}_subject_priority`] = "Priority is required"
      }
    })

    if (!formData.planned_study_duration || Number.parseInt(formData.planned_study_duration) <= 0) {
      newErrors.planned_study_duration = "Valid study duration is required"
    }
    if (!formData.preferred_time_of_day) {
      newErrors.preferred_time_of_day = "Preferred time of day is required"
    }
    if (!formData.preferred_break_duration || Number.parseInt(formData.preferred_break_duration) <= 0) {
      newErrors.preferred_break_duration = "Valid break duration is required"
    }
    if (!formData.daily_study_plan_text.trim()) {
      newErrors.daily_study_plan_text = "Study plan is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const existingSessions = JSON.parse(localStorage.getItem("studySessions") || "[]")
    const userIdToSend = localStorage.getItem("userEmail")

    if (!userIdToSend) {
      alert("Session expired. Please login again.")
     return
    }


    const createPromises = subjects.map(async (subject) => {
      const simulatedHeartRate = 70 + Math.floor(Math.random() * 20)
      const simulatedGSR = 2.0 + Math.random() * 2.0
      const stressLevels: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"]
      const randomStress = stressLevels[Math.floor(Math.random() * stressLevels.length)]
      

      const sessionPayload = {
        userId: userIdToSend,
        subject: subject.subject,
        topic: subject.subject,
        duration: Number.parseInt(formData.planned_study_duration),
        difficulty: subject.subject_strength === 1 ? "Easy" : subject.subject_strength === 2 ? "Hard" : "Medium",
        notes: JSON.stringify({
          preferred_time_of_day: formData.preferred_time_of_day,
          preferred_break_duration: Number.parseInt(formData.preferred_break_duration),
          subject_priority: subject.subject_priority,
          daily_study_plan_text: formData.daily_study_plan_text,
          avg_heart_rate_bpm: simulatedHeartRate,
          gsr_value: Number.parseFloat(simulatedGSR.toFixed(2)),
          stress_index: randomStress,
        }),
      }

      // 1️⃣ Send sensor data (already working)
      await fetch("http://127.0.0.1:8000/sensor-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      student_id: userIdToSend,
      subject: subject.subject,
      subject_strength: subject.subject_strength,
      heart_rate: simulatedHeartRate,
      gsr: Number.parseFloat(simulatedGSR.toFixed(2)),
    }),
  })


    // 2️⃣ RUN AGENT (DECLARE ONLY ONCE)
    const agentResponse = await fetch(
    `http://127.0.0.1:8000/run-agent/${userIdToSend}`,
    { method: "POST" }
   )

   const agentResult = await agentResponse.json()
      // Keep local fallback copy
      const localSession = {
        student_id: userIdToSend,
        subject: subject.subject,
        subject_strength: subject.subject_strength,
        planned_study_duration: Number.parseInt(formData.planned_study_duration),
        preferred_time_of_day: formData.preferred_time_of_day,
        preferred_break_duration: Number.parseInt(formData.preferred_break_duration),
        avg_heart_rate_bpm: simulatedHeartRate,
        gsr_value: Number.parseFloat(simulatedGSR.toFixed(2)),
        stress_index: randomStress,
        // 🔥 AGENT OUTPUT (REAL INTELLIGENCE)
        detected_study_state: agentResult.study_state,
        recommended_study_duration: agentResult.study_duration,
        recommended_break_duration: agentResult.break_duration,
        subject_priority: agentResult.priority || subject.subject_priority || "Medium",
        daily_study_plan_text: formData.daily_study_plan_text || "NA",
      }
      //temporary logs
      // console.log("LOCAL SESSION CREATED:", localSession)



      existingSessions.unshift(localSession)
      localStorage.setItem("studySessions", JSON.stringify(existingSessions))

      // 🔹 Send data to FastAPI backend (Agent input)
      fetch('http://127.0.0.1:8000/sensor-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: userIdToSend,
          subject: subject.subject,
          subject_strength: subject.subject_strength === 1 ? "strong" : "weak",
          heart_rate: simulatedHeartRate,
          gsr: Number.parseFloat(simulatedGSR.toFixed(2)),
        }),
      })

       

        // 🔹 Store agent result for dashboard
        localStorage.setItem("latestAgentResult", JSON.stringify(agentResult))


      /*return fetch('/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload),
      })*/
    })

    // Save local copy immediately
    localStorage.setItem("currentStudySession", JSON.stringify({ completed: true }))

    try {
      const results = await Promise.allSettled(createPromises)
      const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && (r as any).value && !(r as any).value.ok))
      if (failed.length) {
        console.error('Some study session saves failed', failed)
      }
    } catch (err) {
      console.error('Error creating sessions:', err)
    }

    router.push('/dashboard')
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-gray-50"} transition-colors duration-300`}>
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all ${
          theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>StudySync</h1>
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>Study Setup</p>
            </div>
          </div>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className={`rounded-full transition-all ${
              theme === "dark" ? "hover:bg-slate-800 text-slate-300" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div
          className={`rounded-2xl border shadow-2xl p-8 md:p-12 transition-all ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-center mb-8">
            <h2
              className={`text-3xl font-bold mb-3 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  : "text-gray-900"
              }`}
            >
              Study Setup / Data Entry
            </h2>
            <p className={`${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
              Enter your study session details to begin monitoring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label
                  className={`block text-sm font-semibold ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
                >
                  <BookOpen className="inline h-4 w-4 mr-2" />
                  Subjects *
                </label>
                <Button
                  type="button"
                  onClick={addSubject}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </div>

              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border space-y-4 ${
                    theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
                      Subject {index + 1}
                    </h4>
                    {subjects.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSubject(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                    >
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      value={subject.subject}
                      onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
                      placeholder="e.g., Math, Physics, Chemistry"
                      className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-slate-900 border-slate-600 text-white placeholder-slate-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } ${errors[`subject_${index}_subject`] ? "border-red-500" : ""}`}
                    />
                    {errors[`subject_${index}_subject`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_subject`]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                    >
                      <Target className="inline h-3 w-3 mr-1" />
                      Strength Level *
                    </label>
                    <select
                      value={subject.subject_strength}
                      onChange={(e) => handleSubjectChange(index, "subject_strength", Number.parseInt(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-slate-900 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } ${errors[`subject_${index}_subject_strength`] ? "border-red-500" : ""}`}
                    >
                      <option value="">Select strength level</option>
                      <option value="1">Strong</option>
                      <option value="2">Weak</option>
                    </select>
                    {errors[`subject_${index}_subject_strength`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_subject_strength`]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}
                    >
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      Priority Level *
                    </label>
                    <select
                      value={subject.subject_priority}
                      onChange={(e) => handleSubjectChange(index, "subject_priority", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === "dark"
                          ? "bg-slate-900 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } ${errors[`subject_${index}_subject_priority`] ? "border-red-500" : ""}`}
                    >
                      <option value="">Select priority level</option>
                      <option value="High">High - Urgent attention needed</option>
                      <option value="Medium">Medium - Regular focus</option>
                      <option value="Low">Low - Maintenance level</option>
                    </select>
                    {errors[`subject_${index}_subject_priority`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_subject_priority`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
              >
                <Clock className="inline h-4 w-4 mr-2" />
                Planned Study Duration (minutes) *
              </label>
              <input
                type="number"
                name="planned_study_duration"
                value={formData.planned_study_duration}
                onChange={handleInputChange}
                placeholder="e.g., 60"
                min="1"
                className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } ${errors.planned_study_duration ? "border-red-500" : ""}`}
              />
              {errors.planned_study_duration && (
                <p className="text-red-500 text-xs mt-1">{errors.planned_study_duration}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
              >
                <Sun className="inline h-4 w-4 mr-2" />
                Preferred Time of Day *
              </label>
              <select
                name="preferred_time_of_day"
                value={formData.preferred_time_of_day}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } ${errors.preferred_time_of_day ? "border-red-500" : ""}`}
              >
                <option value="">Select preferred time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
              {errors.preferred_time_of_day && (
                <p className="text-red-500 text-xs mt-1">{errors.preferred_time_of_day}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
              >
                <Coffee className="inline h-4 w-4 mr-2" />
                Preferred Break Duration (minutes) *
              </label>
              <input
                type="number"
                name="preferred_break_duration"
                value={formData.preferred_break_duration}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                min="1"
                className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } ${errors.preferred_break_duration ? "border-red-500" : ""}`}
              />
              {errors.preferred_break_duration && (
                <p className="text-red-500 text-xs mt-1">{errors.preferred_break_duration}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
              >
                <FileText className="inline h-4 w-4 mr-2" />
                Daily Study Plan *
              </label>
              <textarea
                name="daily_study_plan_text"
                value={formData.daily_study_plan_text}
                onChange={handleInputChange}
                placeholder="Describe your study plan for this session... (e.g., Focus on algebra and calculus basics with frequent breaks)"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } ${errors.daily_study_plan_text ? "border-red-500" : ""}`}
              />
              {errors.daily_study_plan_text && (
                <p className="text-red-500 text-xs mt-1">{errors.daily_study_plan_text}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Start Study Session
            </Button>
          </form>

          <div
            className={`mt-6 p-4 rounded-lg border ${
              theme === "dark"
                ? "bg-blue-950/20 border-blue-900/50 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            <p className="text-sm">
              <strong>Note:</strong> After submission, sensor data collection (heart rate, GSR) will begin automatically
              on the dashboard. You can add multiple subjects with different strength and priority levels.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
