"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Upload, Users } from "lucide-react"
import Link from "next/link"

interface GroupAssignment {
  id: string
  course: string
  title: string
  tag: string
  tagColor: string
  deadline: string
  members: string[]
  status: "pending" | "in-progress" | "submitted"
}

const groupAssignments: GroupAssignment[] = [
  {
    id: "1",
    course: "Python Notebook",
    title: "Machine Learning Group Project",
    tag: "ML",
    tagColor: "bg-blue-500",
    deadline: "24h",
    members: ["Virat", "Rohit", "Rahul", "Hardik"],
    status: "in-progress",
  },
  {
    id: "2",
    course: "App Dev",
    title: "Mobile Application Development",
    tag: "MAD",
    tagColor: "bg-purple-500",
    deadline: "48h",
    members: ["Virat", "Shikhar", "Rishabh"],
    status: "pending",
  },
]

export default function GroupAssignments() {
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
            <h1 className="text-2xl font-bold">Group Assignments</h1>
          </div>
          <Badge className="bg-primary text-white">Total: {groupAssignments.length}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 animate-fadeIn">
          {groupAssignments.map((assignment) => (
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
                    <h3 className="font-medium mb-2 flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Group Members
                    </h3>
                    <div className="space-y-2">
                      {assignment.members.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {member.charAt(0)}
                          </div>
                          <span>{member}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="ml-2">
                              Leader
                            </Badge>
                          )}
                        </div>
                      ))}
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
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize">{assignment.status.replace("-", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Group Size:</span>
                        <span className="font-medium">{assignment.members.length} members</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Button className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Instructions
                      </Button>
                      <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Assignment
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

