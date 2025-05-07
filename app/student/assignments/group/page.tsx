"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Clock, FileText, User, Users, Check, Plus, X } from "lucide-react"
import {
  getAssignments,
  updateAssignment,
  Assignment,
  addNotification
} from "@/lib/student-storage"

// Mock group members for demonstration
const groupMembers = [
  { id: "1", name: "Rahul Singh", role: "Leader" },
  { id: "2", name: "Aishwarya Patel", role: "Member" },
  { id: "3", name: "Vikram Sharma", role: "Member" },
  { id: "4", name: "Priya Kumar", role: "Member" },
];

export default function GroupAssignments() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  
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
      const storedAssignments = getAssignments()
      // Filter only group assignments
      const groupAssignments = storedAssignments.filter(a => a.isGroupAssignment)
      setAssignments(groupAssignments)
    }
  }, [isAuthenticated])
  
  // Handle marking an assignment as submitted
  const handleSubmitAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (!assignment) return
    
    const updatedAssignment: Assignment = {
      ...assignment,
      status: 'submitted'
    }
    
    const updatedAssignments = updateAssignment(updatedAssignment)
    // Filter only group assignments after update
    const groupAssignments = updatedAssignments.filter(a => a.isGroupAssignment)
    setAssignments(groupAssignments)
    
    // Add a notification for the submission
    addNotification({
      id: `group-submit-${Date.now()}`,
      title: "Group Assignment Submitted",
      message: `Your group has successfully submitted ${assignment.title}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'assignment'
    })
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Group Assignments</h1>
          <Button onClick={() => router.push('/student/assignments')}>
            All Assignments
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Group Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{pendingAssignments.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Submitted Group Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{submittedAssignments.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Graded Group Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{gradedAssignments.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">My Group Assignments</h2>
            <div className="w-full max-w-sm">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                placeholder="Search group assignments..."
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
                  <p className="text-lg text-muted-foreground">No pending group assignments found.</p>
                </div>
              ) : (
                filteredAssignments
                  .filter(a => a.status === 'pending')
                  .map(assignment => (
                    <Card key={assignment.id} className="animate-fadeIn">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <CardTitle>{assignment.title}</CardTitle>
                              <Badge className="ml-2 bg-purple-500 text-white">Group</Badge>
                            </div>
                            <CardDescription>Course: {assignment.courseName}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">
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
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-base font-medium mb-2">Group Members</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupMembers.map(member => (
                                <div key={member.id} className="flex items-center space-x-2 bg-secondary/20 rounded-full py-1 px-3">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{member.name}</span>
                                  {member.role === "Leader" && (
                                    <Badge variant="outline" className="text-xs">Leader</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-base font-medium">Progress</h3>
                            <div className="bg-secondary/20 rounded-md p-3">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Task Distribution</span>
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Initial Research</span>
                                <span className="text-sm font-medium">In Progress</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Implementation</span>
                                <span className="text-sm font-medium">Not Started</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Final Submission</span>
                                <span className="text-sm font-medium">Not Started</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" onClick={() => setSelectedGroup(assignment.id)}>
                          <Users className="h-4 w-4 mr-2" />
                          Manage Group
                        </Button>
                        <Button onClick={() => handleSubmitAssignment(assignment.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4 mt-6">
              {filteredAssignments.filter(a => a.status === 'submitted').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">No submitted group assignments found.</p>
                </div>
              ) : (
                filteredAssignments
                  .filter(a => a.status === 'submitted')
                  .map(assignment => (
                    <Card key={assignment.id} className="animate-fadeIn">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <CardTitle>{assignment.title}</CardTitle>
                              <Badge className="ml-2 bg-purple-500 text-white">Group</Badge>
                            </div>
                            <CardDescription>Course: {assignment.courseName}</CardDescription>
                          </div>
                          <Badge className="bg-green-500 text-white">Submitted</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-base font-medium mb-2">Submission Details</h3>
                            <div className="bg-secondary/20 rounded-md p-3">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Submitted Date</span>
                                <span className="text-sm font-medium">June 15, 2023</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm">Submitted By</span>
                                <span className="text-sm font-medium">Rahul Singh (Group Leader)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Status</span>
                                <span className="text-sm font-medium">Awaiting Grading</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-base font-medium mb-2">Group Members</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupMembers.map(member => (
                                <div key={member.id} className="flex items-center space-x-2 bg-secondary/20 rounded-full py-1 px-3">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{member.name}</span>
                                  {member.role === "Leader" && (
                                    <Badge variant="outline" className="text-xs">Leader</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full">
                          View Submission Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </TabsContent>

            <TabsContent value="graded" className="space-y-4 mt-6">
              {filteredAssignments.filter(a => a.status === 'graded').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">No graded group assignments found.</p>
                </div>
              ) : (
                filteredAssignments
                  .filter(a => a.status === 'graded')
                  .map(assignment => (
                    <Card key={assignment.id} className="animate-fadeIn">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <CardTitle>{assignment.title}</CardTitle>
                              <Badge className="ml-2 bg-purple-500 text-white">Group</Badge>
                            </div>
                            <CardDescription>Course: {assignment.courseName}</CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-blue-500 text-white mb-2">Graded</Badge>
                            <div className="text-lg font-bold">
                              Score: {assignment.score} / {assignment.maxScore}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-base font-medium mb-2">Feedback</h3>
                            <div className="bg-secondary/20 rounded-md p-3">
                              <p className="text-sm">
                                Great work by the team! The project shows excellent collaboration and a thorough understanding of the concepts.
                                Consider adding more depth to the implementation section in future assignments.
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-base font-medium mb-2">Group Members</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupMembers.map(member => (
                                <div key={member.id} className="flex items-center space-x-2 bg-secondary/20 rounded-full py-1 px-3">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{member.name}</span>
                                  {member.role === "Leader" && (
                                    <Badge variant="outline" className="text-xs">Leader</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full">
                          View Detailed Feedback
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Group Member Management Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Manage Group Members</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedGroup(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Add or remove members from your group for this assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Current Members</h3>
                  <div className="space-y-2">
                    {groupMembers.map(member => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-2 rounded-md border"
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                          </div>
                        </div>
                        {member.role !== "Leader" && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Add New Members</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Search for students..." className="flex-1" />
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedGroup(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setSelectedGroup(null)}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

