"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"

export default function CreateAssignments() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isGroupAssignment, setIsGroupAssignment] = useState(false)

  const courses = [
    { id: "1", code: "CSE 1", name: "Introduction to Computer Science" },
    { id: "2", code: "CSE 7", name: "Machine Learning" },
    { id: "3", code: "CSE 5", name: "Database Management Systems" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Assignment created successfully!")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Dr. Sharma" userType="faculty" />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Assignment</h1>

          <Card className="animate-fadeIn">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>
                  Create a new assignment for your students. Fill in all the required details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input id="title" placeholder="Enter assignment title" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code}: {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Assignment Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed instructions for the assignment"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Total Points</Label>
                    <Input id="points" type="number" min="1" placeholder="100" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="group-assignment">Group Assignment</Label>
                    <Switch id="group-assignment" checked={isGroupAssignment} onCheckedChange={setIsGroupAssignment} />
                  </div>
                  {isGroupAssignment && (
                    <div className="pt-2 space-y-2">
                      <Label htmlFor="group-size">Maximum Group Size</Label>
                      <Input id="group-size" type="number" min="2" max="10" placeholder="4" required />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, ZIP (Max 10MB)</p>
                    <Input id="attachments" type="file" className="hidden" />
                    <Button type="button" variant="outline" size="sm" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <div className="space-x-2">
                  <Button variant="outline">Preview</Button>
                  <Button type="submit">Create Assignment</Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

