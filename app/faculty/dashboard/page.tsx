"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"

export default function FacultyDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Dr. Sharma" userType="faculty" />

      <main className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">4</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">12</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>to be graded</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Student Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">5</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>unresolved</span>
                  <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Calendar</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="calendar-grid min-h-[600px] relative">
              {/* Time labels */}
              <div className="border-r border-b p-2 text-xs text-muted-foreground">Time</div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>
              <div className="border-b"></div>

              {/* 8 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">8 AM</div>
              <div className="border-r relative">
                <div className="calendar-event client-presentation" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">8 AM - 9 AM</div>
                  <div className="text-xs">Lecture Preparation</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event project-kickoff" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">8 AM - 9 AM</div>
                  <div className="text-xs">Department Meeting</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>

              {/* 9 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">9 AM</div>
              <div className="border-r relative">
                <div className="calendar-event client-meeting" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">9 AM - 10:30 AM</div>
                  <div className="text-xs">CSE 1 Lecture</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event design-revisions" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Office Hours</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event design-refinement" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">CSE 7 Lecture</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event design-team" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">9:30 AM - 10 AM</div>
                  <div className="text-xs">Faculty Meeting</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event planning-goal" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Research Planning</div>
                </div>
              </div>
              <div className="border-r"></div>

              {/* 10 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">10 AM</div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event collaboration" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">10 AM - 11 AM</div>
                  <div className="text-xs">Student Consultation</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-advisor" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">10 AM - 11 AM</div>
                  <div className="text-xs">Thesis Review</div>
                </div>
              </div>

              {/* 11 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">11 AM</div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-ux" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">11 AM - 12 AM</div>
                  <div className="text-xs">Research Group Meeting</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event client-feedback" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">11 AM - 12:30 AM</div>
                  <div className="text-xs">Grading Session</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl font-medium">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">CSE 1: Programming Basics</h3>
                    <p className="text-sm text-muted-foreground">Due in 2 days</p>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">CSE 7: ML Project</h3>
                    <p className="text-sm text-muted-foreground">Due in 5 days</p>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">CSE 5: Database Design</h3>
                    <p className="text-sm text-muted-foreground">Due in 1 week</p>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">CSE 1: Introduction</h3>
                    <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Prepare
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">CSE 7: Advanced Topics</h3>
                    <p className="text-sm text-muted-foreground">Wednesday, 11:00 AM</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Prepare
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">CSE 5: Normalization</h3>
                    <p className="text-sm text-muted-foreground">Friday, 2:00 PM</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Prepare
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

