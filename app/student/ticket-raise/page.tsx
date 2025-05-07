"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  getTickets,
  createTicket,
  updateTicket,
  Ticket,
  addNotification
} from "@/lib/student-storage"

export default function StudentTicket() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
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
  
  // Load tickets from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const storedTickets = getTickets()
      setTickets(storedTickets)
    }
  }, [isAuthenticated])
  
  // Handle creating a new ticket
  const handleSubmitTicket = () => {
    if (!newTicket.title || !newTicket.description) return
    
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: newTicket.priority,
    }
    
    const updatedTickets = createTicket(ticket)
    setTickets(updatedTickets)
    
    // Reset form
    setNewTicket({
      title: "",
      description: "",
      priority: "medium",
    })
    
    // Add a notification for the ticket creation
    addNotification({
      id: `ticket-${Date.now()}`,
      title: "Ticket Created",
      message: `Your ticket "${ticket.title}" has been created successfully`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'ticket'
    })
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500 text-white'
      case 'in-progress':
        return 'bg-yellow-500 text-white'
      case 'resolved':
        return 'bg-green-500 text-white'
      case 'closed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-200'
    }
  }
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-200'
    }
  }
  
  // Filter tickets by status
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress')
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={user?.name || "Student"} userType="student" />

      <main className="flex-1 p-6 space-y-8">
        <h1 className="text-3xl font-bold">Support Tickets</h1>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="create">Create Ticket</TabsTrigger>
            <TabsTrigger value="active">Active Tickets</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 animate-fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Create New Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Ticket Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of your issue"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: "low" | "medium" | "high") => 
                      setNewTicket({ ...newTicket, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
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
                    placeholder="Detailed description of your issue"
                    className="min-h-[150px]"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSubmitTicket}
                  disabled={!newTicket.title || !newTicket.description}
                >
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6 animate-fadeIn">
            {openTickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No active tickets found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {openTickets.map((ticket) => (
                  <Card key={ticket.id} className="animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created: {formatDate(ticket.createdAt)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-secondary/20 rounded-md">
                          <p className="whitespace-pre-line">{ticket.description}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-6 animate-fadeIn">
            {resolvedTickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">No resolved tickets found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resolvedTickets.map((ticket) => (
                  <Card key={ticket.id} className="animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created: {formatDate(ticket.createdAt)}
                              {ticket.status === 'resolved' && (
                                <> • Resolved: {formatDate(ticket.updatedAt)}</>
                              )}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-secondary/20 rounded-md">
                          <p className="whitespace-pre-line">{ticket.description}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

