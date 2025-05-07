"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getFacultyCourses, FacultyCourse } from "@/lib/faculty-storage"

export default function FacultyClasses() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<FacultyCourse[]>([])
  
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
    }
  }, [isAuthenticated])
  
  // Get unique batch years
  const batchYears = [...new Set(courses.map((course) => course.batchYear))]

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Faculty"} userType="faculty" />

      <main className="flex-1 p-6 space-y-8">
        <h1 className="text-3xl font-bold">Courses</h1>

        {courses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No courses found. Add courses to get started.</p>
            <Button className="mt-4" onClick={() => router.push('/faculty/create-assignments')}>
              Create Assignment
            </Button>
          </div>
        ) : (
          batchYears.map((batchYear) => (
            <div key={batchYear} className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-medium">Batch {batchYear}</h2>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                {courses
                  .filter((course) => course.batchYear === batchYear)
                  .map((course) => (
                    <div key={course.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="bg-gray-700 text-white">
                            {course.code}
                          </Badge>
                          <div>
                            <h3 className="font-medium">{course.name}</h3>
                            <p className="text-sm text-muted-foreground">Students: {course.studentCount}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/faculty/classes/${course.id}/view-assignment`}>
                            <Button variant="outline" size="sm">
                              View Assignment
                            </Button>
                          </Link>
                          <Link href="/faculty/create-assignments">
                            <Button variant="outline" size="sm">
                              Create Assignment
                            </Button>
                          </Link>
                          <Link href={`/faculty/classes/${course.id}/attendance`}>
                            <Button variant="outline" size="sm">
                              Attendance
                            </Button>
                          </Link>
                          <Link href={`/faculty/classes/${course.id}`}>
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}

