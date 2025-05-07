"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  getFacultyCourses, 
  getFacultyAssignments, 
  getStudentSubmissions,
  getFacultyTickets,
  getFacultyNotifications,
  FacultyCourse,
  FacultyAssignment,
  StudentSubmission,
  FacultyTicket,
  FacultyNotification
} from "@/lib/faculty-storage"
import { autoSyncSubmissions } from "@/lib/submission-connector"

export default function FacultyDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  // State for faculty data
  const [courses, setCourses] = useState<FacultyCourse[]>([])
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([])
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
  const [tickets, setTickets] = useState<FacultyTicket[]>([])
  const [notifications, setNotifications] = useState<FacultyNotification[]>([])
  
  // If loading, show nothing
  if (isLoading) {
    return null
  }
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/faculty')
    }
  }, [isLoading, isAuthenticated, router])
  
  // Load faculty data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      // Sync with student submissions first
      autoSyncSubmissions()
      
      // Load courses
      const storedCourses = getFacultyCourses()
      setCourses(storedCourses)
      
      // Load assignments
      const storedAssignments = getFacultyAssignments()
      setAssignments(storedAssignments)
      
      // Load submissions
      const storedSubmissions = getStudentSubmissions()
      setSubmissions(storedSubmissions)
      
      // Load tickets
      const storedTickets = getFacultyTickets()
      setTickets(storedTickets)
      
      // Load notifications
      const storedNotifications = getFacultyNotifications()
      setNotifications(storedNotifications)
    }
  }, [isAuthenticated])
  
  // Count pending assignments (submitted but not graded)
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted')
  // Count graded submissions
  const gradedSubmissions = submissions.filter(s => s.status === 'graded')
  // Count unresolved tickets
  const unresolvedTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress')
  
  // Group submissions by assignment for better stats
  const submissionsByAssignment = pendingSubmissions.reduce((acc, submission) => {
    if (!acc[submission.assignmentId]) {
      acc[submission.assignmentId] = [];
    }
    acc[submission.assignmentId].push(submission);
    return acc;
  }, {} as Record<string, StudentSubmission[]>);
  
  // Get assignments with pending submissions
  const assignmentsWithPendingSubmissions = assignments.filter(
    assignment => submissionsByAssignment[assignment.id]?.length > 0
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Faculty"} userType="faculty" />

      <main className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">{pendingSubmissions.length}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>to be graded</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.15s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Graded Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">{gradedSubmissions.length}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Student Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">{unresolvedTickets.length}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>unresolved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Assignments for Grading Section */}
        {pendingSubmissions.length > 0 && (
          <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.25s" }}>
            <h2 className="text-2xl font-medium">Pending Submissions for Grading</h2>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-3 px-4 text-left font-medium text-sm">Assignment</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Course</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Submissions</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Last Submission</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {assignmentsWithPendingSubmissions.length > 0 ? (
                      assignmentsWithPendingSubmissions.map(assignment => {
                        const pendingForAssignment = submissionsByAssignment[assignment.id] || [];
                        const lastSubmissionDate = pendingForAssignment.length > 0 
                          ? new Date(Math.max(...pendingForAssignment.map(s => new Date(s.submissionDate).getTime())))
                          : null;
                        
                        return (
                          <tr key={assignment.id} className="hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {assignment.isGroupAssignment ? 'Group Assignment' : 'Individual Assignment'}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {assignment.courseName}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="font-medium">{pendingForAssignment.length}</span>
                                <span className="text-sm text-muted-foreground ml-1">pending</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {lastSubmissionDate ? (
                                <div className="text-sm">
                                  {new Date(lastSubmissionDate).toLocaleDateString()}, {' '}
                                  {new Date(lastSubmissionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              ) : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <Button size="sm" onClick={() => router.push(`/faculty/grade-assignments/${assignment.id}`)}>
                                Grade Now
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          No pending submissions to grade
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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

          <div className="border rounded-lg overflow-hidden">
            <div className="calendar-grid min-h-[600px] relative">
              {/* Time labels */}
              <div className="border-r border-b p-2 text-xs text-muted-foreground">Time</div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>

              {/* 8 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">8 AM</div>
              <div className="border-r relative">
                <div className="calendar-event client-presentation" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">8 AM - 9 AM</div>
                  <div className="text-xs">Lecture Preparation</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event project-kickoff" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">8 AM - 9 AM</div>
                  <div className="text-xs">Department Meeting</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>

              {/* 9 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">9 AM</div>
              <div className="border-r relative">
                <div className="calendar-event client-meeting" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">9 AM - 10:30 AM</div>
                  <div className="text-xs">CSE 1 Lecture</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event design-revisions" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Office Hours</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event design-refinement" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">CSE 7 Lecture</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event design-team" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">9:30 AM - 10 AM</div>
                  <div className="text-xs">Faculty Meeting</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event planning-goal" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Research Planning</div>
                </div>
              </div>
              <div className="border-r"></div>

              {/* 10 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">10 AM</div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event collaboration" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">10 AM - 11 AM</div>
                  <div className="text-xs">Student Consultation</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-advisor" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">10 AM - 11 AM</div>
                  <div className="text-xs">Thesis Review</div>
                </div>
              </div>

              {/* 11 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">11 AM</div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-ux" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">11 AM - 12 AM</div>
                  <div className="text-xs">Research Group Meeting</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event client-feedback" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">11 AM - 12:30 AM</div>
                  <div className="text-xs">Grading Session</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl font-medium">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.length > 0 ? (
                  assignments
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map(assignment => (
                      <div key={assignment.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h3 className="font-medium">{assignment.courseName}: {assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No upcoming assignment deadlines</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <div key={course.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-medium">{course.code}: {course.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.schedule && course.schedule.length > 0 ? course.schedule[0] : 'Schedule not set'}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Prepare
                      </Button>
                    </div>
                  )).slice(0, 3)
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No upcoming classes found</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

