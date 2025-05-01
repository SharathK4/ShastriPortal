"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
  const [selectedView, setSelectedView] = useState<"week" | "month">("week")

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Virat" userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current No. of Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">7</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>vs last period 12 months</span>
                  <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Assignment Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold">15</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>vs last period 12 months</span>
                  <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
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

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="text-sm font-medium">MON 24</div>
              <div className="text-sm font-medium">TUE 25</div>
              <div className="text-sm font-medium">WED 26</div>
              <div className="text-sm font-medium">THU 27</div>
              <div className="text-sm font-medium">FRI 28</div>
              <div className="text-sm font-medium">SAT 29</div>
              <div className="text-sm font-medium">SUN 30</div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={selectedView === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("week")}
              >
                Week
              </Button>
              <Button
                variant={selectedView === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("month")}
              >
                Month
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
                  <div className="text-xs">Client Presentation Preparation</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event project-kickoff" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">8 AM - 9 AM</div>
                  <div className="text-xs">New Project Kickoff Meeting</div>
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
                  <div className="text-xs">Client Meeting Planning</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event design-revisions" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Design Revisions</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event design-refinement" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Design Refinement</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event design-team" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">9:30 AM - 10 AM</div>
                  <div className="text-xs">Design Team Stand-up Meeting</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event planning-goal" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">9 AM - 10 AM</div>
                  <div className="text-xs">Planning & Goal Setting for the Week</div>
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
                  <div className="text-xs">Collaboration with Development Team</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-advisor" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">10 AM - 11 AM</div>
                  <div className="text-xs">Meeting with Advisor internal team</div>
                </div>
              </div>

              {/* 11 AM */}
              <div className="border-r p-2 text-xs text-muted-foreground">11 AM</div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-ux" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">11 AM - 12 AM</div>
                  <div className="text-xs">Meetup with UX Internal Team</div>
                </div>
              </div>
              <div className="border-r relative">
                <div className="calendar-event client-feedback" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">11 AM - 12:30 AM</div>
                  <div className="text-xs">Client Feedback Meeting</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>

              {/* 12 PM */}
              <div className="border-r p-2 text-xs text-muted-foreground">12 AM</div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event meeting-gojek" style={{ top: "0px", height: "60px" }}>
                  <div className="text-xs font-medium">12 AM - 1 AM</div>
                  <div className="text-xs">Meeting with Gojek internal team</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event client-progress" style={{ top: "0px", height: "90px" }}>
                  <div className="text-xs font-medium">12 AM - 1:30 PM</div>
                  <div className="text-xs">Client Meeting Progress report</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>

              {/* 1 PM */}
              <div className="border-r p-2 text-xs text-muted-foreground">1 PM</div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r"></div>
              <div className="border-r relative">
                <div className="calendar-event industry-webinar" style={{ top: "30px", height: "60px" }}>
                  <div className="text-xs font-medium">1:30 PM - 2 AM</div>
                  <div className="text-xs">Industry Webinar/ Workshop</div>
                </div>
              </div>
              <div className="border-r"></div>
              <div className="border-r"></div>
            </div>
          </div>

          {selectedView === "month" && (
            <div className="mt-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <h3 className="text-lg font-medium">July 2022</h3>
                <Button variant="ghost" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="mini-calendar">
                {/* Week days */}
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="text-center text-sm font-medium py-2">
                    {day}
                  </div>
                ))}

                {/* Days from previous month */}
                {[27, 28, 29, 30].map((day) => (
                  <div key={`prev-${day}`} className="mini-calendar-day other-month">
                    {day}
                  </div>
                ))}

                {/* Days in current month */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`mini-calendar-day ${day === 15 ? "today" : ""} ${
                      [2, 9, 16, 23, 30].includes(day) || [3, 10, 17, 24, 31].includes(day) ? "weekend" : ""
                    } ${[7, 14, 21, 28].includes(day) ? "selected" : ""}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

