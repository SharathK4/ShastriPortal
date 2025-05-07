"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, HelpCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  getFacultyTickets, 
  updateTicketStatus, 
  addFacultyNotification,
  addFacultyTicket,
  FacultyTicket
} from "@/lib/faculty-storage"

export default function FacultyTicketRaise() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"myTickets" | "newTicket" | "studentTickets">("myTickets")
  const [tickets, setTickets] = useState<FacultyTicket[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "medium",
  })
  const [responseData, setResponseData] = useState({
    ticketId: "",
    responseText: "",
    status: ""
  })
  const [showResponseForm, setShowResponseForm] = useState(false)
  
  // If loading, show nothing
  if (isLoading) {
    return null
  }
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/faculty')
    }
  }, [isLoading, isAuthenticated, router])
  
  // Load tickets from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const storedTickets = getFacultyTickets()
      setTickets(storedTickets)
    }
  }, [isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create and save the new faculty ticket
    const newTicket = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: 'open' as const,
      studentId: "", // Empty for faculty-raised tickets
      studentName: "",
    };
    
    // Add the ticket to localStorage
    const updatedTickets = addFacultyTicket(newTicket);
    setTickets(updatedTickets);
    
    // Create notification for the ticket
    addFacultyNotification({
      id: `NOTIF${Date.now()}`,
      title: "New Ticket Created",
      message: `You have created a new ticket: ${formData.title}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'ticket'
    });
    
    // Reset form
    setFormData({
      title: "",
      category: "",
      description: "",
      priority: "medium",
    });
    
    // Switch to my tickets view
    setActiveTab("myTickets");
  }
  
  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResponseData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!responseData.ticketId || !responseData.status || !responseData.responseText) {
      alert("Please fill all fields")
      return
    }
    
    // Update ticket status
    const updatedTickets = updateTicketStatus(
      responseData.ticketId, 
      responseData.status as FacultyTicket['status'],
      responseData.responseText
    )
    
    // Update state
    setTickets(updatedTickets)
    
    // Create notification
    addFacultyNotification({
      id: `NOTIF${Date.now()}`,
      title: "Ticket Updated",
      message: `You have responded to ticket: ${responseData.ticketId}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'ticket'
    })
    
    // Reset form and hide it
    setResponseData({
      ticketId: "",
      responseText: "",
      status: ""
    })
    setShowResponseForm(false)
  }
  
  const handleResponseClick = (ticket: FacultyTicket) => {
    setResponseData({
      ticketId: ticket.id,
      responseText: ticket.response || "",
      status: ticket.status
    })
    setShowResponseForm(true)
  }

  const getStatusIcon = (status: FacultyTicket["status"]) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "closed":
        return <HelpCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: FacultyTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  
  // Filter tickets by type
  const facultyTickets = tickets.filter(ticket => !ticket.studentId || ticket.studentId === "");
  const studentTickets = tickets.filter(ticket => ticket.studentId && ticket.studentId !== "");

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Faculty"} userType="faculty" />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "myTickets" ? "default" : "outline"}
              onClick={() => setActiveTab("myTickets")}
            >
              My Tickets
            </Button>
            <Button
              variant={activeTab === "studentTickets" ? "default" : "outline"}
              onClick={() => setActiveTab("studentTickets")}
            >
              Student Tickets
            </Button>
            <Button
              variant={activeTab === "newTicket" ? "default" : "outline"}
              onClick={() => setActiveTab("newTicket")}
            >
              Raise New Ticket
            </Button>
          </div>
        </div>

        {activeTab === "myTickets" ? (
          <div className="space-y-4 animate-fadeIn">
            {facultyTickets.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No tickets found. Create a new ticket to get started.</p>
                <Button className="mt-4" onClick={() => setActiveTab("newTicket")}>
                  Raise New Ticket
                </Button>
              </div>
            ) : (
              facultyTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{ticket.id}</Badge>
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(ticket.status)} variant="outline">
                        <span className="flex items-center">
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status.replace("-", " ")}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center justify-between mt-2">
                      <span>Priority: {ticket.priority}</span>
                      <span>Submitted on: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  </CardContent>
                  <CardFooter className="bg-muted/20 p-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        ) : activeTab === "studentTickets" ? (
          <div className="space-y-4 animate-fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Student Tickets</CardTitle>
                <CardDescription>View and respond to tickets submitted by your students.</CardDescription>
              </CardHeader>
              <CardContent>
                {studentTickets.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No student tickets found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentTickets.map((ticket) => (
                      <div key={ticket.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h3 className="font-medium">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground">From: {ticket.studentName}</p>
                          <p className="text-xs text-muted-foreground mt-1">{ticket.description.substring(0, 80)}...</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace("-", " ")}
                          </Badge>
                          <Button size="sm" onClick={() => handleResponseClick(ticket)}>
                            Respond
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {showResponseForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Respond to Ticket</CardTitle>
                  <CardDescription>
                    Provide a response to the student ticket
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleResponseSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="responseText">Your Response</Label>
                      <Textarea
                        id="responseText"
                        name="responseText"
                        placeholder="Enter your response"
                        value={responseData.responseText}
                        onChange={handleResponseChange}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Update Status</Label>
                      <Select
                        value={responseData.status}
                        onValueChange={(value) => setResponseData(prev => ({ ...prev, status: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => setShowResponseForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Response</Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>
        ) : (
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle>Raise a New Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below to submit a new support ticket. Our team will respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Ticket Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Brief description of your issue"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide details about your issue or request"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setActiveTab("myTickets")}>
                  Cancel
                </Button>
                <Button type="submit">Submit Ticket</Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </main>
    </div>
  )
}

