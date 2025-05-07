"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePreferences } from "@/lib/preferences-context"
import { useRouter } from "next/navigation"
import { 
  getEnrolledCourses, 
  getAssignments, 
  getGrades, 
  getNotifications,
  Course,
  Assignment,
  Grade,
  Notification
} from "@/lib/student-storage"
import { autoSyncAssignments } from "@/lib/assignment-connector"

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { preferences, updatePreferences } = usePreferences()
  const router = useRouter()
  
  // State for student data
  const [courses, setCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [pendingAssignments, setPendingAssignments] = useState(0)
  const [grades, setGrades] = useState<Grade[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [latestScore, setLatestScore] = useState(0)
  const [lastPeriodScore, setLastPeriodScore] = useState(0)
  
  // If loading, show nothing
  if (isLoading) {
    return null
  }
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/student')
    }
  }, [isLoading, isAuthenticated, router])
  
  // Load data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      // Sync assignments first
      autoSyncAssignments()
      
      // Load courses
      const storedCourses = getEnrolledCourses()
      setCourses(storedCourses)
      
      // Load assignments
      const storedAssignments = getAssignments()
      setAssignments(storedAssignments)
      
      // Count pending assignments
      const pending = storedAssignments.filter(a => a.status === 'pending').length
      setPendingAssignments(pending)
      
      // Load grades
      const storedGrades = getGrades()
      setGrades(storedGrades)
      
      // Calculate latest score
      if (storedGrades.length > 0) {
        // Assuming the grades are sorted by date, we get the last one
        const latest = storedGrades[storedGrades.length - 1]
        setLatestScore(latest.score)
        
        // Compare with previous period (this is mock data)
        setLastPeriodScore(latest.score - 5) // Mock: 5 points improvement
      }
      
      // Load notifications
      const storedNotifications = getNotifications()
      setNotifications(storedNotifications)
    }
  }, [isAuthenticated])
  
  // Use selectedView from preferences or default to "week"
  const [selectedView, setSelectedView] = useState<"week" | "month">(
    (preferences.viewMode as "week" | "month") || "week"
  )
  
  // Update preferences when view changes
  const handleViewChange = (view: "week" | "month") => {
    setSelectedView(view)
    updatePreferences({ viewMode: view })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Student"} userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current No. of Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{pendingAssignments}</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">{courses.length}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>vs last period 12 months</span>
                  <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Assignment Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">{latestScore}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>vs last period score {lastPeriodScore}</span>
                  {latestScore > lastPeriodScore ? (
                    <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Calendar</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="text-sm font-medium">MON 24</div>
              <div className="text-sm font-medium">TUE 25</div>
              <div className="text-sm font-medium">WED 26</div>
              <div className="text-sm font-medium">THU 27</div>
              <div className="text-sm font-medium">FRI 28</div>
              <div className="text-sm font-medium">SAT 29</div>
              <div className="text-sm font-medium">SUN 30</div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={selectedView === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("week")}
              >
                Week
              </Button>
              <Button
                variant={selectedView === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("month")}
              >
                Month
              </Button>
            </div>
          </div>

          <div className="bg-card p-4 rounded-md border border-border h-64">
            {selectedView === "week" ? (
              <div className="text-center py-20">Weekly View Calendar Content</div>
            ) : (
              <div className="text-center py-20">Monthly View Calendar Content</div>
            )}
          </div>
        </div>
        
        {/* Recent notifications */}
        {notifications.length > 0 && (
          <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-medium">Recent Notifications</h2>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-3 bg-card rounded-md border border-border">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))}
              {notifications.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/student/notifications')}
                >
                  View All Notifications
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

