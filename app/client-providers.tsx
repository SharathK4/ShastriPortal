"use client"

import React, { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { PreferencesProvider } from "@/lib/preferences-context"
import { SyncProvider } from "@/components/sync-provider"
import initializeData from "@/lib/utils/initialize-data"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Initialize data when the app loads
  useEffect(() => {
    initializeData();
  }, []);
  
  return (
    <AuthProvider>
      <PreferencesProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SyncProvider>
            {children}
          </SyncProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </AuthProvider>
  )
} 