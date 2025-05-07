"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { 
  getEnrolledCourses, 
  enrollCourse, 
  unenrollCourse, 
  Course,
  addNotification
} from "@/lib/student-storage"

// Available courses for enrollment
const availableCourses: Course[] = [
  {
    id: "4",
    code: "CSE401",
    name: "Machine Learning",
    instructor: "Dr. Kumar",
    credits: 4,
    batch: "2023",
  },
  {
    id: "5",
    code: "CSE501",
    name: "Artificial Intelligence",
    instructor: "Dr. Patel",
    credits: 3,
    batch: "2023",
  },
  {
    id: "6",
    code: "CSE601",
    name: "Computer Networks",
    instructor: "Dr. Mishra",
    credits: 4,
    batch: "2023",
  },
];

export default function StudentCourses() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  
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
  
  // Load courses from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const courses = getEnrolledCourses()
      setEnrolledCourses(courses)
    }
  }, [isAuthenticated])
  
  // Get unique batches for filtering
  const batches = ["all", ...new Set(enrolledCourses.map((course) => course.batch))]
  
  // Filter courses based on batch and search term
  const filteredCourses = enrolledCourses.filter((course) => {
    const batchMatch = selectedBatch === "all" || course.batch === selectedBatch
    const searchMatch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    return batchMatch && searchMatch
  })
  
  // Filter available courses to not show already enrolled ones
  const filteredAvailableCourses = availableCourses.filter(
    (course) => !enrolledCourses.some((enrolled) => enrolled.id === course.id)
  )
  
  // Handle enrollment of a new course
  const handleEnroll = (course: Course) => {
    const updated = enrollCourse(course)
    setEnrolledCourses(updated)
    
    // Add a notification for the enrollment
    addNotification({
      id: `enroll-${Date.now()}`,
      title: "Course Enrolled",
      message: `You have successfully enrolled in ${course.name}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'course'
    })
  }
  
  // Handle unenrollment from a course
  const handleUnenroll = (courseId: string) => {
    const courseToUnenroll = enrolledCourses.find(c => c.id === courseId)
    if (!courseToUnenroll) return
    
    const updated = unenrollCourse(courseId)
    setEnrolledCourses(updated)
    
    // Add a notification for the unenrollment
    addNotification({
      id: `unenroll-${Date.now()}`,
      title: "Course Unenrolled",
      message: `You have unenrolled from ${courseToUnenroll.name}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'course'
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Student"} userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <span className="text-muted-foreground">{enrolledCourses.length} courses enrolled</span>
        </div>

        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="available">Available Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="w-full max-w-sm">
                <Label htmlFor="search">Search Courses</Label>
                <Input
                  id="search"
                  placeholder="Search by name, code, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="w-full max-w-[200px]">
                <Label htmlFor="batch">Filter by Batch</Label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch === "all" ? "All Batches" : `Batch ${batch}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No courses found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="animate-fadeIn">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{course.name}</CardTitle>
                          <CardDescription>{course.code}</CardDescription>
                        </div>
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                          {course.credits} Credits
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Instructor</span>
                          <span className="text-sm font-medium">{course.instructor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Batch</span>
                          <span className="text-sm font-medium">{course.batch}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => handleUnenroll(course.id)}
                      >
                        Unenroll
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-6 animate-fadeIn">
            <div className="text-muted-foreground mb-4">
              <p>Discover and enroll in new courses to enhance your knowledge and skills.</p>
            </div>

            {filteredAvailableCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No available courses found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableCourses.map((course) => (
                  <Card key={course.id} className="animate-fadeIn">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{course.name}</CardTitle>
                          <CardDescription>{course.code}</CardDescription>
                        </div>
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                          {course.credits} Credits
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Instructor</span>
                          <span className="text-sm font-medium">{course.instructor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Batch</span>
                          <span className="text-sm font-medium">{course.batch}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => handleEnroll(course)}
                      >
                        Enroll
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

