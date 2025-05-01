"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Download, Upload } from "lucide-react"
import Link from "next/link"

interface SoloAssignment {
  id: string
  course: string
  title: string
  tag: string
  tagColor: string
  deadline: string
  dueDate: string
  status: "pending" | "in-progress" | "submitted"
}

const soloAssignments: SoloAssignment[] = [
  {
    id: "1",
    course: "Hackerblocks",
    title: "Algorithm Challenge",
    tag: "Sam",
    tagColor: "bg-orange-500",
    deadline: "48h",
    dueDate: "July 27, 2022",
    status: "in-progress",
  },
  {
    id: "2",
    course: "Hackerblocks",
    title: "Database Design",
    tag: "Sem",
    tagColor: "bg-black",
    deadline: "24h",
    dueDate: "July 26, 2022",
    status: "pending",
  },
  {
    id: "3",
    course: "Figma Design",
    title: "UI/UX Project",
    tag: "SE",
    tagColor: "bg-green-500",
    deadline: "24h",
    dueDate: "July 26, 2022",
    status: "submitted",
  },
]

export default function SoloAssignments() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Virat" userType="student" />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/student/assignments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Solo Assignments</h1>
          </div>
          <Badge className="bg-primary text-white">Total: {soloAssignments.length}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 animate-fadeIn">
          {soloAssignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={`${assignment.tagColor} text-white`}>{assignment.tag}</Badge>
                    <CardTitle>
                      {assignment.course}: {assignment.title}
                    </CardTitle>
                  </div>
                  <Badge variant={assignment.status === "submitted" ? "default" : "outline"}>
                    {assignment.status === "pending"
                      ? "Not Started"
                      : assignment.status === "in-progress"
                        ? "In Progress"
                        : "Submitted"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Assignment Description</h3>
                    <p className="text-muted-foreground">
                      Complete the {assignment.title} for {assignment.course}. Follow the instructions in the attached
                      document.
                    </p>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Submit your solution as a single file</li>
                        <li>Include comments to explain your approach</li>
                        <li>Ensure your code is optimized and efficient</li>
                        <li>Test your solution with the provided test cases</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Assignment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium">{assignment.deadline} remaining</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {assignment.dueDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize">{assignment.status.replace("-", " ")}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Button className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Instructions
                      </Button>
                      <Button className="w-full" disabled={assignment.status === "submitted"}>
                        <Upload className="mr-2 h-4 w-4" />
                        {assignment.status === "submitted" ? "Already Submitted" : "Submit Assignment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

