"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Assignment {
  id: string
  course: string
  title: string
  tag: string
  tagColor: string
  deadline: string
}

const assignments: Assignment[] = [
  {
    id: "1",
    course: "Python Notebook",
    title: "Data Analysis Project",
    tag: "ML",
    tagColor: "bg-blue-500",
    deadline: "24h",
  },
  {
    id: "2",
    course: "Hackerblocks",
    title: "Algorithm Challenge",
    tag: "Sam",
    tagColor: "bg-orange-500",
    deadline: "48h",
  },
  {
    id: "3",
    course: "Hackerblocks",
    title: "Database Design",
    tag: "Sem",
    tagColor: "bg-black",
    deadline: "24h",
  },
  {
    id: "4",
    course: "Figma Design",
    title: "UI/UX Project",
    tag: "SE",
    tagColor: "bg-green-500",
    deadline: "24h",
  },
  {
    id: "5",
    course: "App Dev",
    title: "Mobile Application",
    tag: "MAD",
    tagColor: "bg-purple-500",
    deadline: "24h",
  },
]

const groupAssignments = assignments.slice(0, 2)

export default function StudentAssignments() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Virat" userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Group Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border transition-all hover:shadow-md"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center gap-3">
                  <Badge className={`${assignment.tagColor} text-white`}>{assignment.tag}</Badge>
                  <div>
                    <h3 className="font-medium">{assignment.course}</h3>
                    <p className="text-sm text-muted-foreground">view more...</p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {assignment.deadline}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <Link href="/student/assignments/solo">
              <Button variant="outline">View Solo Assignments</Button>
            </Link>
            <Link href="/student/assignments/group">
              <Button variant="outline">View Group Assignments</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

