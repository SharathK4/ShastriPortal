"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TicketCheck, CheckCircle, Clock, AlertCircle, GraduationCap, UserCog } from "lucide-react"
import { useRouter } from "next/navigation"
import ConnectorService from "@/lib/services/connector-service"

export default function TicketsPage() {
  const router = useRouter()
  
  // Use the connector service for ticket data
  const [tickets, setTickets] = useState<any[]>([])
  
  // Load tickets from connector service
  useEffect(() => {
    // Initialize data if needed
    ConnectorService.initializeIfEmpty();
    
    // Get tickets from connector
    const fetchedTickets = ConnectorService.tickets.getAll();
    
    // If no tickets exist yet, create sample tickets
    if (fetchedTickets.length === 0) {
      createSampleTickets();
    } else {
      setTickets(fetchedTickets);
    }
    
    // Listen for ticket changes
    const unsubscribe = ConnectorService.addChangeListener((dataType, data) => {
      if (dataType === 'tickets') {
        setTickets(data);
      }
    });
    
    // Clean up listener
    return () => unsubscribe();
  }, []);
  
  // Create sample tickets if none exist
  const createSampleTickets = () => {
    const sampleTickets = [
      {
        id: "TKT1001",
        title: "Unable to upload assignment",
        description: "Students reporting issues when uploading PDF assignments.",
        status: "open" as const,
        createdAt: new Date("2023-05-01T10:30:00Z").toISOString(),
        portalType: "faculty" as const,
        priority: "high" as const,
        category: "Technical",
        createdBy: "FAC1001",
        responses: [],
        assignedTo: "ADMIN001"
      },
      {
        id: "TKT1002",
        title: "Grade discrepancy",
        description: "There's a discrepancy in my assignment grades.",
        status: "in-progress" as const,
        createdAt: new Date("2023-05-02T14:15:00Z").toISOString(),
        portalType: "student" as const,
        priority: "medium" as const,
        category: "Academics",
        createdBy: "STU2001",
        responses: [],
        assignedTo: "ADMIN001"
      },
      {
        id: "TKT1003",
        title: "Course materials not visible",
        description: "Students cannot see uploaded course materials.",
        status: "in-progress" as const,
        createdAt: new Date("2023-05-03T09:45:00Z").toISOString(),
        portalType: "faculty" as const,
        priority: "high" as const,
        category: "Technical",
        createdBy: "FAC1002",
        responses: [],
        assignedTo: "ADMIN002"
      },
      {
        id: "TKT1004",
        title: "Access to new course",
        description: "Need access to newly added course.",
        status: "resolved" as const,
        createdAt: new Date("2023-04-28T11:20:00Z").toISOString(),
        portalType: "student" as const,
        priority: "low" as const,
        category: "Permissions",
        createdBy: "STU2002",
        responses: [],
        assignedTo: "ADMIN001"
      },
      {
        id: "TKT1005",
        title: "Notification settings",
        description: "Need to adjust notification settings for assignments.",
        status: "open" as const,
        createdAt: new Date("2023-05-04T13:10:00Z").toISOString(),
        portalType: "student" as const,
        priority: "medium" as const,
        category: "Technical",
        createdBy: "STU2003",
        responses: [],
        assignedTo: "ADMIN002"
      },
      {
        id: "TKT1006",
        title: "Assignment deadline extension",
        description: "Requesting deadline extension for all students.",
        status: "resolved" as const,
        createdAt: new Date("2023-04-25T15:30:00Z").toISOString(),
        portalType: "faculty" as const,
        priority: "medium" as const,
        category: "Academics",
        createdBy: "FAC1003",
        responses: [],
        assignedTo: "ADMIN001"
      },
    ];
    
    // Add sample tickets to connector service
    sampleTickets.forEach(ticket => {
      ConnectorService.tickets.create(ticket);
    });
    
    // Update state
    setTickets(sampleTickets);
  };

  // Filter tickets by source and status
  const getFilteredTickets = (source: "faculty" | "student", status: "open" | "resolved" | "in-progress") => {
    return tickets.filter(ticket => 
      ticket.portalType === source && 
      ticket.status === status
    );
  }

  // Get counts for badge displays
  const getCounts = (source: "faculty" | "student", status: "open" | "resolved" | "in-progress") => {
    return getFilteredTickets(source, status).length;
  }

  // Navigate to ticket details
  const navigateToTicketDetails = (ticketId: string) => {
    router.push(`/admin/tickets/${ticketId}`);
  }

  // Update ticket status
  const updateTicketStatus = (ticketId: string, newStatus: "open" | "resolved" | "in-progress") => {
    ConnectorService.tickets.updateStatus(ticketId, newStatus);
  }

  // Function to get priority badge color
  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Low</Badge>
      case "medium":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Medium</Badge>
      case "high":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">High</Badge>
    }
  }

  // Status icon component
  const StatusIcon = ({ status }: { status: "open" | "resolved" | "in-progress" }) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  // Ticket list component
  const TicketList = ({ tickets }: { tickets: any[] }) => {
    if (tickets.length === 0) {
      return <p className="text-center text-muted-foreground py-6">No tickets found.</p>
    }

    return (
      <div className="space-y-4">
        {tickets.map(ticket => (
          <Card key={ticket.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <StatusIcon status={ticket.status} />
                  <CardTitle className="text-base">{ticket.title}</CardTitle>
                </div>
                {getPriorityBadge(ticket.priority)}
              </div>
              <CardDescription className="flex items-center gap-1">
                <span>From: {ticket.createdBy}</span>
                <span className="mx-1">•</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm pb-2">
              <p>{ticket.description}</p>
            </CardContent>
            <CardFooter className="border-t pt-2 pb-2 flex justify-between bg-slate-50">
              <div className="text-xs text-muted-foreground">Ticket ID: {ticket.id}</div>
              <Button variant="ghost" size="sm" onClick={() => navigateToTicketDetails(ticket.id)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Ticket Management</h1>
        
        <Tabs defaultValue="faculty" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Faculty Tickets
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student Tickets
            </TabsTrigger>
          </TabsList>
          
          {/* Faculty Tickets */}
          <TabsContent value="faculty">
            <Tabs defaultValue="open">
              <TabsList className="mb-4">
                <TabsTrigger value="open" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  New
                  <Badge className="ml-1">{getCounts("faculty", "open")}</Badge>
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  In Progress
                  <Badge className="ml-1">{getCounts("faculty", "in-progress")}</Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Resolved
                  <Badge className="ml-1">{getCounts("faculty", "resolved")}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="open">
                <TicketList tickets={getFilteredTickets("faculty", "open")} />
              </TabsContent>
              
              <TabsContent value="in-progress">
                <TicketList tickets={getFilteredTickets("faculty", "in-progress")} />
              </TabsContent>
              
              <TabsContent value="resolved">
                <TicketList tickets={getFilteredTickets("faculty", "resolved")} />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Student Tickets */}
          <TabsContent value="student">
            <Tabs defaultValue="open">
              <TabsList className="mb-4">
                <TabsTrigger value="open" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  New
                  <Badge className="ml-1">{getCounts("student", "open")}</Badge>
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  In Progress
                  <Badge className="ml-1">{getCounts("student", "in-progress")}</Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Resolved
                  <Badge className="ml-1">{getCounts("student", "resolved")}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="open">
                <TicketList tickets={getFilteredTickets("student", "open")} />
              </TabsContent>
              
              <TabsContent value="in-progress">
                <TicketList tickets={getFilteredTickets("student", "in-progress")} />
              </TabsContent>
              
              <TabsContent value="resolved">
                <TicketList tickets={getFilteredTickets("student", "resolved")} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 