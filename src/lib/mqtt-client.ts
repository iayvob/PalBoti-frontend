import mqtt from "mqtt"
import { updateRobotStatus } from "./prisma-db"
import type { RobotStatus, Task } from "./types"

// MQTT Topics
const TOPICS = {
  ROBOT_STATUS: "robot/status",
  ROBOT_POSITION: "robot/position",
  ROBOT_COMMAND: "robot/command",
  ROBOT_TASK: "robot/task",
}

class MQTTClient {
  private client: mqtt.MqttClient | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectInterval = 5000 // 5 seconds
  private topics: string[] = []
  private messageHandlers: Map<string, ((topic: string, message: Buffer) => void)[]> = new Map()
  private isConnecting = false

  constructor() {
    // Initialize but don't connect yet
  }

  public connect(): Promise<void> {
    if (this.client && this.client.connected) {
      console.log("MQTT client already connected")
      return Promise.resolve()
    }

    if (this.isConnecting) {
      console.log("MQTT client connection in progress")
      return Promise.resolve()
    }

    this.isConnecting = true
    this.reconnectAttempts = 0

    return new Promise((resolve, reject) => {
      try {
        const brokerUrl = process.env.MQTT_BROKER_URL
        const username = process.env.MQTT_USERNAME
        const password = process.env.MQTT_PASSWORD

        if (!brokerUrl) {
          this.isConnecting = false
          return reject(new Error("MQTT_BROKER_URL environment variable is not set"))
        }

        console.log(`Connecting to MQTT broker at ${brokerUrl}...`)

        this.client = mqtt.connect(brokerUrl, {
          username,
          password,
          reconnectPeriod: 0, // We'll handle reconnection manually
          connectTimeout: 10000, // 10 seconds
        })

        this.client.on("connect", () => {
          console.log("Connected to MQTT broker")
          this.reconnectAttempts = 0
          this.isConnecting = false

          // Resubscribe to topics
          this.resubscribe()
          resolve()
        })

        this.client.on("error", (err) => {
          console.error("MQTT connection error:", err)
          if (this.isConnecting) {
            this.isConnecting = false
            reject(err)
          }
        })

        this.client.on("close", () => {
          console.log("MQTT connection closed")
          this.handleDisconnect()
        })

        this.client.on("message", async (topic: string, message: Buffer) => {
          const handlers = this.messageHandlers.get(topic)
          if (handlers) {
            handlers.forEach((handler) => handler(topic, message))
          }

          try {
            console.log(`Received message on topic ${topic}: ${message.toString()}`)

            // Handle robot status updates
            if (topic === TOPICS.ROBOT_STATUS) {
              const statusData = JSON.parse(message.toString()) as Partial<RobotStatus>

              if (statusData.id) {
                await updateRobotStatus(statusData)
                console.log(`Updated robot status for ${statusData.id}`)
              }
            }

            // Handle robot position updates
            if (topic === TOPICS.ROBOT_POSITION) {
              const positionData = JSON.parse(message.toString())

              if (positionData.robotId) {
                await updateRobotStatus({
                  id: positionData.robotId,
                  location: positionData.location,
                })
                console.log(`Updated robot position for ${positionData.robotId} to ${positionData.location}`)
              }
            }
          } catch (error) {
            console.error("Error processing MQTT message:", error)
          }
        })
      } catch (error) {
        this.isConnecting = false
        console.error("Error connecting to MQTT broker:", error)
        reject(error)
      }
    })
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

      setTimeout(() => {
        this.connect().catch((err) => {
          console.error("Reconnection attempt failed:", err)
        })
      }, this.reconnectInterval)
    } else {
      console.error("Max reconnection attempts reached. Giving up.")
    }
  }

  private resubscribe() {
    if (!this.client || !this.client.connected) return

    this.topics.forEach((topic) => {
      this.client!.subscribe(topic, (err) => {
        if (err) {
          console.error(`Error resubscribing to topic ${topic}:`, err)
        } else {
          console.log(`Resubscribed to topic: ${topic}`)
        }
      })
    })
  }

  public subscribe(topic: string, handler: (topic: string, message: Buffer) => void): void {
    if (!this.client) {
      throw new Error("MQTT client not initialized. Call connect() first.")
    }

    if (!this.topics.includes(topic)) {
      this.topics.push(topic)
    }

    // Add the handler
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, [])
    }
    this.messageHandlers.get(topic)!.push(handler)

    // Subscribe to the topic
    if (this.client.connected) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Error subscribing to topic ${topic}:`, err)
        } else {
          console.log(`Subscribed to topic: ${topic}`)
        }
      })
    }
  }

  public publish(topic: string, message: string | object): void {
    if (!this.client || !this.client.connected) {
      throw new Error("MQTT client not connected. Call connect() first.")
    }

    const payload = typeof message === "string" ? message : JSON.stringify(message)

    this.client.publish(topic, payload, (err) => {
      if (err) {
        console.error(`Error publishing to topic ${topic}:`, err)
      } else {
        console.log(`Published to topic: ${topic}`)
      }
    })
  }

  public disconnect(): void {
    if (this.client) {
      this.client.end(true, () => {
        console.log("MQTT client disconnected")
      })
      this.client = null
    }
  }

  // Publish task to MQTT
  public async publishTask(task: Task): Promise<boolean> {
    try {
      // Convert task to a format suitable for the robot
      const robotTask = {
        taskId: task.id,
        type: task.type,
        priority: task.priority,
        source: task.sourceLocation,
        target: task.targetLocation,
        productId: task.productId,
      }

      this.publish(TOPICS.ROBOT_TASK, JSON.stringify(robotTask))
      console.log(`Published task ${task.id} to ${TOPICS.ROBOT_TASK}`)

      return true
    } catch (error) {
      console.error("Error publishing task to MQTT:", error)
      return false
    }
  }

  // Send command to robot
  public async sendRobotCommand(
    robotId: string,
    command: "start" | "stop" | "pause" | "resume" | "charge",
    params?: Record<string, any>,
  ): Promise<boolean> {
    try {
      const commandData = {
        robotId,
        command,
        timestamp: new Date().toISOString(),
        ...params,
      }

      this.publish(TOPICS.ROBOT_COMMAND, JSON.stringify(commandData))
      console.log(`Sent command ${command} to robot ${robotId}`)

      return true
    } catch (error) {
      console.error("Error sending command to robot:", error)
      return false
    }
  }

  // <-- Add a public "on" method to expose event registration
  public on(event: string, listener: (...args: any[]) => void): void {
    if (this.client) {
      this.client.on(event as keyof mqtt.MqttClientEventCallbacks, listener)
    } else {
      console.warn(`MQTT client is not connected yet. Unable to register listener for "${event}".`)
    }
  }
}

// Export a singleton instance
const mqttClient = new MQTTClient()

// Initialize on module import
mqttClient.connect().catch((err) => console.error("Failed to connect on startup:", err))

export default mqttClient