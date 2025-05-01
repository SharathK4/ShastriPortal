import type React from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FacultySidebar>{children}</FacultySidebar>
}

