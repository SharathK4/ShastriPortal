"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Clock, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

// Mock ticket data interface
interface Ticket {
  id: string
  title: string
  description: string
  status: "new" | "solved" | "pending"
  createdAt: string
  source: "faculty" | "student"
  priority: "low" | "medium" | "high"
  creator: {
    id: string
    name: string
    email: string
  }
  updates?: {
    date: string
    message: string
    updatedBy: string
  }[]
}

// Mock tickets data
const mockTickets: Ticket[] = [
  {
    id: "TKT1001",
    title: "Unable to upload assignment",
    description: "Students reporting issues when uploading PDF assignments. The system shows an error message saying 'File format not supported' even though they are using PDF files as required. This is affecting multiple students across different sections.",
    status: "new",
    createdAt: "2023-05-01T10:30:00Z",
    source: "faculty",
    priority: "high",
    creator: {
      id: "FAC1001",
      name: "Dr. Sharma",
      email: "sharma@example.com"
    },
    updates: [
      {
        date: "2023-05-01T14:20:00Z",
        message: "Investigating the issue. Will update soon.",
        updatedBy: "Admin User"
      }
    ]
  },
  {
    id: "TKT1002",
    title: "Grade discrepancy",
    description: "There's a discrepancy in my assignment grades. The calculated total doesn't match the displayed grade.",
    status: "pending",
    createdAt: "2023-05-02T14:15:00Z",
    source: "student",
    priority: "medium",
    creator: {
      id: "STU2001",
      name: "Virat",
      email: "virat@example.com"
    },
    updates: [
      {
        date: "2023-05-02T16:00:00Z",
        message: "Checking with the faculty member about the grading calculation.",
        updatedBy: "Admin User"
      }
    ]
  },
  {
    id: "TKT1003",
    title: "Course materials not visible",
    description: "Students cannot see uploaded course materials. The files were uploaded yesterday but are not appearing in the student view.",
    status: "pending",
    createdAt: "2023-05-03T09:45:00Z",
    source: "faculty",
    priority: "high",
    creator: {
      id: "FAC1002",
      name: "Dr. Patel",
      email: "patel@example.com"
    },
    updates: []
  },
  {
    id: "TKT1004",
    title: "Access to new course",
    description: "Need access to newly added course.",
    status: "solved",
    createdAt: "2023-04-28T11:20:00Z",
    source: "student",
    priority: "low",
    creator: {
      id: "STU2002",
      name: "Rohit",
      email: "rohit@example.com"
    },
    updates: [
      {
        date: "2023-04-28T13:30:00Z",
        message: "Access granted to the requested course.",
        updatedBy: "Admin User"
      }
    ]
  },
  {
    id: "TKT1005",
    title: "Notification settings",
    description: "Need to adjust notification settings for assignments.",
    status: "new",
    createdAt: "2023-05-04T13:10:00Z",
    source: "student",
    priority: "medium",
    creator: {
      id: "STU2003",
      name: "Hardik",
      email: "hardik@example.com"
    },
    updates: []
  },
  {
    id: "TKT1006",
    title: "Assignment deadline extension",
    description: "Requesting deadline extension for all students.",
    status: "solved",
    createdAt: "2023-04-25T15:30:00Z",
    source: "faculty",
    priority: "medium",
    creator: {
      id: "FAC1003",
      name: "Dr. Gupta",
      email: "gupta@example.com"
    },
    updates: [
      {
        date: "2023-04-26T09:15:00Z",
        message: "Deadline extended by one week as requested.",
        updatedBy: "Admin User"
      }
    ]
  },
]

export default function TicketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [response, setResponse] = useState("")
  const [status, setStatus] = useState<"new" | "solved" | "pending">("new")
  
  // Find the ticket by ID from the mock data
  useEffect(() => {
    if (params.id) {
      const ticketId = params.id as string
      const foundTicket = mockTickets.find(t => t.id === ticketId)
      
      if (foundTicket) {
        setTicket(foundTicket)
        setStatus(foundTicket.status)
      } else {
        // Ticket not found, redirect back to tickets page
        router.push("/admin/tickets")
      }
    }
  }, [params.id, router])
  
  // Handle submitting a response
  const handleSubmitResponse = () => {
    if (!response.trim()) return
    
    // In a real app, this would send the data to an API
    alert(`Response submitted: ${response}\nStatus updated to: ${status}`)
    
    // Clear response field after submission
    setResponse("")
    
    // Redirect back to tickets list
    router.push("/admin/tickets")
  }
  
  // Get status badge color
  const StatusBadge = ({ status }: { status: "new" | "solved" | "pending" }) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            New
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "solved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Solved
          </Badge>
        )
    }
  }
  
  // Get priority badge
  const PriorityBadge = ({ priority }: { priority: "low" | "medium" | "high" }) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Low Priority</Badge>
      case "medium":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Medium Priority</Badge>
      case "high":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">High Priority</Badge>
    }
  }

  if (!ticket) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/admin/tickets">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Ticket Details</h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2">
              <CardTitle>{ticket.title}</CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span>From: {ticket.creator.name} ({ticket.source})</span>
                <span className="hidden sm:inline">•</span>
                <span>ID: {ticket.id}</span>
                <span className="hidden sm:inline">•</span>
                <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-slate-50">
              <p>{ticket.description}</p>
            </div>
            
            {ticket.updates && ticket.updates.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Ticket Updates</h3>
                <div className="space-y-3">
                  {ticket.updates.map((update, index) => (
                    <div key={index} className="p-3 border rounded-md bg-slate-50">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{update.updatedBy}</span>
                        <span className="text-muted-foreground">{new Date(update.date).toLocaleString()}</span>
                      </div>
                      <p>{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3">Respond to Ticket</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={status} onValueChange={(value: "new" | "solved" | "pending") => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="solved">Solved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea 
                    id="response"
                    placeholder="Type your response here..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button 
              onClick={handleSubmitResponse}
              className="gap-2"
              disabled={!response.trim()}
            >
              <Send className="h-4 w-4" />
              Submit Response
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 