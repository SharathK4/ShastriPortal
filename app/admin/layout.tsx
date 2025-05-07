"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  // Protect admin routes by redirecting non-admin users
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login/admin")
      } else if (user?.userType !== "admin") {
        // Redirect to appropriate dashboard based on user type
        if (user?.userType === "student") {
          router.push("/student/dashboard")
        } else if (user?.userType === "faculty") {
          router.push("/faculty/dashboard")
        } else {
          router.push("/")
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  // If loading or not authenticated, show nothing
  if (isLoading || !isAuthenticated || user?.userType !== "admin") {
    return null
  }

  return (
    <div className="flex">
      <aside className="fixed hidden md:flex h-screen w-64 flex-col">
        <AdminSidebar />
      </aside>
      <main className="flex-1 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
} 