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
  Building
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

// Student data interface
interface Student {
  id: string
  enrollmentNo: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  section: string
  batch: string
  department: string
  academicDetails: {
    currentSemester: number
    cgpa: number
    attendance: number
  }
  status: "active" | "inactive" | "alumni"
}

// Mock departments data
const departments = [
  "Computer Science", 
  "Electrical Engineering", 
  "Mechanical Engineering", 
  "Civil Engineering", 
  "Electronics & Communication"
]

// Mock batches data
const batches = ["2020-24", "2021-25", "2022-26", "2023-27"]

// Mock sections data
const sections = ["1", "2", "3", "4", "5", "6", "7"]

// Mock student data
const mockStudents: Student[] = Array.from({ length: 50 }).map((_, index) => {
  const id = `STU${1000 + index}`
  const batchIndex = Math.floor(Math.random() * batches.length)
  const departmentIndex = Math.floor(Math.random() * departments.length)
  const sectionIndex = Math.floor(Math.random() * sections.length)
  const randomNames = [
    "Virat", "Rohit", "Hardik", "Rishabh", "Suryakumar", "Ravindra", 
    "Jasprit", "Shreyas", "Shubman", "Arshdeep", "Yuzvendra", "Mohammed"
  ]
  const randomSurnames = [
    "Sharma", "Kohli", "Pandya", "Pant", "Yadav", "Jadeja", "Bumrah", 
    "Iyer", "Gill", "Singh", "Chahal", "Shami", "Rahul", "Agarwal"
  ]
  
  const name = `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${randomSurnames[Math.floor(Math.random() * randomSurnames.length)]}`
  const randomCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"]
  const randomStates = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "West Bengal", "Telangana", "Gujarat"]
  
  const currentSemester = Math.floor(Math.random() * 8) + 1
  const cgpa = (6 + Math.random() * 4).toFixed(2)
  const attendance = Math.floor(70 + Math.random() * 30)
  
  const statusOptions: ("active" | "inactive" | "alumni")[] = ["active", "inactive", "alumni"]
  const status = statusOptions[Math.floor(Math.random() * (currentSemester > 7 ? 3 : 2))]

  return {
    id,
    enrollmentNo: `EN${2020 + batchIndex}${100 + index}`,
    name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@student.edu`,
    phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
    address: {
      street: `${Math.floor(1 + Math.random() * 999)}, ${Math.random() > 0.5 ? 'Main' : 'Park'} Street`,
      city: randomCities[Math.floor(Math.random() * randomCities.length)],
      state: randomStates[Math.floor(Math.random() * randomStates.length)],
      pincode: `${Math.floor(100000 + Math.random() * 899999)}`
    },
    section: sections[sectionIndex],
    batch: batches[batchIndex],
    department: departments[departmentIndex],
    academicDetails: {
      currentSemester,
      cgpa: parseFloat(cgpa),
      attendance
    },
    status
  }
})

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [batchFilter, setBatchFilter] = useState<string>("all")
  const [sectionFilter, setSectionFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter
    const matchesBatch = batchFilter === "all" || student.batch === batchFilter
    const matchesSection = sectionFilter === "all" || student.section === sectionFilter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    
    return matchesSearch && matchesDepartment && matchesBatch && matchesSection && matchesStatus
  })
  
  const resetFilters = () => {
    setDepartmentFilter("all")
    setBatchFilter("all")
    setSectionFilter("all")
    setStatusFilter("all")
  }
  
  // Status badge component
  const StatusBadge = ({ status }: { status: "active" | "inactive" | "alumni" }) => {
    const badgeClasses = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      alumni: "bg-blue-100 text-blue-800 hover:bg-blue-100"
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
          <h1 className="text-3xl font-bold">Student Management</h1>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Student
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col">
                <CardTitle>All Students</CardTitle>
                <CardDescription>
                  Manage all students and their details
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
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
                  <Label htmlFor="batch">Batch</Label>
                  <Select value={batchFilter} onValueChange={setBatchFilter}>
                    <SelectTrigger id="batch">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      {batches.map(batch => (
                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="section">Section</Label>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {sections.map(section => (
                        <SelectItem key={section} value={section}>Section {section}</SelectItem>
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
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
                    <TableHead>ID/Enrollment</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Batch / Section</TableHead>
                    <TableHead className="hidden lg:table-cell">Academic Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                        No students found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.slice(0, 10).map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div>{student.id}</div>
                          <div className="text-xs text-muted-foreground">{student.enrollmentNo}</div>
                        </TableCell>
                        <TableCell>
                          <div>{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{student.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.batch} / Section {student.section}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div>Semester: {student.academicDetails.currentSemester}</div>
                          <div>CGPA: {student.academicDetails.cgpa}</div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={student.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Student Details</DialogTitle>
                                <DialogDescription>
                                  Comprehensive information about {student.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedStudent && (
                                <div className="mt-4">
                                  <Tabs defaultValue="personal">
                                    <TabsList className="grid grid-cols-4 mb-4">
                                      <TabsTrigger value="personal">Personal</TabsTrigger>
                                      <TabsTrigger value="academic">Academic</TabsTrigger>
                                      <TabsTrigger value="contact">Contact</TabsTrigger>
                                      <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="personal" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            Student Name
                                          </h3>
                                          <p>{selectedStudent.name}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            Email Address
                                          </h3>
                                          <p>{selectedStudent.email}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Phone Number
                                          </h3>
                                          <p>{selectedStudent.phone}</p>
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
                                          <p>{selectedStudent.department}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            Current Semester
                                          </h3>
                                          <p>Semester {selectedStudent.academicDetails.currentSemester}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            CGPA
                                          </h3>
                                          <p>{selectedStudent.academicDetails.cgpa}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            Attendance
                                          </h3>
                                          <p>{selectedStudent.academicDetails.attendance}%</p>
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
                                          <p>{selectedStudent.address.street}</p>
                                          <p>{selectedStudent.address.city}, {selectedStudent.address.state}</p>
                                          <p>PIN: {selectedStudent.address.pincode}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Phone Number
                                          </h3>
                                          <p>{selectedStudent.phone}</p>
                                        </div>
                                      </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="enrollment" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            Student ID
                                          </h3>
                                          <p>{selectedStudent.id}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            Enrollment Number
                                          </h3>
                                          <p>{selectedStudent.enrollmentNo}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            Batch
                                          </h3>
                                          <p>{selectedStudent.batch}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            Section
                                          </h3>
                                          <p>Section {selectedStudent.section}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            Status
                                          </h3>
                                          <StatusBadge status={selectedStudent.status} />
                                        </div>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              )}
                              
                              <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline">Edit Student</Button>
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
                Showing {filteredStudents.length > 0 ? 1 : 0} to {Math.min(10, filteredStudents.length)} of {filteredStudents.length} students
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={true}>Previous</Button>
                <Button variant="outline" size="sm" disabled={filteredStudents.length <= 10}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 