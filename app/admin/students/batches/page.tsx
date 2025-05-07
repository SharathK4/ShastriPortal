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
  CheckCircle, 
  XCircle,
  Filter,
  X,
  Users,
  CalendarRange,
  Save,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

// Batch interface
interface Batch {
  id: string
  name: string
  startYear: number
  endYear: number
  department: string
  coordinator: string
  totalStudents: number
  sections: string[]
  isActive: boolean
}

// Mock departments data
const departments = [
  "Computer Science", 
  "Electrical Engineering", 
  "Mechanical Engineering", 
  "Civil Engineering", 
  "Electronics & Communication"
]

// Mock faculty data for coordinators
const facultyCoordinators = [
  "Dr. Sharma",
  "Dr. Patel",
  "Dr. Gupta",
  "Dr. Singh",
  "Dr. Kumar",
  "Dr. Reddy",
  "Dr. Joshi",
  "Dr. Verma"
]

// Mock batch data
const mockBatches: Batch[] = [
  {
    id: "BATCH2020CS",
    name: "CS 2020-24",
    startYear: 2020,
    endYear: 2024,
    department: "Computer Science",
    coordinator: "Dr. Sharma",
    totalStudents: 120,
    sections: ["A", "B", "C"],
    isActive: true
  },
  {
    id: "BATCH2021CS",
    name: "CS 2021-25",
    startYear: 2021,
    endYear: 2025,
    department: "Computer Science",
    coordinator: "Dr. Patel",
    totalStudents: 130,
    sections: ["A", "B", "C", "D"],
    isActive: true
  },
  {
    id: "BATCH2022CS",
    name: "CS 2022-26",
    startYear: 2022,
    endYear: 2026,
    department: "Computer Science",
    coordinator: "Dr. Gupta",
    totalStudents: 140,
    sections: ["A", "B", "C", "D"],
    isActive: true
  },
  {
    id: "BATCH2023CS",
    name: "CS 2023-27",
    startYear: 2023,
    endYear: 2027,
    department: "Computer Science",
    coordinator: "Dr. Verma",
    totalStudents: 150,
    sections: ["A", "B", "C", "D", "E"],
    isActive: true
  },
  {
    id: "BATCH2020EE",
    name: "EE 2020-24",
    startYear: 2020,
    endYear: 2024,
    department: "Electrical Engineering",
    coordinator: "Dr. Singh",
    totalStudents: 110,
    sections: ["A", "B", "C"],
    isActive: true
  },
  {
    id: "BATCH2021EE",
    name: "EE 2021-25",
    startYear: 2021,
    endYear: 2025,
    department: "Electrical Engineering",
    coordinator: "Dr. Kumar",
    totalStudents: 105,
    sections: ["A", "B", "C"],
    isActive: true
  },
  {
    id: "BATCH2020ME",
    name: "ME 2020-24",
    startYear: 2020,
    endYear: 2024,
    department: "Mechanical Engineering",
    coordinator: "Dr. Reddy",
    totalStudents: 125,
    sections: ["A", "B", "C"],
    isActive: true
  },
  {
    id: "BATCH2020CE",
    name: "CE 2020-24",
    startYear: 2020,
    endYear: 2024,
    department: "Civil Engineering",
    coordinator: "Dr. Joshi",
    totalStudents: 95,
    sections: ["A", "B"],
    isActive: true
  },
  {
    id: "BATCH2019CS",
    name: "CS 2019-23",
    startYear: 2019,
    endYear: 2023,
    department: "Computer Science",
    coordinator: "Dr. Sharma",
    totalStudents: 115,
    sections: ["A", "B", "C"],
    isActive: false
  },
  {
    id: "BATCH2019EE",
    name: "EE 2019-23",
    startYear: 2019,
    endYear: 2023,
    department: "Electrical Engineering",
    coordinator: "Dr. Singh",
    totalStudents: 90,
    sections: ["A", "B"],
    isActive: false
  }
]

// Empty batch form for new batches
const emptyBatch: Omit<Batch, "id" | "totalStudents"> = {
  name: "",
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear() + 4,
  department: "Computer Science",
  coordinator: "",
  sections: ["A"],
  isActive: true
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [formData, setFormData] = useState<Omit<Batch, "id" | "totalStudents">>(emptyBatch)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [sectionsInput, setSectionsInput] = useState<string>("A")
  
  // Filter batches based on search and filters
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === "all" || batch.department === departmentFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && batch.isActive) ||
      (statusFilter === "inactive" && !batch.isActive)
    
    return matchesSearch && matchesDepartment && matchesStatus
  })
  
  // Reset filters
  const resetFilters = () => {
    setDepartmentFilter("all")
    setStatusFilter("all")
  }
  
  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Handle sections input change
  const handleSectionsChange = (input: string) => {
    setSectionsInput(input)
    const sections = input.split(",").map(s => s.trim()).filter(s => s !== "")
    handleFormChange("sections", sections)
  }
  
  // Add new batch
  const handleAddBatch = () => {
    // Generate a unique ID based on department and years
    const deptCode = formData.department.split(" ")[0].substring(0, 2).toUpperCase()
    const batchId = `BATCH${formData.startYear}${deptCode}`
    
    const newBatch: Batch = {
      id: batchId,
      ...formData,
      totalStudents: 0 // New batch starts with 0 students
    }
    
    setBatches([...batches, newBatch])
    setFormData(emptyBatch)
    setShowAddDialog(false)
  }
  
  // Start editing a batch
  const startEditBatch = (batch: Batch) => {
    setFormData({
      name: batch.name,
      startYear: batch.startYear,
      endYear: batch.endYear,
      department: batch.department,
      coordinator: batch.coordinator,
      sections: batch.sections,
      isActive: batch.isActive
    })
    setSectionsInput(batch.sections.join(", "))
    setIsEditMode(true)
    setEditingBatchId(batch.id)
    setShowAddDialog(true)
  }
  
  // Save edited batch
  const handleEditBatch = () => {
    if (!editingBatchId) return
    
    const updatedBatches = batches.map(batch => 
      batch.id === editingBatchId 
        ? { ...batch, ...formData } 
        : batch
    )
    
    setBatches(updatedBatches)
    setFormData(emptyBatch)
    setSectionsInput("A")
    setIsEditMode(false)
    setEditingBatchId(null)
    setShowAddDialog(false)
  }
  
  // Delete batch
  const deleteBatch = () => {
    if (!deleteTarget) return
    
    const updatedBatches = batches.filter(batch => batch.id !== deleteTarget)
    setBatches(updatedBatches)
    setDeleteTarget(null)
    setShowDeleteConfirm(false)
  }
  
  // Toggle batch active status
  const toggleBatchStatus = (batchId: string) => {
    const updatedBatches = batches.map(batch => 
      batch.id === batchId 
        ? { ...batch, isActive: !batch.isActive } 
        : batch
    )
    
    setBatches(updatedBatches)
  }
  
  // Generate year options for select fields
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString())
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Batch Management</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Batch" : "Add New Batch"}</DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Update the batch details and save changes" 
                    : "Fill in the details to create a new batch"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Batch Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="e.g., CS 2023-27"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startYear">Start Year</Label>
                    <Select 
                      value={formData.startYear.toString()}
                      onValueChange={(value) => {
                        const startYear = parseInt(value)
                        handleFormChange("startYear", startYear)
                        handleFormChange("endYear", startYear + 4)
                      }}
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
                  <div className="space-y-2">
                    <Label htmlFor="endYear">End Year</Label>
                    <Select 
                      value={formData.endYear.toString()}
                      onValueChange={(value) => handleFormChange("endYear", parseInt(value))}
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
                
                <div className="space-y-2">
                  <Label htmlFor="coordinator">Batch Coordinator</Label>
                  <Select 
                    value={formData.coordinator}
                    onValueChange={(value) => handleFormChange("coordinator", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {facultyCoordinators.map(coordinator => (
                        <SelectItem key={coordinator} value={coordinator}>{coordinator}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sections">Sections (comma separated)</Label>
                  <Input
                    id="sections"
                    value={sectionsInput}
                    onChange={(e) => handleSectionsChange(e.target.value)}
                    placeholder="e.g., A, B, C"
                  />
                  <p className="text-xs text-muted-foreground">Current sections: {formData.sections.join(", ")}</p>
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
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFormData(emptyBatch)
                    setSectionsInput("A")
                    setIsEditMode(false)
                    setEditingBatchId(null)
                    setShowAddDialog(false)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isEditMode ? handleEditBatch : handleAddBatch}
                  disabled={!formData.name || !formData.department || !formData.coordinator}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isEditMode ? "Save Changes" : "Add Batch"}
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
                  <Users className="h-5 w-5" />
                  All Batches
                </CardTitle>
                <CardDescription>
                  Manage student batches across different departments
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search batches..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t">
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
                    <TableHead>Batch Name</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Year</TableHead>
                    <TableHead className="hidden lg:table-cell">Coordinator</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="hidden lg:table-cell">Sections</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                        No batches found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBatches.map(batch => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{batch.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{`${batch.startYear} - ${batch.endYear}`}</TableCell>
                        <TableCell className="hidden lg:table-cell">{batch.coordinator}</TableCell>
                        <TableCell>{batch.totalStudents}</TableCell>
                        <TableCell className="hidden lg:table-cell">{batch.sections.join(", ")}</TableCell>
                        <TableCell>
                          <Badge className={batch.isActive 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                          >
                            {batch.isActive ? "Active" : "Inactive"}
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
                              <DropdownMenuItem onClick={() => startEditBatch(batch)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleBatchStatus(batch.id)}>
                                {batch.isActive ? (
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
                                  setDeleteTarget(batch.id)
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
                Showing {filteredBatches.length} {filteredBatches.length === 1 ? "batch" : "batches"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Batch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this batch? This action cannot be undone and may affect enrolled students.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteBatch} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 