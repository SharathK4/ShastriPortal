"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  code: string
  name: string
  students: number
  batch: string
}

const courses: Course[] = [
  {
    id: "1",
    code: "CSE 1",
    name: "Introduction to Computer Science",
    students: 120,
    batch: "2023",
  },
  {
    id: "2",
    code: "CSE 7",
    name: "Machine Learning",
    students: 85,
    batch: "2023",
  },
  {
    id: "3",
    code: "CSE 1",
    name: "Data Structures",
    students: 110,
    batch: "2024",
  },
  {
    id: "4",
    code: "CSE 5",
    name: "Database Management Systems",
    students: 95,
    batch: "2024",
  },
]

export default function FacultyClasses() {
  const batches = [...new Set(courses.map((course) => course.batch))]

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Dr. Sharma" userType="faculty" />

      <main className="flex-1 p-6 space-y-8">
        <h1 className="text-3xl font-bold">Courses</h1>

        {batches.map((batch) => (
          <div key={batch} className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-medium">Batch {batch}</h2>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              {courses
                .filter((course) => course.batch === batch)
                .map((course) => (
                  <div key={course.id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-gray-700 text-white">
                          {course.code}
                        </Badge>
                        <div>
                          <h3 className="font-medium">{course.name}</h3>
                          <p className="text-sm text-muted-foreground">Students: {course.students}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/faculty/classes/${course.id}/view-assignment`}>
                          <Button variant="outline" size="sm">
                            View Assignment
                          </Button>
                        </Link>
                        <Link href={`/faculty/classes/${course.id}/create-assignment`}>
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
        ))}
      </main>
    </div>
  )
}

