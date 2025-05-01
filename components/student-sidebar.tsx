"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, FileText, BarChart, TicketIcon } from "lucide-react"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface StudentSidebarProps {
  children: React.ReactNode
}

export function StudentSidebar({ children }: StudentSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/student/dashboard",
      active: pathname === "/student/dashboard",
    },
    {
      icon: BookOpen,
      label: "Courses",
      href: "/student/courses",
      active: pathname === "/student/courses",
    },
    {
      icon: FileText,
      label: "Assignments",
      href: "/student/assignments",
      active: pathname.includes("/student/assignments"),
    },
    {
      icon: BarChart,
      label: "Grades",
      href: "/student/grades",
      active: pathname === "/student/grades",
    },
    {
      icon: TicketIcon,
      label: "Ticket Raise",
      href: "/student/ticket-raise",
      active: pathname === "/student/ticket-raise",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarHeader className="flex items-center p-4">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-shastri text-xl font-semibold">Shastri</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={route.active}>
                    <Link href={route.href} className="flex items-center">
                      <route.icon className="mr-2 h-5 w-5" />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Shastri Portal</div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 w-full overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  )
}

