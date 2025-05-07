"use client"

import { useEffect, ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { autoSyncAssignments } from "@/lib/assignment-connector"
import { autoSyncSubmissions } from "@/lib/submission-connector"

// Configuration for sync intervals
const SYNC_INTERVALS = {
  // Perform sync every 60 seconds
  ASSIGNMENTS: 60 * 1000,
  SUBMISSIONS: 60 * 1000,
}

interface SyncProviderProps {
  children: ReactNode
}

export function SyncProvider({ children }: SyncProviderProps) {
  const { isAuthenticated, user } = useAuth()

  // Set up periodic sync for assignments and submissions
  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') {
      return
    }

    // Initial sync
    if (user?.userType === 'student') {
      // Students need to sync faculty assignments
      autoSyncAssignments()
    } else if (user?.userType === 'faculty') {
      // Faculty need to sync student submissions
      autoSyncSubmissions()
    }

    // Set up interval for continued syncing
    const assignmentSyncInterval = setInterval(() => {
      if (user?.userType === 'student') {
        autoSyncAssignments()
      }
    }, SYNC_INTERVALS.ASSIGNMENTS)

    const submissionSyncInterval = setInterval(() => {
      if (user?.userType === 'faculty') {
        autoSyncSubmissions()
      }
    }, SYNC_INTERVALS.SUBMISSIONS)

    // Clean up intervals when component unmounts
    return () => {
      clearInterval(assignmentSyncInterval)
      clearInterval(submissionSyncInterval)
    }
  }, [isAuthenticated, user])

  // Just render children; this component doesn't add any UI
  return <>{children}</>
} 