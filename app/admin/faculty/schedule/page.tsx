"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Calendar, 
  Search, 
  Clock, 
  Save,
  Download,
  Filter,
  X,
  Plus,
  Trash2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Schedule entry interface
interface ScheduleEntry {
  id: string
  facultyId: string
  facultyName: string
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
  startTime: string
  endTime: string
  courseId: string
  courseName: string
  batchName: string
  section: string
  roomNumber: string
  type: "Lecture" | "Lab" | "Tutorial"
}

// Faculty interface
interface Faculty {
  id: string
  name: string
  department: string
}

// Course interface
interface Course {
  id: string
  name: string
  department: string
}

// Mock faculty data
const mockFaculty: Faculty[] = [
  { id: "FAC1001", name: "Dr. Rajesh Sharma", department: "Computer Science" },
  { id: "FAC1002", name: "Dr. Suresh Patel", department: "Computer Science" },
  { id: "FAC1003", name: "Dr. Mahesh Gupta", department: "Computer Science" },
  { id: "FAC1004", name: "Dr. Anil Kumar", department: "Electrical Engineering" },
  { id: "FAC1005", name: "Dr. Harish Singh", department: "Electrical Engineering" },
  { id: "FAC1006", name: "Dr. Ramesh Reddy", department: "Mechanical Engineering" },
  { id: "FAC1007", name: "Dr. Satish Mishra", department: "Civil Engineering" },
  { id: "FAC1008", name: "Dr. Dinesh Joshi", department: "Electronics & Communication" }
]

// Mock course data
const mockCourses: Course[] = [
  { id: "CRS1001", name: "Introduction to Computer Science", department: "Computer Science" },
  { id: "CRS1002", name: "Data Structures", department: "Computer Science" },
  { id: "CRS1003", name: "Algorithms", department: "Computer Science" },
  { id: "CRS1004", name: "Basic Electrical Engineering", department: "Electrical Engineering" },
  { id: "CRS1005", name: "Analog Electronics", department: "Electrical Engineering" },
  { id: "CRS1006", name: "Engineering Mechanics", department: "Mechanical Engineering" },
  { id: "CRS1007", name: "Engineering Drawing", department: "Civil Engineering" },
  { id: "CRS1008", name: "Digital Electronics", department: "Electronics & Communication" }
]

// Mock batches and sections
const batches = ["CS 2020-24", "CS 2021-25", "CS 2022-26", "CS 2023-27", "EE 2020-24", "EE 2021-25"]
const sections = ["1", "2", "3", "4", "5", "6", "7"]
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const types = ["Lecture", "Lab", "Tutorial"]

// Generate random time between 9 AM and 5 PM in HH:MM format
function getRandomTime(start = 9, end = 17) {
  const hour = Math.floor(Math.random() * (end - start + 1)) + start
  const minute = Math.random() > 0.5 ? 0 : 30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Generate a valid end time 1-2 hours after start time
function getEndTime(startTime: string) {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const durationHours = Math.random() > 0.5 ? 1 : 2
  
  let endHour = startHour + durationHours
  let endMinute = startMinute
  
  // Make sure end time doesn't exceed 6 PM
  if (endHour > 18) {
    endHour = 18
    endMinute = 0
  }
  
  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
}

// Generate mock schedule data
const mockSchedule: ScheduleEntry[] = Array.from({ length: 50 }).map((_, index) => {
  const facultyIndex = Math.floor(Math.random() * mockFaculty.length)
  const faculty = mockFaculty[facultyIndex]
  
  const courseIndex = Math.floor(Math.random() * mockCourses.length)
  const course = mockCourses[courseIndex]
  
  const batchIndex = Math.floor(Math.random() * batches.length)
  const batch = batches[batchIndex]
  
  const sectionIndex = Math.floor(Math.random() * sections.length)
  const section = sections[sectionIndex]
  
  const dayIndex = Math.floor(Math.random() * days.length)
  const day = days[dayIndex] as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
  
  const typeIndex = Math.floor(Math.random() * types.length)
  const type = types[typeIndex] as "Lecture" | "Lab" | "Tutorial"
  
  const startTime = getRandomTime()
  const endTime = getEndTime(startTime)
  
  const roomNumber = `${Math.floor(Math.random() * 5) + 1}${Math.floor(Math.random() * 100) + 1}`

  return {
    id: `SCH${1000 + index}`,
    facultyId: faculty.id,
    facultyName: faculty.name,
    day,
    startTime,
    endTime,
    courseId: course.id,
    courseName: course.name,
    batchName: batch,
    section,
    roomNumber,
    type
  }
})

export default function FacultySchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule)
  const [searchTerm, setSearchTerm] = useState("")
  const [facultyFilter, setFacultyFilter] = useState<string>("all")
  const [dayFilter, setDayFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // Form data for adding new schedule entry
  const [formData, setFormData] = useState({
    facultyId: "",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    courseId: "",
    batchName: batches[0],
    section: sections[0],
    roomNumber: "",
    type: "Lecture"
  })
  
  // Filter schedule based on search and filters
  const filteredSchedule = schedule.filter(entry => {
    const matchesSearch = 
      entry.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFaculty = facultyFilter === "all" || entry.facultyId === facultyFilter
    const matchesDay = dayFilter === "all" || entry.day === dayFilter
    
    return matchesSearch && matchesFaculty && matchesDay
  })
  
  // Reset filters
  const resetFilters = () => {
    setFacultyFilter("all")
    setDayFilter("all")
  }
  
  // Get faculty schedule by day
  const getFacultyScheduleByDay = (facultyId: string, day: string) => {
    return schedule.filter(entry => 
      entry.facultyId === facultyId && 
      entry.day === day
    ).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  
  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Add new schedule entry
  const handleAddSchedule = () => {
    const faculty = mockFaculty.find(f => f.id === formData.facultyId)
    const course = mockCourses.find(c => c.id === formData.courseId)
    
    if (!faculty || !course) return
    
    // Validate that end time is after start time
    const [startHour, startMinute] = formData.startTime.split(':').map(Number)
    const [endHour, endMinute] = formData.endTime.split(':').map(Number)
    const startTimeMinutes = startHour * 60 + startMinute
    const endTimeMinutes = endHour * 60 + endMinute
    
    if (endTimeMinutes <= startTimeMinutes) {
      alert("End time must be after start time")
      return
    }
    
    const newSchedule: ScheduleEntry = {
      id: `SCH${1000 + schedule.length + 1}`,
      facultyId: faculty.id,
      facultyName: faculty.name,
      day: formData.day as any,
      startTime: formData.startTime,
      endTime: formData.endTime,
      courseId: course.id,
      courseName: course.name,
      batchName: formData.batchName,
      section: formData.section,
      roomNumber: formData.roomNumber,
      type: formData.type as any
    }
    
    setSchedule([...schedule, newSchedule])
    setShowAddDialog(false)
  }
  
  // Delete schedule entry
  const deleteScheduleEntry = (id: string) => {
    const updatedSchedule = schedule.filter(entry => entry.id !== id)
    setSchedule(updatedSchedule)
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Faculty Schedule Management</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Schedule Entry</DialogTitle>
                <DialogDescription>
                  Create a new class schedule entry for faculty
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Select 
                    value={formData.facultyId}
                    onValueChange={(value) => handleFormChange("facultyId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFaculty.map(faculty => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name} ({faculty.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select 
                    value={formData.courseId}
                    onValueChange={(value) => handleFormChange("courseId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day</Label>
                    <Select 
                      value={formData.day}
                      onValueChange={(value) => handleFormChange("day", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Class Type</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => handleFormChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleFormChange("startTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleFormChange("endTime", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Select 
                      value={formData.batchName}
                      onValueChange={(value) => handleFormChange("batchName", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map(batch => (
                          <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select 
                      value={formData.section}
                      onValueChange={(value) => handleFormChange("section", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map(section => (
                          <SelectItem key={section} value={section}>Section {section}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => handleFormChange("roomNumber", e.target.value)}
                    placeholder="e.g., 101"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSchedule}
                  disabled={!formData.facultyId || !formData.courseId || !formData.roomNumber}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Add Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Faculty Schedule
                </CardTitle>
                <CardDescription>
                  Manage teaching schedule for all faculty members
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schedules..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                  {showFilters ? "Hide Filters" : "Filters"}
                </Button>
                
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                    <SelectTrigger id="faculty">
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Faculty</SelectItem>
                      {mockFaculty.map(faculty => (
                        <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="day">Day</Label>
                  <Select value={dayFilter} onValueChange={setDayFilter}>
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground text-xs"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {facultyFilter !== "all" ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  {mockFaculty.find(f => f.id === facultyFilter)?.name}'s Schedule
                </h2>
                
                <Tabs defaultValue="Monday">
                  <TabsList className="grid grid-cols-6">
                    {days.map(day => (
                      <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {days.map(day => (
                    <TabsContent key={day} value={day}>
                      <Card>
                        <CardContent className="pt-6">
                          {getFacultyScheduleByDay(facultyFilter, day).length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                              No classes scheduled for {day}
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {getFacultyScheduleByDay(facultyFilter, day).map(entry => (
                                <div key={entry.id} className="flex items-center p-3 border rounded-md">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        {entry.startTime} - {entry.endTime}
                                      </span>
                                      <Badge className="ml-2">{entry.type}</Badge>
                                    </div>
                                    <h3 className="font-semibold mt-1">{entry.courseName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {entry.batchName} | Section {entry.section} | Room {entry.roomNumber}
                                    </p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => deleteScheduleEntry(entry.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="hidden md:table-cell">Course</TableHead>
                      <TableHead className="hidden md:table-cell">Batch & Section</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedule.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                          No schedule entries found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSchedule.slice(0, 20).map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.facultyName}</TableCell>
                          <TableCell>{entry.day}</TableCell>
                          <TableCell>
                            <span className="whitespace-nowrap">{entry.startTime} - {entry.endTime}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{entry.courseName}</TableCell>
                          <TableCell className="hidden md:table-cell">{entry.batchName} | Section {entry.section}</TableCell>
                          <TableCell>{entry.roomNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              entry.type === "Lecture" ? "bg-blue-100 text-blue-800" :
                              entry.type === "Lab" ? "bg-green-100 text-green-800" :
                              "bg-amber-100 text-amber-800"
                            }>
                              {entry.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteScheduleEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredSchedule.length > 0 ? 1 : 0} to {Math.min(20, filteredSchedule.length)} of {filteredSchedule.length} schedule entries
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={true}>Previous</Button>
                <Button variant="outline" size="sm" disabled={filteredSchedule.length <= 20}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 