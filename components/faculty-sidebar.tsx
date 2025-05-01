"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, TicketIcon } from "lucide-react"
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

interface FacultySidebarProps {
  children: React.ReactNode
}

export function FacultySidebar({ children }: FacultySidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/faculty/dashboard",
      active: pathname === "/faculty/dashboard",
    },
    {
      icon: Users,
      label: "Classes",
      href: "/faculty/classes",
      active: pathname === "/faculty/classes",
    },
    {
      icon: FileText,
      label: "Create Assignments",
      href: "/faculty/create-assignments",
      active: pathname === "/faculty/create-assignments",
    },
    {
      icon: TicketIcon,
      label: "Ticket Raise",
      href: "/faculty/ticket-raise",
      active: pathname === "/faculty/ticket-raise",
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

