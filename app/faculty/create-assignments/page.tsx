"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, ArrowLeft, Edit, Save, Eye, Clock } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  getFacultyCourses, 
  createAssignment, 
  addFacultyNotification,
  FacultyCourse, 
  FacultyAssignment 
} from "@/lib/faculty-storage"
import { Badge } from "@/components/ui/badge"
import { syncAssignments } from "@/lib/assignment-connector"

// Local storage key for draft assignments
const DRAFT_ASSIGNMENT_KEY = 'shastri_draft_assignment';

export default function CreateAssignments() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isGroupAssignment, setIsGroupAssignment] = useState(false)
  const [courses, setCourses] = useState<FacultyCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [points, setPoints] = useState<string>("100")
  const [groupSize, setGroupSize] = useState<string>("4")
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [draftSaved, setDraftSaved] = useState(false)
  
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
  
  // Load courses from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const storedCourses = getFacultyCourses()
      setCourses(storedCourses)
      
      // Check for draft assignment
      if (typeof window !== 'undefined') {
        const draftAssignment = localStorage.getItem(DRAFT_ASSIGNMENT_KEY)
        if (draftAssignment) {
          const parsed = JSON.parse(draftAssignment)
          setTitle(parsed.title || "")
          setDescription(parsed.description || "")
          setSelectedCourseId(parsed.courseId || "")
          setPoints(parsed.maxScore?.toString() || "100")
          setIsGroupAssignment(parsed.isGroupAssignment || false)
          if (parsed.maxGroupSize) {
            setGroupSize(parsed.maxGroupSize.toString())
          }
          if (parsed.dueDate) {
            setDate(new Date(parsed.dueDate))
          }
          setDraftSaved(true)
        }
      }
    }
  }, [isAuthenticated])
  
  // Create assignment object from form data
  const createAssignmentObject = (): FacultyAssignment => {
    // Find selected course
    const selectedCourse = courses.find(course => course.id === selectedCourseId)
    
    // Create assignment object
    const newAssignment: FacultyAssignment = {
      id: `ASG${Date.now()}`,
      title,
      courseId: selectedCourseId,
      courseName: selectedCourse?.name || "",
      description,
      dueDate: date ? date.toISOString() : new Date().toISOString(),
      maxScore: Number(points),
      isGroupAssignment,
      createdAt: new Date().toISOString(),
    }
    
    // If group assignment, add max group size
    if (isGroupAssignment) {
      newAssignment.maxGroupSize = Number(groupSize)
    }
    
    return newAssignment
  }
  
  // Save draft assignment to local storage
  const saveDraft = () => {
    if (typeof window !== 'undefined') {
      const draftAssignment = createAssignmentObject()
      localStorage.setItem(DRAFT_ASSIGNMENT_KEY, JSON.stringify(draftAssignment))
      setDraftSaved(true)
      
      // Show notification
      alert("Draft saved successfully!")
    }
  }
  
  // Clear draft from local storage
  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRAFT_ASSIGNMENT_KEY)
      setDraftSaved(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCourseId || !title || !description || !date || !points) {
      alert("Please fill all required fields")
      return
    }
    
    // Find selected course
    const selectedCourse = courses.find(course => course.id === selectedCourseId)
    if (!selectedCourse) {
      alert("Please select a valid course")
      return
    }
    
    // Switch to preview mode
    if (mode === "edit") {
      setMode("preview")
      // Automatically save as draft when previewing
      saveDraft()
      return
    }
    
    // Create new assignment object
    const newAssignment = createAssignmentObject()
    
    // Save to localStorage
    createAssignment(newAssignment)
    
    // Create notification
    addFacultyNotification({
      id: `NOTIF${Date.now()}`,
      title: "Assignment Created",
      message: `You have created a new assignment: ${title} for ${selectedCourse.name}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'assignment'
    })
    
    // Sync with student assignments
    syncAssignments()
    
    // Clear draft
    clearDraft()
    
    // Show success message and redirect
    alert("Assignment created successfully!")
    router.push("/faculty/dashboard")
  }
  
  // Format date for display
  const formatDueDate = (dateString?: string | Date) => {
    if (!dateString) return "Not set"
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return format(date, "PPP")
  }
  
  // Calculate remaining days
  const getRemainingDays = (dateString?: string | Date) => {
    if (!dateString) return 0
    const dueDate = typeof dateString === 'string' ? new Date(dateString) : dateString
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Faculty"} userType="faculty" />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{mode === "edit" ? "Create New Assignment" : "Assignment Preview"}</h1>
            {mode === "preview" && (
              <Button 
                variant="outline" 
                onClick={() => setMode("edit")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </Button>
            )}
          </div>

          {mode === "edit" ? (
            <Card className="animate-fadeIn">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                  <CardDescription>
                    Create a new assignment for your students. Fill in all the required details below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter assignment title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Select 
                        required
                        value={selectedCourseId}
                        onValueChange={setSelectedCourseId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.code}: {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Assignment Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed instructions for the assignment"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">Total Points</Label>
                      <Input 
                        id="points" 
                        type="number" 
                        min="1" 
                        placeholder="100" 
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="group-assignment">Group Assignment</Label>
                      <Switch id="group-assignment" checked={isGroupAssignment} onCheckedChange={setIsGroupAssignment} />
                    </div>
                    {isGroupAssignment && (
                      <div className="pt-2 space-y-2">
                        <Label htmlFor="group-size">Maximum Group Size</Label>
                        <Input 
                          id="group-size" 
                          type="number" 
                          min="2" 
                          max="10" 
                          placeholder="4" 
                          value={groupSize}
                          onChange={(e) => setGroupSize(e.target.value)}
                          required 
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, ZIP (Max 10MB)</p>
                      <Input id="attachments" type="file" className="hidden" />
                      <Button type="button" variant="outline" size="sm" className="mt-4">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={saveDraft} 
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save as Draft
                    </Button>
                    {draftSaved && (
                      <span className="text-xs text-green-600 ml-2">
                        Draft saved
                      </span>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button 
                      type="submit" 
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Card className="animate-fadeIn">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>
                      {courses.find(c => c.id === selectedCourseId)?.name || ""}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isGroupAssignment && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Group Assignment
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {points} Points
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">{formatDueDate(date)}</p>
                    </div>
                  </div>
                  <Badge className={getRemainingDays(date) > 3 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }>
                    {getRemainingDays(date)} days remaining
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Assignment Description</h3>
                  <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                    {description}
                  </div>
                </div>
                
                {isGroupAssignment && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Group Requirements</h3>
                    <div className="p-4 bg-muted/50 rounded-md">
                      <p>Maximum group size: <strong>{groupSize} students</strong></p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Students can form groups of up to {groupSize} members to complete this assignment.
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Attachments</h3>
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-muted-foreground">No attachments added</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setMode("edit")}
                >
                  <Edit className="h-4 w-4" />
                  Edit Assignment
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  <Save className="h-4 w-4" />
                  Publish Assignment
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

