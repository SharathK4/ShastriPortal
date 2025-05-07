"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ArrowLeft, FileText, Plus, Trash2, Upload, Users, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  getAssignments,
  addSubmission,
  addNotification,
  Assignment,
  Submission
} from "@/lib/student-storage"
import { syncSubmissions } from "@/lib/submission-connector"

interface GroupMember {
  id: string;  // Enrollment number
  name: string;
}

export default function SubmitAssignment({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const assignmentId = params.id
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Assignment details
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  
  // Form data
  const [content, setContent] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [newMemberId, setNewMemberId] = useState("")
  const [newMemberName, setNewMemberName] = useState("")
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState("")
  
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
  
  // Load assignment details
  useEffect(() => {
    if (isAuthenticated && assignmentId) {
      const assignments = getAssignments()
      const foundAssignment = assignments.find(a => a.id === assignmentId)
      
      if (foundAssignment) {
        setAssignment(foundAssignment)
        // If it's already submitted, redirect to assignments page
        if (foundAssignment.status === 'submitted' || foundAssignment.status === 'graded') {
          router.push('/student/assignments')
        }
        
        // Add current user as first group member if it's a group assignment
        if (foundAssignment.isGroupAssignment && user) {
          setGroupMembers([
            { id: user.studentId || "Unknown", name: user.name || "Unknown" }
          ])
        }
      } else {
        // Assignment not found, redirect back
        router.push('/student/assignments')
      }
    }
  }, [isAuthenticated, assignmentId, router, user])
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prevFiles => [...prevFiles, ...files])
      setFileNames(prevNames => [...prevNames, ...files.map(file => file.name)])
    }
  }
  
  // Remove a file from the selection
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    setFileNames(fileNames.filter((_, i) => i !== index))
  }
  
  // Add a group member
  const addGroupMember = () => {
    if (!newMemberId || !newMemberName) {
      setSubmissionError("Both enrollment number and name are required")
      return
    }
    
    // Check if the enrollment number is already in the list
    if (groupMembers.some(member => member.id === newMemberId)) {
      setSubmissionError("This enrollment number is already added")
      return
    }
    
    setGroupMembers([...groupMembers, { id: newMemberId, name: newMemberName }])
    setNewMemberId("")
    setNewMemberName("")
    setSubmissionError("")
  }
  
  // Remove a group member
  const removeGroupMember = (index: number) => {
    // Don't allow removing the current user (first member)
    if (index === 0) return
    
    setGroupMembers(groupMembers.filter((_, i) => i !== index))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionError("")
    
    try {
      // Validate form
      if (assignment?.isGroupAssignment && groupMembers.length < 2) {
        throw new Error("Please add at least one teammate for group submission")
      }
      
      if (selectedFiles.length === 0) {
        throw new Error("Please select at least one file to upload")
      }
      
      // In a real app, we would upload files to a server here
      // For this demo, we'll just store the file names
      
      // Create submission object
      const submission: Submission = {
        id: `submission-${Date.now()}`,
        assignmentId: assignmentId,
        studentId: user?.studentId || "Unknown",
        studentName: user?.name || "Unknown",
        content: content,
        attachments: fileNames,
        submissionDate: new Date().toISOString(),
        isGroupSubmission: assignment?.isGroupAssignment || false,
        groupMembers: assignment?.isGroupAssignment ? groupMembers : undefined
      }
      
      // Save submission to localStorage
      addSubmission(submission)
      
      // Sync with faculty submissions
      syncSubmissions()
      
      // Create notification
      addNotification({
        id: `notif-${Date.now()}`,
        title: "Assignment Submitted",
        message: `You have successfully submitted ${assignment?.title}`,
        createdAt: new Date().toISOString(),
        isRead: false,
        type: 'assignment'
      })
      
      // Redirect to assignments page
      router.push('/student/assignments')
    } catch (error) {
      if (error instanceof Error) {
        setSubmissionError(error.message)
      } else {
        setSubmissionError("An unexpected error occurred")
      }
      setIsSubmitting(false)
    }
  }
  
  // Format date
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Student"} userType="student" />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={() => router.push('/student/assignments')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assignments
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold">Submit Assignment</h1>
              <p className="text-muted-foreground">Complete and submit your work</p>
            </div>
          </div>
          
          {assignment && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>
                      Course: {assignment.courseName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      Due: {formatDate(assignment.dueDate)}
                    </Badge>
                    {assignment.isGroupAssignment && (
                      <Badge>Group Assignment</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Display Assignment Instructions */}
                  {assignment?.content && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Instructions</Label>
                      <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                        {assignment.content}
                      </div>
                    </div>
                  )}
                  
                  {/* Comments or submission notes */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Submission Notes (Optional)</Label>
                    <Textarea
                      id="content"
                      placeholder="Add any comments or notes about your submission"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  {/* Group Members Section (for group assignments) */}
                  {assignment.isGroupAssignment && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Group Members</Label>
                        <Badge variant="outline" className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {groupMembers.length} Member{groupMembers.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Enrollment No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupMembers.map((member, index) => (
                            <TableRow key={member.id}>
                              <TableCell>{member.id}</TableCell>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>
                                {index > 0 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeGroupMember(index)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full sm:w-1/3">
                          <Label htmlFor="newMemberId">Enrollment No.</Label>
                          <Input 
                            id="newMemberId" 
                            value={newMemberId} 
                            onChange={(e) => setNewMemberId(e.target.value)}
                            placeholder="Enter enrollment number"
                          />
                        </div>
                        <div className="w-full sm:w-1/3">
                          <Label htmlFor="newMemberName">Name</Label>
                          <Input 
                            id="newMemberName" 
                            value={newMemberName} 
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="Enter teammate name"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={addGroupMember}
                          className="px-2 w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Teammate
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Upload Files</Label>
                    
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}>
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload files</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF files recommended</p>
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange}
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
                      </div>
                    </div>
                    
                    {/* File List */}
                    {fileNames.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Files:</Label>
                        <div className="space-y-2">
                          {fileNames.map((name, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Error message */}
                  {submissionError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
                      {submissionError}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => router.push('/student/assignments')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                    {!isSubmitting && <Check className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
} 