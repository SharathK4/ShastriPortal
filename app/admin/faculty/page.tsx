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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Eye, 
  Download, 
  Search, 
  FileEdit, 
  Filter, 
  UserPlus, 
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Users,
  Building,
  BookText,
  Calendar,
  Award
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Faculty data interface
interface Faculty {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  department: string
  designation: string
  specialization: string
  qualifications: string[]
  joinDate: string
  assignedBatches: {
    batchId: string
    batchName: string
    section: string
  }[]
  assignedCourses: {
    courseId: string
    courseName: string
    semester: number
  }[]
  status: "active" | "on leave" | "sabbatical" | "retired"
}

// Mock departments data
const departments = [
  "Computer Science", 
  "Electrical Engineering", 
  "Mechanical Engineering", 
  "Civil Engineering", 
  "Electronics & Communication"
]

// Mock designations data
const designations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Visiting Faculty",
  "Professor Emeritus",
  "Department Head"
]

// Mock batches data
const batches = ["CS 2020-24", "CS 2021-25", "CS 2022-26", "CS 2023-27", "EE 2020-24", "EE 2021-25"]

// Mock sections data
const sections = ["1", "2", "3", "4", "5", "6", "7"]

// Mock faculty data
const mockFaculty: Faculty[] = Array.from({ length: 30 }).map((_, index) => {
  const id = `FAC${1000 + index}`
  const departmentIndex = Math.floor(Math.random() * departments.length)
  const designationIndex = Math.floor(Math.random() * designations.length)
  
  const randomFirstNames = [
    "Anil", "Rajesh", "Suresh", "Mahesh", "Ramesh", "Harish", 
    "Prakash", "Dinesh", "Satish", "Ravi", "Ajay", "Vijay"
  ]
  const randomLastNames = [
    "Sharma", "Gupta", "Patel", "Singh", "Kumar", "Verma", 
    "Mishra", "Joshi", "Yadav", "Reddy", "Agarwal", "Iyer"
  ]
  
  const name = `Dr. ${randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)]} ${randomLastNames[Math.floor(Math.random() * randomLastNames.length)]}`
  const randomCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"]
  const randomStates = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "West Bengal", "Telangana", "Gujarat"]
  
  const specializations = [
    "Artificial Intelligence", "Machine Learning", "Database Systems", "Computer Networks",
    "Power Systems", "Electronics", "Structural Engineering", "Thermal Engineering",
    "Communication Systems", "VLSI Design", "Software Engineering", "Cybersecurity"
  ]
  
  const qualifications = [
    "Ph.D.", "M.Tech.", "M.E.", "M.S.", "MBA", "B.Tech."
  ]
  
  const randomQualifications = Array.from(
    { length: Math.floor(Math.random() * 2) + 1 }, 
    () => qualifications[Math.floor(Math.random() * qualifications.length)]
  )
  randomQualifications.unshift("Ph.D.") // All faculty have Ph.D.
  
  // Generate a random join date between 2005 and 2022
  const joinYear = 2005 + Math.floor(Math.random() * 18)
  const joinMonth = Math.floor(Math.random() * 12) + 1
  const joinDay = Math.floor(Math.random() * 28) + 1
  const joinDate = `${joinYear}-${joinMonth.toString().padStart(2, '0')}-${joinDay.toString().padStart(2, '0')}`
  
  // Generate random assigned batches (1-3)
  const numBatches = Math.floor(Math.random() * 3) + 1
  const assignedBatches = Array.from({ length: numBatches }, () => {
    const batchIndex = Math.floor(Math.random() * batches.length)
    const sectionIndex = Math.floor(Math.random() * sections.length)
    return {
      batchId: `BATCH${1000 + batchIndex}`,
      batchName: batches[batchIndex],
      section: sections[sectionIndex]
    }
  })
  
  // Generate random assigned courses (1-4)
  const numCourses = Math.floor(Math.random() * 4) + 1
  const assignedCourses = Array.from({ length: numCourses }, () => {
    const courseNames = [
      "Data Structures", "Algorithms", "Database Management", "Computer Networks",
      "Operating Systems", "Software Engineering", "Machine Learning", "Artificial Intelligence",
      "Digital Electronics", "Power Systems", "Control Systems", "Structural Analysis"
    ]
    
    return {
      courseId: `CRS${1000 + Math.floor(Math.random() * 100)}`,
      courseName: courseNames[Math.floor(Math.random() * courseNames.length)],
      semester: Math.floor(Math.random() * 8) + 1
    }
  })
  
  const statusOptions: ("active" | "on leave" | "sabbatical" | "retired")[] = ["active", "on leave", "sabbatical", "retired"]
  const statusWeights = [0.8, 0.1, 0.05, 0.05] // 80% active, 10% on leave, 5% sabbatical, 5% retired
  const statusRandom = Math.random()
  let statusIndex = 0
  let weightSum = 0
  
  for (let i = 0; i < statusWeights.length; i++) {
    weightSum += statusWeights[i]
    if (statusRandom <= weightSum) {
      statusIndex = i
      break
    }
  }
  
  const status = statusOptions[statusIndex]

  return {
    id,
    employeeId: `EMP${2000 + index}`,
    name,
    email: `${name.toLowerCase().replace(/dr\.\s/g, '').replace(/\s/g, '.')}@faculty.edu`,
    phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
    address: {
      street: `${Math.floor(1 + Math.random() * 999)}, ${Math.random() > 0.5 ? 'Main' : 'Park'} Street`,
      city: randomCities[Math.floor(Math.random() * randomCities.length)],
      state: randomStates[Math.floor(Math.random() * randomStates.length)],
      pincode: `${Math.floor(100000 + Math.random() * 899999)}`
    },
    department: departments[departmentIndex],
    designation: designations[designationIndex],
    specialization: specializations[Math.floor(Math.random() * specializations.length)],
    qualifications: randomQualifications,
    joinDate,
    assignedBatches,
    assignedCourses,
    status
  }
})

export default function FacultyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [designationFilter, setDesignationFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter faculty based on search and filters
  const filteredFaculty = mockFaculty.filter(faculty => {
    const matchesSearch = 
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === "all" || faculty.department === departmentFilter
    const matchesDesignation = designationFilter === "all" || faculty.designation === designationFilter
    const matchesStatus = statusFilter === "all" || faculty.status === statusFilter
    
    return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus
  })
  
  const resetFilters = () => {
    setDepartmentFilter("all")
    setDesignationFilter("all")
    setStatusFilter("all")
  }
  
  // Status badge component
  const StatusBadge = ({ status }: { status: "active" | "on leave" | "sabbatical" | "retired" }) => {
    const badgeClasses = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      "on leave": "bg-amber-100 text-amber-800 hover:bg-amber-100",
      sabbatical: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      retired: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
    
    return (
      <Badge className={badgeClasses[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Faculty Management</h1>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Faculty
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col">
                <CardTitle>All Faculty</CardTitle>
                <CardDescription>
                  Manage faculty members and their details
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty..."
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger id="department">
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
                  <Label htmlFor="designation">Designation</Label>
                  <Select value={designationFilter} onValueChange={setDesignationFilter}>
                    <SelectTrigger id="designation">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      {designations.map(designation => (
                        <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on leave">On Leave</SelectItem>
                      <SelectItem value="sabbatical">Sabbatical</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
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
                    <TableHead>ID/Employee</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Designation</TableHead>
                    <TableHead className="hidden lg:table-cell">Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaculty.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                        No faculty found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFaculty.slice(0, 10).map(faculty => (
                      <TableRow key={faculty.id}>
                        <TableCell className="font-medium">
                          <div>{faculty.id}</div>
                          <div className="text-xs text-muted-foreground">{faculty.employeeId}</div>
                        </TableCell>
                        <TableCell>
                          <div>{faculty.name}</div>
                          <div className="text-xs text-muted-foreground">{faculty.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{faculty.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{faculty.designation}</TableCell>
                        <TableCell className="hidden lg:table-cell">{faculty.specialization}</TableCell>
                        <TableCell>
                          <StatusBadge status={faculty.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedFaculty(faculty)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Faculty Details</DialogTitle>
                                <DialogDescription>
                                  Comprehensive information about {faculty.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedFaculty && (
                                <div className="mt-4">
                                  <Tabs defaultValue="personal">
                                    <TabsList className="grid grid-cols-5 mb-4">
                                      <TabsTrigger value="personal">Personal</TabsTrigger>
                                      <TabsTrigger value="academic">Academic</TabsTrigger>
                                      <TabsTrigger value="contact">Contact</TabsTrigger>
                                      <TabsTrigger value="courses">Courses</TabsTrigger>
                                      <TabsTrigger value="batches">Batches</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="personal" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Award className="h-4 w-4 text-muted-foreground" />
                                            Faculty Name
                                          </h3>
                                          <p>{selectedFaculty.name}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            Email Address
                                          </h3>
                                          <p>{selectedFaculty.email}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Phone Number
                                          </h3>
                                          <p>{selectedFaculty.phone}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            Join Date
                                          </h3>
                                          <p>{new Date(selectedFaculty.joinDate).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="academic" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            Department
                                          </h3>
                                          <p>{selectedFaculty.department}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Award className="h-4 w-4 text-muted-foreground" />
                                            Designation
                                          </h3>
                                          <p>{selectedFaculty.designation}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <BookText className="h-4 w-4 text-muted-foreground" />
                                            Specialization
                                          </h3>
                                          <p>{selectedFaculty.specialization}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            Qualifications
                                          </h3>
                                          <p>{selectedFaculty.qualifications.join(", ")}</p>
                                        </div>
                                      </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="contact" className="space-y-4">
                                      <div className="grid grid-cols-1 gap-4">
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            Address
                                          </h3>
                                          <p>{selectedFaculty.address.street}</p>
                                          <p>{selectedFaculty.address.city}, {selectedFaculty.address.state}</p>
                                          <p>PIN: {selectedFaculty.address.pincode}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Phone Number
                                          </h3>
                                          <p>{selectedFaculty.phone}</p>
                                        </div>
                                      </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="courses" className="space-y-4">
                                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        Assigned Courses
                                      </h3>
                                      
                                      {selectedFaculty.assignedCourses.length === 0 ? (
                                        <p className="text-muted-foreground">No courses assigned</p>
                                      ) : (
                                        <div className="rounded-md border">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Course ID</TableHead>
                                                <TableHead>Course Name</TableHead>
                                                <TableHead>Semester</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {selectedFaculty.assignedCourses.map((course, index) => (
                                                <TableRow key={index}>
                                                  <TableCell>{course.courseId}</TableCell>
                                                  <TableCell>{course.courseName}</TableCell>
                                                  <TableCell>Semester {course.semester}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      )}
                                    </TabsContent>
                                    
                                    <TabsContent value="batches" className="space-y-4">
                                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Assigned Batches
                                      </h3>
                                      
                                      {selectedFaculty.assignedBatches.length === 0 ? (
                                        <p className="text-muted-foreground">No batches assigned</p>
                                      ) : (
                                        <div className="rounded-md border">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Batch ID</TableHead>
                                                <TableHead>Batch Name</TableHead>
                                                <TableHead>Section</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {selectedFaculty.assignedBatches.map((batch, index) => (
                                                <TableRow key={index}>
                                                  <TableCell>{batch.batchId}</TableCell>
                                                  <TableCell>{batch.batchName}</TableCell>
                                                  <TableCell>Section {batch.section}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      )}
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              )}
                              
                              <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline">Edit Faculty</Button>
                                <Button variant="default">Download Data</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredFaculty.length > 0 ? 1 : 0} to {Math.min(10, filteredFaculty.length)} of {filteredFaculty.length} faculty members
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={true}>Previous</Button>
                <Button variant="outline" size="sm" disabled={filteredFaculty.length <= 10}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 