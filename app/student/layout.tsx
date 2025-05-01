import type React from "react"
import { StudentSidebar } from "@/components/student-sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudentSidebar>{children}</StudentSidebar>
}

