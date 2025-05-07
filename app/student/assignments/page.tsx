"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Check, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  getAssignments,
  updateAssignment,
  Assignment,
  addNotification
} from "@/lib/student-storage"
import { autoSyncAssignments } from "@/lib/assignment-connector"

export default function StudentAssignments() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
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
  
  // Load assignments from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      // Sync with faculty assignments first
      autoSyncAssignments()
      
      // Then load the (potentially updated) assignments
      const storedAssignments = getAssignments()
      setAssignments(storedAssignments)
    }
  }, [isAuthenticated])
  
  // Handle marking an assignment as submitted
  const handleSubmitAssignment = (assignmentId: string) => {
    // Navigate to the assignment submission page
    router.push(`/student/assignments/submit/${assignmentId}`);
  }
  
  // Count assignments by status
  const pendingAssignments = assignments.filter(a => a.status === 'pending')
  const submittedAssignments = assignments.filter(a => a.status === 'submitted')
  const gradedAssignments = assignments.filter(a => a.status === 'graded')
  
  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Helper to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Helper to check if assignment is due soon (within 3 days)
  const isDueSoon = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)
    return diffDays <= 3 && diffDays > 0
  }
  
  // Helper to check if assignment is overdue
  const isOverdue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    return now > due
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Student"} userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{pendingAssignments.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Submitted Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{submittedAssignments.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Graded Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{gradedAssignments.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">My Assignments</h2>
            <div className="w-full max-w-sm">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {filteredAssignments.filter(a => a.status === 'pending').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">No pending assignments found.</p>
                </div>
              ) : (
                filteredAssignments
                  .filter(a => a.status === 'pending')
                  .map(assignment => (
                    <Card key={assignment.id} className="animate-fadeIn">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <h3 className="font-medium text-lg">{assignment.title}</h3>
                              {assignment.isGroupAssignment && (
                                <Badge variant="outline" className="ml-2">Group</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Course: {assignment.courseName}
                            </p>
                            <div className="flex items-center mt-2">
                              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm">
                                Due: {formatDate(assignment.dueDate)}
                                {isDueSoon(assignment.dueDate) && (
                                  <Badge variant="outline" className="ml-2 bg-yellow-500 text-white">Due Soon</Badge>
                                )}
                                {isOverdue(assignment.dueDate) && (
                                  <Badge variant="outline" className="ml-2 bg-red-500 text-white">Overdue</Badge>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              className="w-full md:w-auto"
                              onClick={() => handleSubmitAssignment(assignment.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Submit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
              )}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4 mt-6">
              {filteredAssignments.filter(a => a.status === 'submitted').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">No submitted assignments found.</p>
                </div>
              ) : (
                filteredAssignments
                  .filter(a => a.status === 'submitted')
                  .map(assignment => (
                    <Card key={assignment.id} className="animate-fadeIn">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <h3 className="font-medium text-lg">{assignment.title}</h3>
                              {assignment.isGroupAssignment && (
                                <Badge variant="outline" className="ml-2">Group</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Course: {assignment.courseName}
                            </p>
                            <div className="flex items-center mt-2">
                              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm">
                                Due: {formatDate(assignment.dueDate)}
                              </span>
                              <Badge className="ml-2 bg-green-500 text-white">Submitted</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" className="w-full md:w-auto">
                              View Submission
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
              )}
            </TabsContent>

            <TabsContent value="graded" className="space-y-4 mt-6">
              {filteredAssignments.filter(a => a.status === 'graded').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">No graded assignments found.</p>
                </div>
              ) : (
                filteredAssignments
                  .filter(a => a.status === 'graded')
                  .map(assignment => (
                    <Card key={assignment.id} className="animate-fadeIn">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <h3 className="font-medium text-lg">{assignment.title}</h3>
                              {assignment.isGroupAssignment && (
                                <Badge variant="outline" className="ml-2">Group</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Course: {assignment.courseName}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-sm font-medium">
                                Score: {assignment.score} / {assignment.maxScore}
                              </span>
                              <Badge className="ml-2 bg-blue-500 text-white">Graded</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" className="w-full md:w-auto">
                              View Feedback
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

