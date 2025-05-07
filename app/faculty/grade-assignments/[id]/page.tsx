"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { 
  getFacultyAssignments, 
  getStudentSubmissions, 
  gradeSubmission,
  getSubmissionsByAssignment,
  addFacultyNotification,
  FacultyAssignment,
  StudentSubmission 
} from "@/lib/faculty-storage"
import { autoSyncSubmissions } from "@/lib/submission-connector"

type GradeFormData = {
  submissionId: string;
  score: string;
  feedback: string;
}

export default function GradeAssignmentPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const assignmentId = params.id
  
  const [assignment, setAssignment] = useState<FacultyAssignment | null>(null)
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
  const [pendingSubmissions, setPendingSubmissions] = useState<StudentSubmission[]>([])
  const [gradedSubmissions, setGradedSubmissions] = useState<StudentSubmission[]>([])
  const [currentSubmission, setCurrentSubmission] = useState<StudentSubmission | null>(null)
  const [gradeForm, setGradeForm] = useState<GradeFormData>({
    submissionId: "",
    score: "",
    feedback: ""
  })
  
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
  
  // Load assignment and submissions data
  useEffect(() => {
    if (isAuthenticated && assignmentId) {
      // Sync with student submissions first
      autoSyncSubmissions()
      
      // Get assignment details
      const assignments = getFacultyAssignments()
      const foundAssignment = assignments.find(a => a.id === assignmentId)
      if (foundAssignment) {
        setAssignment(foundAssignment)
      } else {
        // Assignment not found, redirect back
        router.push('/faculty/dashboard')
        return
      }
      
      // Get submissions for this assignment
      const allSubmissions = getSubmissionsByAssignment(assignmentId)
      setSubmissions(allSubmissions)
      
      // Separate pending and graded submissions
      setPendingSubmissions(allSubmissions.filter(s => s.status === 'submitted'))
      setGradedSubmissions(allSubmissions.filter(s => s.status === 'graded'))
      
      // Set first pending submission as current if available
      if (allSubmissions.filter(s => s.status === 'submitted').length > 0) {
        const firstPending = allSubmissions.find(s => s.status === 'submitted')
        if (firstPending) {
          setCurrentSubmission(firstPending)
          setGradeForm({
            submissionId: firstPending.id,
            score: "",
            feedback: ""
          })
        }
      }
    }
  }, [isAuthenticated, assignmentId, router])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGradeForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle selecting a submission to grade
  const handleSelectSubmission = (submission: StudentSubmission) => {
    setCurrentSubmission(submission)
    setGradeForm({
      submissionId: submission.id,
      score: submission.score?.toString() || "",
      feedback: submission.feedback || ""
    })
  }
  
  // Handle submitting a grade
  const handleSubmitGrade = () => {
    if (!currentSubmission) return
    
    const score = parseInt(gradeForm.score)
    if (isNaN(score) || score < 0 || score > (assignment?.maxScore || 100)) {
      alert(`Please enter a valid score between 0 and ${assignment?.maxScore || 100}`)
      return
    }
    
    // Update grade in local storage
    const updatedSubmissions = gradeSubmission(
      gradeForm.submissionId,
      score,
      gradeForm.feedback
    )
    
    // Create notification
    addFacultyNotification({
      id: `notif-${Date.now()}`,
      title: "Submission Graded",
      message: `You have graded ${currentSubmission.studentName}'s submission for ${assignment?.title}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'submission'
    })
    
    // Update local state
    setSubmissions(updatedSubmissions)
    
    // Reassign submissions to pending and graded
    const allSubmissionsForAssignment = updatedSubmissions.filter(s => s.assignmentId === assignmentId)
    setPendingSubmissions(allSubmissionsForAssignment.filter(s => s.status === 'submitted'))
    setGradedSubmissions(allSubmissionsForAssignment.filter(s => s.status === 'graded'))
    
    // Find next pending submission
    const nextPending = allSubmissionsForAssignment.find(s => s.status === 'submitted')
    if (nextPending) {
      setCurrentSubmission(nextPending)
      setGradeForm({
        submissionId: nextPending.id,
        score: "",
        feedback: ""
      })
    } else {
      // No more pending submissions
      setCurrentSubmission(null)
      setGradeForm({
        submissionId: "",
        score: "",
        feedback: ""
      })
      
      // Show completion message
      alert("All submissions have been graded!")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Faculty"} userType="faculty" />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={() => router.push('/faculty/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold">{assignment?.title || "Assignment"}</h1>
              <p className="text-muted-foreground">{assignment?.courseName || "Course"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar - List of submissions */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Submissions</CardTitle>
                  <CardDescription>
                    {submissions.length} total • {pendingSubmissions.length} pending • {gradedSubmissions.length} graded
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <Tabs defaultValue="pending">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="graded">Graded</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending" className="pt-4">
                      {pendingSubmissions.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          No pending submissions
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {pendingSubmissions.map(submission => (
                            <div 
                              key={submission.id} 
                              className={`p-3 rounded-md cursor-pointer ${
                                currentSubmission?.id === submission.id 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => handleSelectSubmission(submission)}
                            >
                              <div className="font-medium">{submission.studentName}</div>
                              <div className="text-xs text-muted-foreground flex justify-between mt-1">
                                <span>Submitted: {new Date(submission.submissionDate).toLocaleDateString()}</span>
                                <Badge variant="outline">Pending</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="graded" className="pt-4">
                      {gradedSubmissions.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          No graded submissions
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {gradedSubmissions.map(submission => (
                            <div 
                              key={submission.id} 
                              className={`p-3 rounded-md cursor-pointer ${
                                currentSubmission?.id === submission.id 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => handleSelectSubmission(submission)}
                            >
                              <div className="font-medium">{submission.studentName}</div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Score: {submission.score}/{assignment?.maxScore}
                                </span>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  Graded
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content - Submission details and grading */}
            <div className="lg:col-span-2 space-y-6">
              {currentSubmission ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Submission Details</CardTitle>
                          <CardDescription>
                            Submitted by {currentSubmission.studentName} on {new Date(currentSubmission.submissionDate).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge variant={currentSubmission.status === 'submitted' ? 'outline' : 'default'}>
                          {currentSubmission.status === 'submitted' ? 'Pending' : 'Graded'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentSubmission.isGroupSubmission && currentSubmission.groupMembers && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Group Members</h3>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <ul className="list-disc pl-5 space-y-1">
                              {currentSubmission.groupMembers.map(member => (
                                <li key={member.id} className="text-sm">{member.name}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Submission Content</h3>
                        <div className="bg-muted/50 p-3 rounded-md min-h-32">
                          {/* In a real app, this would display the actual submission content */}
                          <p className="text-muted-foreground italic">
                            Submission content would be displayed here. This could include file previews,
                            text responses, or links to submitted documents.
                          </p>
                        </div>
                      </div>
                      
                      {currentSubmission.attachments && currentSubmission.attachments.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Attachments</h3>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <ul className="list-disc pl-5 space-y-1">
                              {currentSubmission.attachments.map((attachment, index) => (
                                <li key={index} className="text-sm">
                                  <a href="#" className="text-blue-600 hover:underline">{attachment}</a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Grade Submission</CardTitle>
                      <CardDescription>
                        Provide a score and feedback for this submission
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">
                          Score (out of {assignment?.maxScore || 100})
                        </Label>
                        <Input
                          id="score"
                          name="score"
                          type="number"
                          placeholder={`Enter score (0-${assignment?.maxScore || 100})`}
                          value={gradeForm.score}
                          onChange={handleInputChange}
                          min="0"
                          max={assignment?.maxScore.toString() || "100"}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback</Label>
                        <Textarea
                          id="feedback"
                          name="feedback"
                          placeholder="Provide feedback for the student"
                          rows={5}
                          value={gradeForm.feedback}
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/faculty/dashboard')}
                      >
                        Save for Later
                      </Button>
                      <Button 
                        onClick={handleSubmitGrade}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Submit Grade
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      {submissions.length === 0 ? (
                        <p>No submissions available for this assignment</p>
                      ) : (
                        <p>All submissions have been graded. Select a submission from the sidebar to view details.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 