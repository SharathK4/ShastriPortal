"use client"

import { useState, useEffect } from "react"
import { UserCog, Users, School, TicketCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminData } from "@/lib/admin-storage"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [adminData, setAdminData] = useState<any>(null)
  
  // Fetch admin data from localStorage
  useEffect(() => {
    if (user) {
      const data = getAdminData()
      setAdminData(data)
    }
  }, [user])
  
  // Mock stats that would come from an API in a real application
  const mockStats = {
    totalStudents: 450,
    totalFaculty: 32,
    activeCourses: 24,
    openTickets: 8
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Administrator'}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled across {mockStats.activeCourses} active courses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalFaculty}</div>
              <p className="text-xs text-muted-foreground">
                From various departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeCourses}</div>
              <p className="text-xs text-muted-foreground">
                Currently in session
              </p>
            </CardContent>
          </Card>
          
          <Link href="/admin/tickets">
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <TicketCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.openTickets}</div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Overview of system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>New student registration</span>
                  <span className="text-muted-foreground">10 minutes ago</span>
                </li>
                <li className="flex justify-between">
                  <span>New course added</span>
                  <span className="text-muted-foreground">2 hours ago</span>
                </li>
                <li className="flex justify-between">
                  <span>Faculty updated assignments</span>
                  <span className="text-muted-foreground">3 hours ago</span>
                </li>
                <li className="flex justify-between">
                  <span>System maintenance scheduled</span>
                  <span className="text-muted-foreground">Yesterday</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 