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
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, HelpCircle } from "lucide-react"

interface Ticket {
  id: string
  title: string
  category: string
  status: "open" | "in-progress" | "resolved" | "closed"
  date: string
  description: string
}

const tickets: Ticket[] = [
  {
    id: "T-1001",
    title: "Unable to submit assignment",
    category: "Technical",
    status: "resolved",
    date: "July 20, 2022",
    description: "I'm unable to submit my assignment for CSE 1. The submit button is not working.",
  },
  {
    id: "T-1002",
    title: "Request for deadline extension",
    category: "Academic",
    status: "in-progress",
    date: "July 22, 2022",
    description: "I would like to request an extension for the Machine Learning project due to medical reasons.",
  },
  {
    id: "T-1003",
    title: "Login issues on mobile app",
    category: "Technical",
    status: "open",
    date: "July 24, 2022",
    description: "I'm unable to login to the mobile app. It keeps showing an error message.",
  },
]

export default function TicketRaise() {
  const [activeTab, setActiveTab] = useState<"myTickets" | "newTicket">("myTickets")
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert("Ticket submitted successfully!")
    setFormData({
      title: "",
      category: "",
      description: "",
    })
    setActiveTab("myTickets")
  }

  const getStatusIcon = (status: Ticket["status"]) => {
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

  const getStatusColor = (status: Ticket["status"]) => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName="Virat" userType="student" />

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
              variant={activeTab === "newTicket" ? "default" : "outline"}
              onClick={() => setActiveTab("newTicket")}
            >
              Raise New Ticket
            </Button>
          </div>
        </div>

        {activeTab === "myTickets" ? (
          <div className="space-y-4 animate-fadeIn">
            {tickets.map((ticket) => (
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
                    <span>Category: {ticket.category}</span>
                    <span>Submitted on: {ticket.date}</span>
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
            ))}
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
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide details about your issue"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
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

