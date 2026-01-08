"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  Brain,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  Heart,
  Target,
  Clock,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleViewDemo = () => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", "demo@studysync.com")
    localStorage.setItem("userName", "Demo User")
    router.push("/study-setup")
  }

  const handleStartMonitoring = () => {
    router.push("/login")
  }

  const features = [
    {
      icon: Heart,
      title: "Real-Time Health Monitoring",
      description: "Track heart rate, GSR, and stress levels during study sessions with precision sensors.",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your physiological responses and study patterns.",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Visualize your progress with advanced charts showing trends, patterns, and improvements.",
    },
    {
      icon: Target,
      title: "Optimized Study Plans",
      description: "Receive data-driven study schedules that maximize learning efficiency and minimize stress.",
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your health data is encrypted and securely stored with enterprise-grade protection.",
    },
    {
      icon: Users,
      title: "Multi-Student Support",
      description: "Monitor multiple students simultaneously with individual dashboards and reports.",
    },
  ]

  const stats = [
    { value: "98%", label: "Stress Detection Accuracy" },
    { value: "45min", label: "Average Session Time" },
    { value: "10K+", label: "Students Monitored" },
    { value: "24/7", label: "Real-Time Tracking" },
  ]

  const benefits = [
    "Prevent burnout with early stress detection",
    "Improve study efficiency by 40%",
    "Personalized break recommendations",
    "Subject-specific performance tracking",
    "Optimal study time identification",
    "Comprehensive health reports",
  ]

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-50"}`}
    >
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-md ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-200"} border-b transition-colors`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className={`h-8 w-8 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
              <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                StudySync
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className={`rounded-full ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                className={`${theme === "dark" ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div
              className={`inline-block px-4 py-2 rounded-full ${theme === "dark" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-cyan-50 text-cyan-600 border border-cyan-200"} mb-6`}
            >
              <span className="text-sm font-medium">Advanced Study Session Monitoring</span>
            </div>

            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Monitor Student Health During{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                Study Sessions
              </span>
            </h1>

            <p
              className={`text-xl md:text-2xl mb-10 leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}
            >
              Track physiological metrics, detect stress patterns, and optimize learning outcomes with AI-powered
              analytics and real-time health monitoring.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartMonitoring}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-8 py-6 h-auto"
              >
                Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleViewDemo}
                variant="outline"
                size="lg"
                className={`text-lg px-8 py-6 h-auto ${theme === "dark" ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl backdrop-blur-sm border ${theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"} text-center hover:scale-105 transition-transform`}
              >
                <div
                  className={`text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text`}
                >
                  {stat.value}
                </div>
                <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Comprehensive Monitoring Platform
            </h2>
            <p className={`text-xl ${theme === "dark" ? "text-slate-300" : "text-gray-600"} max-w-2xl mx-auto`}>
              Everything you need to track, analyze, and optimize student health during study sessions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl backdrop-blur-sm border ${theme === "dark" ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70" : "bg-white border-gray-200 hover:bg-gray-50"} transition-all hover:scale-105`}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`${theme === "dark" ? "text-slate-400" : "text-gray-600"} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-slate-900/50" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Why Choose StudySync?
              </h2>
              <p className={`text-lg mb-8 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
                Our platform combines advanced biometric sensors with AI-powered analytics to provide comprehensive
                insights into student well-being and academic performance.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={`text-lg ${theme === "dark" ? "text-slate-200" : "text-gray-700"}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleStartMonitoring}
                size="lg"
                className="mt-10 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div
              className={`p-8 rounded-2xl backdrop-blur-sm border ${theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"}`}
            >
              <div className="space-y-6">
                <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-900/50" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Heart Rate
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                        Real-time BPM tracking
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-20">
                    {[60, 65, 62, 70, 75, 72, 78, 80, 76, 72].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-red-500 to-orange-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-900/50" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Study Focus
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                        Concentration level
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-20">
                    {[40, 55, 70, 85, 90, 88, 92, 95, 93, 90].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-900/50" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        45 minutes
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                        Optimal session duration
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`p-12 rounded-3xl backdrop-blur-sm border ${theme === "dark" ? "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700" : "bg-gradient-to-br from-white to-gray-50 border-gray-200"}`}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Ready to Transform Your Study Sessions?
            </h2>
            <p className={`text-xl mb-10 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
              Join thousands of students and educators using StudySync to optimize learning outcomes
            </p>
            <Button
              onClick={handleStartMonitoring}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-10 py-7 h-auto"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-gray-50 border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
            <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>StudySync</span>
          </div>
          <p className={`${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
            © 2025 StudySync. All rights reserved. Empowering students with health-first learning.
          </p>
        </div>
      </footer>
    </div>
  )
}
