"use client"

import type React from "react"

import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Bell, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface HeaderProps {
  userName: string
  userType: "student" | "faculty" | "admin"
}

export function Header({ userName, userType }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-background border-b p-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            <span className="text-primary">Shastri</span> Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9 rounded-full overflow-hidden focus-visible:ring-offset-0"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-muted-foreground">
                  {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </div>
              </div>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

