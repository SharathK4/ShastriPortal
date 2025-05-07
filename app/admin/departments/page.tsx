"use client"

import { useState } from "react"
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
  Save,
  Building,
  Users,
  BookOpen,
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

// Department interface
interface Department {
  id: string
  code: string
  name: string
  description: string
  headName: string
  headId: string
  establishedYear: number
  facultyCount: number
  studentCount: number
  courses: number
  batches: number
}

// Faculty interface for assignment
interface FacultyMember {
  id: string
  name: string
  designation: string
  specialization: string
  department: string
}

// Mock department data
const mockDepartments: Department[] = [
  {
    id: "DEPT001",
    code: "CSE",
    name: "Computer Science Engineering",
    description: "Department of Computer Science and Engineering focuses on the study of algorithms, programming languages, and computing systems.",
    headName: "Dr. Rajesh Sharma",
    headId: "FAC1001",
    establishedYear: 1995,
    facultyCount: 25,
    studentCount: 450,
    courses: 35,
    batches: 4
  },
  {
    id: "DEPT002",
    code: "EEE",
    name: "Electrical Engineering",
    description: "Department of Electrical Engineering covers the study of electricity, electronics, and electromagnetism for power systems and more.",
    headName: "Dr. Suresh Patel",
    headId: "FAC1004",
    establishedYear: 1990,
    facultyCount: 20,
    studentCount: 380,
    courses: 30,
    batches: 4
  },
  {
    id: "DEPT003",
    code: "ME",
    name: "Mechanical Engineering",
    description: "Department of Mechanical Engineering focuses on design, production, and operation of machinery and tools.",
    headName: "Dr. Ramesh Reddy",
    headId: "FAC1006",
    establishedYear: 1985,
    facultyCount: 22,
    studentCount: 420,
    courses: 32,
    batches: 4
  },
  {
    id: "DEPT004",
    code: "CE",
    name: "Civil Engineering",
    description: "Department of Civil Engineering deals with design, construction, and maintenance of physical and naturally built environment.",
    headName: "Dr. Mahesh Mishra",
    headId: "FAC1007",
    establishedYear: 1985,
    facultyCount: 18,
    studentCount: 350,
    courses: 28,
    batches: 4
  },
  {
    id: "DEPT005",
    code: "ECE",
    name: "Electronics & Communication",
    description: "Department of Electronics and Communication Engineering focuses on electronic devices, circuits, communication equipment and systems.",
    headName: "Dr. Dinesh Joshi",
    headId: "FAC1008",
    establishedYear: 1992,
    facultyCount: 21,
    studentCount: 400,
    courses: 30,
    batches: 4
  }
]

// Mock faculty data
const mockFaculty: FacultyMember[] = Array.from({ length: 30 }).map((_, index) => {
  const id = `FAC${1000 + index}`
  const departments = ["Computer Science Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Electronics & Communication"]
  const departmentIndex = Math.floor(Math.random() * departments.length)
  
  const designations = [
    "Professor", "Associate Professor", "Assistant Professor", "Lecturer"
  ]
  
  const randomFirstNames = [
    "Anil", "Rajesh", "Suresh", "Mahesh", "Ramesh", "Harish", 
    "Prakash", "Dinesh", "Satish", "Ravi", "Ajay", "Vijay"
  ]
  const randomLastNames = [
    "Sharma", "Gupta", "Patel", "Singh", "Kumar", "Verma", 
    "Mishra", "Joshi", "Yadav", "Reddy", "Agarwal", "Iyer"
  ]
  
  const specializations = [
    "Artificial Intelligence", "Machine Learning", "Database Systems", "Computer Networks",
    "Power Systems", "Electronics", "Structural Engineering", "Thermal Engineering",
    "Communication Systems", "VLSI Design", "Software Engineering", "Cybersecurity"
  ]
  
  return {
    id,
    name: `Dr. ${randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)]} ${randomLastNames[Math.floor(Math.random() * randomLastNames.length)]}`,
    designation: designations[Math.floor(Math.random() * designations.length)],
    specialization: specializations[Math.floor(Math.random() * specializations.length)],
    department: departments[departmentIndex]
  }
})

// Empty department form for new departments
const emptyDepartment: Omit<Department, "id" | "facultyCount" | "studentCount" | "courses" | "batches"> = {
  code: "",
  name: "",
  description: "",
  headName: "",
  headId: "",
  establishedYear: new Date().getFullYear()
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState<Omit<Department, "id" | "facultyCount" | "studentCount" | "courses" | "batches">>(emptyDepartment)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showManageFacultyDialog, setShowManageFacultyDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  
  // Filter departments based on search
  const filteredDepartments = departments.filter(department => {
    return department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           department.headName.toLowerCase().includes(searchTerm.toLowerCase())
  })
  
  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Add new department
  const handleAddDepartment = () => {
    const newDepartment: Department = {
      id: `DEPT${(departments.length + 1).toString().padStart(3, '0')}`,
      ...formData,
      facultyCount: 0,
      studentCount: 0,
      courses: 0,
      batches: 0
    }
    
    setDepartments([...departments, newDepartment])
    setFormData(emptyDepartment)
    setShowAddDialog(false)
  }
  
  // Start editing a department
  const startEditDepartment = (department: Department) => {
    setFormData({
      code: department.code,
      name: department.name,
      description: department.description,
      headName: department.headName,
      headId: department.headId,
      establishedYear: department.establishedYear
    })
    setIsEditMode(true)
    setEditingDeptId(department.id)
    setShowAddDialog(true)
  }
  
  // Save edited department
  const handleEditDepartment = () => {
    if (!editingDeptId) return
    
    const updatedDepartments = departments.map(department => 
      department.id === editingDeptId 
        ? { ...department, ...formData } 
        : department
    )
    
    setDepartments(updatedDepartments)
    setFormData(emptyDepartment)
    setIsEditMode(false)
    setEditingDeptId(null)
    setShowAddDialog(false)
  }
  
  // Delete department
  const deleteDepartment = () => {
    if (!deleteTarget) return
    
    const updatedDepartments = departments.filter(department => department.id !== deleteTarget)
    setDepartments(updatedDepartments)
    setDeleteTarget(null)
    setShowDeleteConfirm(false)
  }
  
  // Open manage faculty dialog
  const openManageFaculty = (department: Department) => {
    console.log("Opening faculty management for department:", department.name);
    setSelectedDepartment(department)
    setShowManageFacultyDialog(true)
  }
  
  // Generate year options (from 1980 to current year)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => (1980 + i).toString())
  
  // Filter faculty by department
  const departmentFaculty = mockFaculty.filter(faculty => {
    const matches = selectedDepartment && (
      // Match department name to faculty's department, handling slightly different naming
      faculty.department === selectedDepartment.name ||
      (selectedDepartment.name === "Computer Science Engineering" && faculty.department === "Computer Science") ||
      (selectedDepartment.name === "Electronics & Communication" && faculty.department.includes("Electronics"))
    );
    
    if (selectedDepartment && faculty.department === selectedDepartment.name) {
      console.log("Faculty matches department exactly:", faculty.name, faculty.department);
    }
    
    return matches;
  })
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Department Management</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Department" : "Add New Department"}</DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Update the department details and save changes" 
                    : "Fill in the details to create a new department"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Department Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleFormChange("code", e.target.value)}
                      placeholder="e.g., CSE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year</Label>
                    <Select 
                      value={formData.establishedYear.toString()}
                      onValueChange={(value) => handleFormChange("establishedYear", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter department name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter department description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headName">Department Head</Label>
                  <Select 
                    value={formData.headId}
                    onValueChange={(value) => {
                      const faculty = mockFaculty.find(f => f.id === value)
                      if (faculty) {
                        handleFormChange("headId", value)
                        handleFormChange("headName", faculty.name)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department head" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFaculty
                        .filter(f => f.designation === "Professor")
                        .map(faculty => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name} ({faculty.specialization})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFormData(emptyDepartment)
                    setIsEditMode(false)
                    setEditingDeptId(null)
                    setShowAddDialog(false)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isEditMode ? handleEditDepartment : handleAddDepartment}
                  disabled={!formData.code || !formData.name || !formData.headName}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isEditMode ? "Save Changes" : "Add Department"}
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
                  <Building className="h-5 w-5" />
                  All Departments
                </CardTitle>
                <CardDescription>
                  Manage academic departments and associated faculty
                </CardDescription>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Department Name</TableHead>
                    <TableHead className="hidden md:table-cell">Head</TableHead>
                    <TableHead className="hidden md:table-cell">Established</TableHead>
                    <TableHead className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Faculty
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Students
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Courses
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                        No departments found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map(department => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">{department.code}</TableCell>
                        <TableCell>
                          <div>{department.name}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">{department.description.substring(0, 50)}...</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{department.headName}</TableCell>
                        <TableCell className="hidden md:table-cell">{department.establishedYear}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{department.facultyCount}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{department.studentCount}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline">{department.courses}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => startEditDepartment(department)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openManageFaculty(department)}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Faculty
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setDeleteTarget(department.id)
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
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone and may affect associated faculty, courses, and students.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteDepartment} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Faculty Dialog */}
      <Dialog open={showManageFacultyDialog} onOpenChange={setShowManageFacultyDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Manage Faculty - {selectedDepartment?.name}</DialogTitle>
            <DialogDescription>
              View and manage faculty members in this department
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Department Faculty</h3>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Faculty
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead className="hidden md:table-cell">Specialization</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentFaculty.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground h-16">
                        No faculty assigned to this department
                      </TableCell>
                    </TableRow>
                  ) : (
                    departmentFaculty.map(faculty => (
                      <TableRow key={faculty.id}>
                        <TableCell>{faculty.name}</TableCell>
                        <TableCell>{faculty.designation}</TableCell>
                        <TableCell className="hidden md:table-cell">{faculty.specialization}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowManageFacultyDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 