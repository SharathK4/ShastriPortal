"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { UserData } from "@/lib/localStorage"
import { initializeStudentData } from "@/lib/student-storage"

export default function StudentLogin() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to authenticate
      // For now, we'll simulate authentication
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a fake student ID
      const studentId = `STU${Math.floor(1000 + Math.random() * 9000)}`
      
      // Mock user data (in production, this would come from API)
      const userData: UserData = {
        id: studentId,
        name: "Virat",
        email: formData.email,
        userType: "student",
        // In production, token would come from the backend
        token: "mock-jwt-token",
      }
      
      // Initialize student data in localStorage
      initializeStudentData(studentId, userData.name, userData.email)
      
      // Use authentication context to log in
      login(userData)
      
      // No need to redirect here as the login function handles it
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-24 h-24" />
          <h1 className="text-3xl font-bold mt-4 font-shastri">Shastri</h1>
          <p className="text-gray-600 mt-1">Student Login</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2" />
              Student Login
            </CardTitle>
            <CardDescription>Enter your credentials to access your student portal</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-sm text-center text-gray-500">
                <Link href="/" className="hover:underline">
                  Back to home
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

