"use client"

import { useState, useEffect } from "react"
import io from "socket.io-client"
import type { RobotStatus } from "../lib/types"

const useRobotStatus = (robotId: string) => {
  const [status, setStatus] = useState<RobotStatus | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let socket: any

    // Fetch initial robot status
    const fetchInitialStatus = async () => {
      try {
        const response = await fetch(`/api/robot-status`)

        if (!response.ok) {
          throw new Error("Failed to fetch robot status")
        }

        const data = await response.json()
        if (data.success && data.data) {
          setStatus(data.data)
        } else {
          throw new Error(data.error || "Unknown error fetching robot status")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    // Connect to socket for real-time updates
    const connectSocket = () => {
      // Initialize socket connection
      socket = io()

      // Subscribe to robot status updates
      socket.emit("subscribe-robot-status", robotId)

      // Handle robot status updates
      socket.on("robot-status-update", (updatedStatus: RobotStatus) => {
        if (updatedStatus.id === robotId) {
          setStatus(updatedStatus)
        }
      })

      // Handle connection errors
      socket.on("connect_error", (err: Error) => {
        console.error("Socket connection error:", err)
        setError("Failed to connect to real-time updates")
      })
    }

    fetchInitialStatus()
    connectSocket()

    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [robotId])

  return { status, loading, error }
}

export default useRobotStatus
