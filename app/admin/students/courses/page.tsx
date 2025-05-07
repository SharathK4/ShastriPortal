"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Save,
  Clock,
  Filter,
  X,
  BookOpen
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ConnectorService from "@/lib/services/connector-service"

// Course interface
interface Course {
  id: string
  code: string
  name: string
  description: string
  creditHours: number
  department: string
  semester: number
  isActive: boolean
  facultyId?: string
  facultyName?: string
  enrolledStudents: number
  batchIds?: string[]
  batchNames?: string[]
}

// Mock departments data
const departments = [
  "Computer Science", 
  "Electrical Engineering", 
  "Mechanical Engineering", 
  "Civil Engineering", 
  "Electronics & Communication"
]

// Mock course data
const mockCourses: Course[] = [
  {
    id: "CRS1001",
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamental concepts of computer science including basic algorithms, data structures, and problem-solving techniques.",
    creditHours: 4,
    department: "Computer Science",
    semester: 1,
    isActive: true,
    facultyId: "FAC1001",
    facultyName: "Dr. Sharma",
    enrolledStudents: 120,
    batchIds: ["BATCH001"],
    batchNames: ["CS 2020-24 (2020-2024)"]
  },
  {
    id: "CRS1002",
    code: "CS201",
    name: "Data Structures",
    description: "Study of various data structures and their applications in algorithm design.",
    creditHours: 4,
    department: "Computer Science",
    semester: 2,
    isActive: true,
    facultyId: "FAC1002",
    facultyName: "Dr. Patel",
    enrolledStudents: 110,
    batchIds: ["BATCH002"],
    batchNames: ["CS 2021-25 (2021-2025)"]
  },
  {
    id: "CRS1003",
    code: "CS301",
    name: "Algorithms",
    description: "Design and analysis of algorithms with emphasis on efficiency and complexity.",
    creditHours: 3,
    department: "Computer Science",
    semester: 3,
    isActive: true,
    facultyId: "FAC1003",
    facultyName: "Dr. Gupta",
    enrolledStudents: 95,
    batchIds: ["BATCH003"],
    batchNames: ["CS 2022-26 (2022-2026)"]
  },
  {
    id: "CRS1004",
    code: "EE101",
    name: "Basic Electrical Engineering",
    description: "Introduction to electrical circuits, components, and basic electrical theory.",
    creditHours: 4,
    department: "Electrical Engineering",
    semester: 1,
    isActive: true,
    facultyId: "FAC1004",
    facultyName: "Dr. Kumar",
    enrolledStudents: 115,
    batchIds: ["BATCH005"],
    batchNames: ["EE 2020-24 (2020-2024)"]
  },
  {
    id: "CRS1005",
    code: "EE201",
    name: "Analog Electronics",
    description: "Study of analog electronic circuits and devices.",
    creditHours: 3,
    department: "Electrical Engineering",
    semester: 2,
    isActive: true,
    facultyId: "FAC1005",
    facultyName: "Dr. Singh",
    enrolledStudents: 105,
    batchIds: ["BATCH006"],
    batchNames: ["EE 2021-25 (2021-2025)"]
  },
  {
    id: "CRS1006",
    code: "ME101",
    name: "Engineering Mechanics",
    description: "Study of forces and their effects on rigid bodies at rest and in motion.",
    creditHours: 4,
    department: "Mechanical Engineering",
    semester: 1,
    isActive: true,
    facultyId: "FAC1006",
    facultyName: "Dr. Reddy",
    enrolledStudents: 130,
    batchIds: ["BATCH003", "BATCH004"],
    batchNames: ["CS 2022-26 (2022-2026)", "CS 2023-27 (2023-2027)"]
  },
  {
    id: "CRS1007",
    code: "CE101",
    name: "Engineering Drawing",
    description: "Principles of technical drawing and standards for engineering applications.",
    creditHours: 3,
    department: "Civil Engineering",
    semester: 1,
    isActive: true,
    facultyId: "FAC1007",
    facultyName: "Dr. Mishra",
    enrolledStudents: 125,
    batchIds: ["BATCH001", "BATCH002"],
    batchNames: ["CS 2020-24 (2020-2024)", "CS 2021-25 (2021-2025)"]
  },
  {
    id: "CRS1008",
    code: "EC101",
    name: "Digital Electronics",
    description: "Study of digital circuits, Boolean algebra, and digital systems.",
    creditHours: 4,
    department: "Electronics & Communication",
    semester: 1,
    isActive: true,
    facultyId: "FAC1008",
    facultyName: "Dr. Joshi",
    enrolledStudents: 110,
    batchIds: ["BATCH005", "BATCH006"],
    batchNames: ["EE 2020-24 (2020-2024)", "EE 2021-25 (2021-2025)"]
  },
  {
    id: "CRS1009",
    code: "CS401",
    name: "Database Management Systems",
    description: "Concepts, principles, and techniques of database management systems.",
    creditHours: 4,
    department: "Computer Science",
    semester: 4,
    isActive: false,
    facultyId: "FAC1009",
    facultyName: "Dr. Verma",
    enrolledStudents: 0,
    batchIds: [],
    batchNames: []
  },
  {
    id: "CRS1010",
    code: "EE301",
    name: "Power Systems",
    description: "Study of electric power generation, transmission, and distribution.",
    creditHours: 4,
    department: "Electrical Engineering",
    semester: 3,
    isActive: false,
    enrolledStudents: 0,
    batchIds: [],
    batchNames: []
  }
]

// Empty course form for new courses
const emptyCourse: Omit<Course, "id" | "enrolledStudents"> = {
  code: "",
  name: "",
  description: "",
  creditHours: 3,
  department: "Computer Science",
  semester: 1,
  isActive: true,
  facultyId: "",
  facultyName: "",
  batchIds: [],
  batchNames: []
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [semesterFilter, setSemesterFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [formData, setFormData] = useState<Omit<Course, "id" | "enrolledStudents">>(emptyCourse)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [availableBatches, setAvailableBatches] = useState<Array<{id: string, name: string}>>([])
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  
  // Load batches from ConnectorService
  useEffect(() => {
    // Initialize data if needed
    ConnectorService.initializeIfEmpty();
    
    // Get batches from connector
    const batches = ConnectorService.batches.getAll();
    setAvailableBatches(batches.map(batch => ({
      id: batch.id,
      name: `${batch.name} (${batch.startYear}-${batch.endYear})`
    })));
    
    // Listen for batch changes
    const unsubscribe = ConnectorService.addChangeListener((dataType, data) => {
      if (dataType === 'batches') {
        setAvailableBatches(data.map((batch: any) => ({
          id: batch.id,
          name: `${batch.name} (${batch.startYear}-${batch.endYear})`
        })));
      }
    });
    
    // Clean up listener
    return () => unsubscribe();
  }, []);
  
  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === "all" || course.department === departmentFilter
    const matchesSemester = semesterFilter === "all" || course.semester.toString() === semesterFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && course.isActive) ||
      (statusFilter === "inactive" && !course.isActive)
    
    return matchesSearch && matchesDepartment && matchesSemester && matchesStatus
  })
  
  // Reset filters
  const resetFilters = () => {
    setDepartmentFilter("all")
    setSemesterFilter("all")
    setStatusFilter("all")
  }
  
  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Handle batch selection
  const handleBatchSelection = (batchId: string, batchName: string) => {
    const isBatchSelected = selectedBatches.includes(batchId);
    
    if (isBatchSelected) {
      // Remove batch
      const updatedBatchIds = formData.batchIds?.filter(id => id !== batchId) || [];
      const updatedBatchNames = formData.batchNames?.filter(name => name !== batchName) || [];
      
      setSelectedBatches(updatedBatchIds);
      handleFormChange("batchIds", updatedBatchIds);
      handleFormChange("batchNames", updatedBatchNames);
    } else {
      // Add batch
      const updatedBatchIds = [...(formData.batchIds || []), batchId];
      const updatedBatchNames = [...(formData.batchNames || []), batchName];
      
      setSelectedBatches(updatedBatchIds);
      handleFormChange("batchIds", updatedBatchIds);
      handleFormChange("batchNames", updatedBatchNames);
    }
  }
  
  // Add new course
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `CRS${1000 + courses.length + 1}`,
      ...formData,
      enrolledStudents: 0
    }
    
    setCourses([...courses, newCourse])
    setFormData(emptyCourse)
    setShowAddDialog(false)
  }
  
  // Start editing a course
  const startEditCourse = (course: Course) => {
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description,
      creditHours: course.creditHours,
      department: course.department,
      semester: course.semester,
      isActive: course.isActive,
      facultyId: course.facultyId || "",
      facultyName: course.facultyName || "",
      batchIds: course.batchIds || [],
      batchNames: course.batchNames || []
    })
    setSelectedBatches(course.batchIds || []);
    setIsEditMode(true)
    setEditingCourseId(course.id)
    setShowAddDialog(true)
  }
  
  // Save edited course
  const handleEditCourse = () => {
    if (!editingCourseId) return
    
    const updatedCourses = courses.map(course => 
      course.id === editingCourseId 
        ? { ...course, ...formData } 
        : course
    )
    
    setCourses(updatedCourses)
    setFormData(emptyCourse)
    setIsEditMode(false)
    setEditingCourseId(null)
    setShowAddDialog(false)
  }
  
  // Delete course
  const deleteCourse = () => {
    if (!deleteTarget) return
    
    const updatedCourses = courses.filter(course => course.id !== deleteTarget)
    setCourses(updatedCourses)
    setDeleteTarget(null)
    setShowDeleteConfirm(false)
  }
  
  // Toggle course active status
  const toggleCourseStatus = (courseId: string) => {
    const updatedCourses = courses.map(course => 
      course.id === courseId 
        ? { ...course, isActive: !course.isActive } 
        : course
    )
    
    setCourses(updatedCourses)
  }
  
  // Generate semester options (1-8)
  const semesterOptions = Array.from({ length: 8 }, (_, i) => (i + 1).toString())
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Course Management</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Course" : "Add New Course"}</DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Update the course details and save changes" 
                    : "Fill in the details to create a new course"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleFormChange("code", e.target.value)}
                      placeholder="e.g., CS101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditHours">Credit Hours</Label>
                    <Select 
                      value={formData.creditHours.toString()}
                      onValueChange={(value) => handleFormChange("creditHours", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter course name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter course description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department}
                    onValueChange={(value) => handleFormChange("department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Course Placement Section - Semester and Batch Selection */}
                <div className="border p-4 rounded-md space-y-4 mt-2">
                  <h3 className="font-medium text-sm">Course Placement</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="font-medium">Which Semester</Label>
                    <Select 
                      value={formData.semester.toString()}
                      onValueChange={(value) => handleFormChange("semester", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesterOptions.map(semester => (
                          <SelectItem key={semester} value={semester}>Semester {semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Select which semester this course belongs to</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batches" className="font-medium">Which Admission Batches</Label>
                    <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[42px]">
                      {selectedBatches.length > 0 ? (
                        formData.batchNames?.map((batchName, index) => (
                          <Badge key={formData.batchIds?.[index]} variant="secondary" className="gap-1">
                            {batchName}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleBatchSelection(formData.batchIds?.[index] || "", batchName)}
                            />
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No batch years selected</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Select which student admission years this course is for</p>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-1">
                            Add Admission Batch
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[250px]">
                          {availableBatches.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              No batches available
                            </div>
                          ) : (
                            availableBatches.map(batch => (
                              <DropdownMenuItem
                                key={batch.id}
                                onClick={() => handleBatchSelection(batch.id, batch.name)}
                                className="flex items-center gap-2"
                              >
                                {selectedBatches.includes(batch.id) ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="w-4" />
                                )}
                                {batch.name}
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultyName">Faculty Name</Label>
                    <Input
                      id="facultyName"
                      value={formData.facultyName || ""}
                      onChange={(e) => handleFormChange("facultyName", e.target.value)}
                      placeholder="Enter faculty name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.isActive ? "active" : "inactive"}
                      onValueChange={(value) => handleFormChange("isActive", value === "active")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFormData(emptyCourse)
                    setIsEditMode(false)
                    setEditingCourseId(null)
                    setShowAddDialog(false)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isEditMode ? handleEditCourse : handleAddCourse}
                  disabled={!formData.code || !formData.name}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isEditMode ? "Save Changes" : "Add Course"}
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
                  <BookOpen className="h-5 w-5" />
                  All Courses
                </CardTitle>
                <CardDescription>
                  Manage courses across different departments and semesters
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
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
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label htmlFor="department-filter">Department</Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger id="department-filter">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="semester-filter">Semester</Label>
                  <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                    <SelectTrigger id="semester-filter">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {semesterOptions.map(semester => (
                        <SelectItem key={semester} value={semester}>Semester {semester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Semester</TableHead>
                    <TableHead className="hidden lg:table-cell">Credit Hours</TableHead>
                    <TableHead className="hidden lg:table-cell">Admission Batches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                        No courses found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map(course => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.code}</TableCell>
                        <TableCell>
                          <div>{course.name}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">{course.description.substring(0, 50)}...</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{course.department}</TableCell>
                        <TableCell className="hidden md:table-cell">Semester {course.semester}</TableCell>
                        <TableCell className="hidden lg:table-cell">{course.creditHours}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {course.batchNames && course.batchNames.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {course.batchNames.map((name, index) => (
                                <Badge key={index} variant="outline">{name}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">No admission batches assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={course.isActive 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                          >
                            {course.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => startEditCourse(course)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleCourseStatus(course.id)}>
                                {course.isActive ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setDeleteTarget(course.id)
                                  setShowDeleteConfirm(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCourse} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 