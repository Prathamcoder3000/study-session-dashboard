"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  Brain,
  Activity,
  BarChart3,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react"

function PasswordRequirement({ met, text, theme }: { met: boolean; text: string; theme: "light" | "dark" }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            theme === "dark" ? "border-slate-600" : "border-gray-300"
          }`}
        />
      )}
      <span
        className={`text-xs ${met ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
      >
        {text}
      </span>
    </div>
  )
}

export function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated) {
      router.push("/study-setup")
    }
  }, [router])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    if (!isLogin) {
      setPasswordValidation({
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      })
    }
  }, [password, isLogin])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (isLogin) {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth?action=login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Login failed")
          setLoading(false)
          return
        }

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.name)
        router.push("/study-setup")
      } catch (err) {
        setError("Network error. Please try again.")
        setLoading(false)
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your full name")
        setLoading(false)
        return
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long")
        setLoading(false)
        return
      }

      if (!passwordValidation.hasUpperCase) {
        setError("Password must contain at least one uppercase letter")
        setLoading(false)
        return
      }

      if (!passwordValidation.hasLowerCase) {
        setError("Password must contain at least one lowercase letter")
        setLoading(false)
        return
      }

      if (!passwordValidation.hasNumber) {
        setError("Password must contain at least one number")
        setLoading(false)
        return
      }

      if (!passwordValidation.hasSpecialChar) {
        setError("Password must contain at least one special character")
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth?action=register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Registration failed")
          setLoading(false)
          return
        }

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.name)
        router.push("/study-setup")
      } catch (err) {
        setError("Network error. Please try again.")
        setLoading(false)
      }
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@studysync.com", password: "Admin123!" }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.name)
        router.push("/study-setup")
      } else {
        // If demo user doesn't exist, create it
        const registerResponse = await fetch("/api/auth?action=register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: "admin@studysync.com", 
            password: "Admin123!", 
            name: "Demo User" 
          }),
        })

        const registerData = await registerResponse.json()

        if (registerResponse.ok) {
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userId", registerData.user.id)
          localStorage.setItem("userEmail", registerData.user.email)
          localStorage.setItem("userName", registerData.user.name)
          router.push("/study-setup")
        }
      }
    } catch (err) {
      setError("Demo login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleTabSwitch = (isLoginMode: boolean) => {
    setIsLogin(isLoginMode)
    setError("")
    setPassword("")
    setConfirmPassword("")
    if (!isLoginMode) {
      setName("")
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-slate-950" : "bg-gray-50"}`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 ${
          theme === "dark"
            ? "bg-slate-800/80 text-yellow-400 hover:bg-slate-700"
            : "bg-white/80 text-blue-600 hover:bg-gray-50"
        }`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg`}>
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>StudySync</h1>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Track physiological metrics for optimal learning
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm ${
              theme === "dark" ? "bg-slate-900/50 border border-slate-800" : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => handleTabSwitch(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  isLogin
                    ? theme === "dark"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-500 text-white shadow-lg"
                    : theme === "dark"
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleTabSwitch(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  !isLogin
                    ? theme === "dark"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-500 text-white shadow-lg"
                    : theme === "dark"
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Full Name</Label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required={!isLogin}
                      className={`pl-10 ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Email Address</Label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@studysync.com"
                    required
                    className={`pl-10 ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Password</Label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`pl-10 pr-10 ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required={!isLogin}
                      className={`pl-10 pr-10 ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && password && (
                <div
                  className={`p-3 rounded-lg space-y-2 ${
                    theme === "dark" ? "bg-slate-800/50 border border-slate-700" : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Password Requirements:
                  </p>
                  <div className="space-y-1">
                    <PasswordRequirement
                      met={passwordValidation.minLength}
                      text="At least 8 characters"
                      theme={theme}
                    />
                    <PasswordRequirement
                      met={passwordValidation.hasUpperCase}
                      text="One uppercase letter"
                      theme={theme}
                    />
                    <PasswordRequirement
                      met={passwordValidation.hasLowerCase}
                      text="One lowercase letter"
                      theme={theme}
                    />
                    <PasswordRequirement met={passwordValidation.hasNumber} text="One number" theme={theme} />
                    <PasswordRequirement
                      met={passwordValidation.hasSpecialChar}
                      text="One special character (!@#$%^&*)"
                      theme={theme}
                    />
                  </div>
                </div>
              )}

              {!isLogin && confirmPassword && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    password === confirmPassword
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            {isLogin && (
              <div className="mt-6">
                <div
                  className={`relative flex items-center justify-center mb-4 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <div className={`absolute inset-x-0 h-px ${theme === "dark" ? "bg-slate-800" : "bg-gray-200"}`} />
                  <span className={`relative px-3 text-xs ${theme === "dark" ? "bg-slate-900/50" : "bg-white"}`}>
                    Quick Access
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  variant="outline"
                  className={`w-full ${
                    theme === "dark"
                      ? "border-slate-700 text-gray-300 hover:bg-slate-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Demo Login
                </Button>
                <p className={`mt-2 text-xs text-center ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Email: admin@studysync.com | Password: admin123
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-balance">Monitor Student Health & Performance</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Advanced physiological monitoring system for tracking heart rate, GSR, and stress levels during study
              sessions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-white/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
                <p className="text-sm text-blue-100">Track heart rate, GSR, and stress levels in real-time</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-white/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                <p className="text-sm text-blue-100">Visualize trends and patterns with interactive charts</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-white/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Recommendations</h3>
                <p className="text-sm text-blue-100">Get personalized insights and study optimization tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
