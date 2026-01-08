"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { StudySessionDashboard } from "@/components/study-session-dashboard"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
  }, [router])

  return <StudySessionDashboard />
}
