"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  TicketCheck, 
  GraduationCap, 
  UserCog,
  BookOpen,
  Users,
  School,
  Settings,
  Calendar,
} from "lucide-react"

interface SidebarLink {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
}

export function AdminSidebar() {
  const pathname = usePathname()
  
  const mainLinks: SidebarLink[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      description: "Overview and statistics"
    },
    {
      name: "Tickets",
      href: "/admin/tickets",
      icon: <TicketCheck className="h-5 w-5" />,
      description: "Manage faculty and student tickets"
    }
  ]
  
  const studentLinks: SidebarLink[] = [
    {
      name: "Students",
      href: "/admin/students",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      name: "Courses",
      href: "/admin/students/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Batches",
      href: "/admin/students/batches",
      icon: <Users className="h-5 w-5" />,
    }
  ]
  
  const facultyLinks: SidebarLink[] = [
    {
      name: "Faculty",
      href: "/admin/faculty",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: "Departments",
      href: "/admin/departments",
      icon: <School className="h-5 w-5" />,
    },
    {
      name: "Faculty Schedule",
      href: "/admin/faculty/schedule",
      icon: <Calendar className="h-5 w-5" />,
    }
  ]
  
  const settingsLinks: SidebarLink[] = [
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    }
  ]
  
  function getLinkClassName(href: string) {
    const isActive = pathname === href || pathname.startsWith(`${href}/`)
    return `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted text-muted-foreground hover:text-foreground"
    }`
  }
  
  function renderLinks(links: SidebarLink[]) {
    return links.map((link) => (
      <Link 
        key={link.href}
        href={link.href}
        className={getLinkClassName(link.href)}
        title={link.description}
      >
        {link.icon}
        {link.name}
      </Link>
    ))
  }

  return (
    <div className="flex h-screen flex-col border-r py-4">
      <div className="px-4 py-2">
        <h2 className="px-2 text-lg font-semibold tracking-tight mb-2">
          Admin Portal
        </h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid grid-rows-[auto_1fr_auto] gap-6 px-2 group">
          <div className="flex flex-col gap-1">
            <h3 className="px-2 text-xs font-medium text-muted-foreground mb-1">Overview</h3>
            {renderLinks(mainLinks)}
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="px-2 text-xs font-medium text-muted-foreground mb-1">Student Management</h3>
              {renderLinks(studentLinks)}
            </div>
            
            <div className="flex flex-col gap-1">
              <h3 className="px-2 text-xs font-medium text-muted-foreground mb-1">Faculty Management</h3>
              {renderLinks(facultyLinks)}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            {renderLinks(settingsLinks)}
          </div>
        </nav>
      </div>
    </div>
  )
} 