"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartLegend, ChartPie, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface GradeData {
  course: string
  grade: string
  score: number
  color: string
}

const gradeData: GradeData[] = [
  { course: "CSE 1", grade: "A", score: 90, color: "#22c55e" },
  { course: "CSE 7", grade: "B+", score: 85, color: "#84cc16" },
  { course: "CSE 5", grade: "A-", score: 88, color: "#10b981" },
  { course: "MAT 2", grade: "B", score: 80, color: "#eab308" },
  { course: "PHY 1", grade: "C+", score: 75, color: "#f97316" },
  { course: "ENG 1", grade: "A", score: 92, color: "#22c55e" },
  { course: "HIS 1", grade: "B-", score: 78, color: "#f59e0b" },
]

const gradeDistribution = [
  { name: "A", value: 2, color: "#22c55e" },
  { name: "A-", value: 1, color: "#10b981" },
  { name: "B+", value: 1, color: "#84cc16" },
  { name: "B", value: 1, color: "#eab308" },
  { name: "B-", value: 1, color: "#f59e0b" },
  { name: "C+", value: 1, color: "#f97316" },
]

const progressData = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 80 },
  { month: "Apr", score: 85 },
  { month: "May", score: 88 },
  { month: "Jun", score: 90 },
]

export default function StudentGrades() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Virat" userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <h1 className="text-3xl font-bold">Grades</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer>
                      <ChartPie
                        data={gradeDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={90}
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <ChartTooltip>
                          <ChartTooltipContent
                            content={({ payload }) => {
                              if (payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="p-2">
                                    <p className="font-medium">
                                      {data.name}: {data.value} course(s)
                                    </p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </ChartTooltip>
                        <ChartLegend />
                      </ChartPie>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GPA Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="month" />
                        <YAxis domain={[70, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Current GPA</h3>
                    <div className="text-4xl font-bold text-primary">3.5</div>
                    <p className="text-sm text-muted-foreground mt-2">out of 4.0</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Completed Credits</h3>
                    <div className="text-4xl font-bold text-primary">42</div>
                    <p className="text-sm text-muted-foreground mt-2">out of 120</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Academic Standing</h3>
                    <div className="text-xl font-bold text-green-500">Good Standing</div>
                    <p className="text-sm text-muted-foreground mt-2">Keep it up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="animate-fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Course Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradeData.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div>
                        <h3 className="font-medium">{course.course}</h3>
                        <p className="text-sm text-muted-foreground">Score: {course.score}/100</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full"
                            style={{ width: `${course.score}%`, backgroundColor: course.color }}
                          ></div>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: course.color }}
                        >
                          {course.grade}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="animate-fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Academic Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Semester Progress</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Current Semester</span>
                            <span className="text-sm font-medium">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Degree Completion</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Core Requirements</span>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Electives</span>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Academic Milestones</h3>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 bg-green-100 rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <div>
                            <h4 className="font-medium">First Year Completed</h4>
                            <p className="text-sm text-muted-foreground">May 2022</p>
                          </div>
                        </div>

                        <div className="flex items-center p-3 bg-green-100 rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <div>
                            <h4 className="font-medium">Core Courses Started</h4>
                            <p className="text-sm text-muted-foreground">September 2022</p>
                          </div>
                        </div>

                        <div className="flex items-center p-3 bg-yellow-100 rounded-lg">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                          <div>
                            <h4 className="font-medium">Internship Eligibility</h4>
                            <p className="text-sm text-muted-foreground">In Progress</p>
                          </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                          <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                          <div>
                            <h4 className="font-medium">Graduation</h4>
                            <p className="text-sm text-muted-foreground">Expected May 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

