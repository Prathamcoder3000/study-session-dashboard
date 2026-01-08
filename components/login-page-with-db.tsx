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

export function LoginPageWithDB() {
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

    try {
      if (isLogin) {
        // Login request
        if (!validateEmail(email)) {
          setError("Please enter a valid email address")
          setLoading(false)
          return
        }

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

        // Store user info
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.name)

        router.push("/study-setup")
      } else {
        // Register request
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

        // Store user info
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.name)

        router.push("/study-setup")
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError("An error occurred. Please try again.")
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

  const isDarkMode = theme === "dark"

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex items-center justify-center p-4 ${
        isDarkMode ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <div className="absolute top-4 right-4">
        <Button
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
          className="rounded-full"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </Button>
      </div>

      <div
        className={`w-full max-w-md ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        } rounded-2xl shadow-2xl overflow-hidden`}
      >
        <div
          className={`p-8 ${
            isDarkMode ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50" : "bg-gradient-to-r from-purple-100 to-blue-100"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-lg ${isDarkMode ? "bg-purple-600" : "bg-purple-200"}`}
            >
              <Brain
                className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-purple-700"}`}
              />
            </div>
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              StudySync
            </h1>
          </div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Master Your Learning Journey
          </p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleTabSwitch(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                isLogin
                  ? isDarkMode
                    ? "bg-purple-600 text-white"
                    : "bg-purple-600 text-white"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabSwitch(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                !isLogin
                  ? isDarkMode
                    ? "bg-purple-600 text-white"
                    : "bg-purple-600 text-white"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

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
              <p
                className={`text-sm ${
                  isDarkMode ? "text-red-300" : "text-red-700"
                }`}
              >
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label
                  htmlFor="name"
                  className={`mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className={`mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className={`mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                      : "bg-white border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className={`mb-2 flex items-center gap-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      ) : (
                        <Eye
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Password Requirements:
                  </p>
                  <PasswordRequirement
                    met={passwordValidation.minLength}
                    text="At least 8 characters"
                    theme={theme}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasUpperCase}
                    text="One uppercase letter (A-Z)"
                    theme={theme}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasLowerCase}
                    text="One lowercase letter (a-z)"
                    theme={theme}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasNumber}
                    text="One number (0-9)"
                    theme={theme}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasSpecialChar}
                    text="One special character (!@#$%^&*)"
                    theme={theme}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
