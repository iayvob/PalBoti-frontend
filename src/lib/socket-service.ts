import initMqttClient from "./mqtt-client"
import io from "socket.io-client"
import type { RobotStatus, Task } from "./types"

// Socket.io client instance
let socketClient: any = null

// Fallback socket service in case of errors
const fallbackSocketService = {
  emit: (event: string, data: any) => {
    console.warn(`Fallback socket service: Event '${event}' with data`, data)
  },
}

// Get or initialize socket client with error handling
const getSocketServerInstance = () => {
  if (!socketClient) {
    try {
      // In a real production app, this would be the actual server URL
      socketClient = io("http://localhost:3000/api/socket")

      socketClient.on("connect", () => {
        console.log("Connected to socket server")
      })

      socketClient.on("error", (err: any) => {
        console.error("Socket client error:", err)
      })

      socketClient.on("disconnect", () => {
        console.log("Disconnected from socket server")
      })
    } catch (error) {
      console.error("Error initializing socket client:", error)
      // Return fallback service if initialization fails
      return fallbackSocketService
    }
  }
  return socketClient
}

// Function to emit robot status updates via socket
export const emitRobotStatusUpdate = (robotStatus: RobotStatus) => {
  const socket = getSocketServerInstance()
  if (socket) {
    socket.emit("robot-status-update", robotStatus)
    console.log(`Emitted robot status update for ${robotStatus.id}`)
  }
}

// Function to emit task updates via socket
export const emitTaskUpdate = (task: Task) => {
  const socket = getSocketServerInstance()
  if (socket) {
    socket.emit("task-update", task)
    console.log(`Emitted task update for ${task.id}`)
  }
}

// Connect MQTT client to emit socket events
export const connectMqttToSocket = () => {
  const mqttClient = initMqttClient // Note: Use the instance directly, don't call it as a function

  mqttClient.on("message", (topic: string, message: Buffer) => {
    try {
      console.log(`Received MQTT message on topic ${topic}`)

      if (topic === "robot/status") {
        const statusData = JSON.parse(message.toString())
        emitRobotStatusUpdate(statusData)
      }

      if (topic === "robot/task") {
        const taskData = JSON.parse(message.toString())
        emitTaskUpdate(taskData)
      }
    } catch (error) {
      console.error("Error processing MQTT message for socket:", error)
    }
  })
}

// Initialize on module import
connectMqttToSocket()

export default {
  emitRobotStatusUpdate,
  emitTaskUpdate,
}