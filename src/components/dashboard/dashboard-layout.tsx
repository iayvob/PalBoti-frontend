"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Navbar from "./navbar"
import Sidebar from "./sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const shadowOpacity = Math.min(scrollPosition / 500, 0.5)
  const shadowStyle = {
    boxShadow: `0 5px 20px rgba(239, 68, 68, ${shadowOpacity})`,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleSidebar={toggleSidebar} style={shadowStyle} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main
          className={`flex-1 p-4 md:p-6 transition-all duration-200 ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}
          style={scrollPosition > 100 ? shadowStyle : undefined}
        >
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
