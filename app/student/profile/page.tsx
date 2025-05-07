"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  getStudentProfile,
  updateStudentProfile,
  StudentProfile,
  addNotification
} from "@/lib/student-storage"

export default function StudentProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
    batch: "",
    phoneNumber: "",
    address: ""
  })
  
  // If loading, show nothing
  if (isLoading) {
    return null
  }
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/student')
    }
  }, [isLoading, isAuthenticated, router])
  
  // Load profile from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const storedProfile = getStudentProfile()
      setProfile(storedProfile)
      
      // Initialize edit form with profile data
      if (storedProfile) {
        setEditForm({
          name: storedProfile.name || "",
          email: storedProfile.email || "",
          department: storedProfile.department || "",
          batch: storedProfile.batch || "",
          phoneNumber: storedProfile.phoneNumber || "",
          address: storedProfile.address || ""
        })
      }
    }
  }, [isAuthenticated])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle saving profile changes
  const handleSaveProfile = () => {
    if (!profile) return
    
    const updatedProfile = updateStudentProfile({
      name: editForm.name,
      email: editForm.email,
      department: editForm.department,
      batch: editForm.batch,
      phoneNumber: editForm.phoneNumber,
      address: editForm.address
    })
    
    if (updatedProfile) {
      setProfile(updatedProfile)
      
      // Add a notification for the profile update
      addNotification({
        id: `profile-${Date.now()}`,
        title: "Profile Updated",
        message: "Your profile has been updated successfully",
        createdAt: new Date().toISOString(),
        isRead: false,
        type: 'announcement'
      })
      
      setIsEditing(false)
    }
  }
  
  // Format date helper
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={profile?.name || user?.name || "Student"} userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold mb-4">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "S"}
                </div>
                <h2 className="text-2xl font-bold">{profile?.name || "Student"}</h2>
                <p className="text-muted-foreground">{profile?.email || "student@example.com"}</p>
                <div className="mt-4 w-full">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Student ID</span>
                    <span className="text-muted-foreground">{profile?.studentId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Department</span>
                    <span className="text-muted-foreground">{profile?.department || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Batch</span>
                    <span className="text-muted-foreground">{profile?.batch || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Joined Date</span>
                    <span className="text-muted-foreground">{formatDate(profile?.joinedDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          value={editForm.department}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="batch">Batch</Label>
                        <Input
                          id="batch"
                          name="batch"
                          value={editForm.batch}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={editForm.address}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Phone Number</span>
                          <span className="text-muted-foreground">{profile?.phoneNumber || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Email</span>
                          <span className="text-muted-foreground">{profile?.email || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Address</span>
                          <span className="text-muted-foreground">{profile?.address || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Academic Progress</h3>
                      <div className="mt-2">
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Courses Enrolled</span>
                          <span className="text-muted-foreground">3</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Assignments Pending</span>
                          <span className="text-muted-foreground">2</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Average Grade</span>
                          <span className="text-muted-foreground">A-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 