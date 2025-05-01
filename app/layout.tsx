import type React from "react"
import type { Metadata } from "next"
import { Inknut_Antiqua } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inknutAntiqua = Inknut_Antiqua({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inknut-antiqua",
})

export const metadata: Metadata = {
  title: "Shastri - Course Management Portal",
  description: "A comprehensive course management system for students and faculty",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inknutAntiqua.variable} font-sans w-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

