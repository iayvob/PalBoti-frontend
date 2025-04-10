import mqttClient from "../lib/mqtt-client"
import type { RobotStatus, Task } from "../lib/types"

// Configuration
const ROBOT_ID = "PB-001"
const ROBOT_NAME = "PalBot 1"
const UPDATE_INTERVAL = 5000 // 5 seconds
const TASK_COMPLETION_TIME = 30000 // 30 seconds
const BATTERY_DRAIN_RATE = 0.05 // % per update when active
const BATTERY_DRAIN_RATE_IDLE = 0.01 // % per update when idle
const MQTT_TOPIC_STATUS = "warehouse/robots/status"
const MQTT_TOPIC_TASKS = "warehouse/tasks"

// Initial robot state
let robotStatus: RobotStatus = {
  id: ROBOT_ID,
  name: ROBOT_NAME,
  status: "idle",
  battery: 100,
  location: "A1",
  load: null,
  lastUpdated: new Date(),
  currentTaskId: null,
}

// Available warehouse locations
const locations = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]

// Task queue
let taskQueue: Task[] = []
let currentTask: Task | null = null
let taskProgress = 0

// Connect to MQTT broker
async function connectMQTT() {
  try {
    await mqttClient.connect()
    console.log("Connected to MQTT broker")

    // Subscribe to task topic
    mqttClient.subscribe(MQTT_TOPIC_TASKS, handleTaskMessage)
    console.log(`Subscribed to topic: ${MQTT_TOPIC_TASKS}`)

    // Start the simulation
    startSimulation()
  } catch (error) {
    console.error("Failed to connect to MQTT broker:", error)
    process.exit(1)
  }
}

// Handle incoming task messages
function handleTaskMessage(topic: string, message: Buffer) {
  try {
    const taskMessage = JSON.parse(message.toString())
    console.log("Received task message:", taskMessage)

    if (taskMessage.type === "new_task") {
      const task = taskMessage.task as Task
      if (task.robotId === ROBOT_ID || !task.robotId) {
        console.log(`Adding task ${task.id} to queue`)
        taskQueue.push(task)
      }
    } else if (taskMessage.type === "cancel_task") {
      const taskId = taskMessage.taskId
      if (currentTask && currentTask.id === taskId) {
        console.log(`Cancelling current task ${taskId}`)
        currentTask = null
        taskProgress = 0
        updateRobotStatus("idle")
      } else {
        console.log(`Removing task ${taskId} from queue`)
        taskQueue = taskQueue.filter((t) => t.id !== taskId)
      }
    }
  } catch (error) {
    console.error("Error handling task message:", error)
  }
}

// Update robot status
function updateRobotStatus(status: RobotStatus["status"], location?: string, load?: any) {
  robotStatus = {
    ...robotStatus,
    status,
    location: location || robotStatus.location,
    load: load || robotStatus.load,
    lastUpdated: new Date(),
    currentTaskId: currentTask?.id || null,
  }

  // Publish status update to MQTT
  mqttClient.publish(MQTT_TOPIC_STATUS, robotStatus)
  console.log(`Published robot status: ${status}`)
}

// Simulate battery drain
function updateBattery() {
  const drainRate = robotStatus.status === "idle" ? BATTERY_DRAIN_RATE_IDLE : BATTERY_DRAIN_RATE
  robotStatus.battery = Math.max(0, robotStatus.battery - drainRate)

  // If battery is critically low, go to charging
  if (robotStatus.battery < 10 && robotStatus.status !== "charging") {
    console.log("Battery low, robot needs charging")
    if (currentTask) {
      console.log(`Pausing task ${currentTask.id} for charging`)
      taskQueue.unshift(currentTask)
      currentTask = null
      taskProgress = 0
    }
    updateRobotStatus("charging")
  }

  // If charging, increase battery
  if (robotStatus.status === "charging") {
    robotStatus.battery = Math.min(100, robotStatus.battery + 0.5)
    if (robotStatus.battery >= 95) {
      console.log("Battery charged, resuming operations")
      updateRobotStatus("idle")
    }
  }
}

// Process the next task in the queue
function processNextTask() {
  if (currentTask) return // Already processing a task
  if (taskQueue.length === 0) return // No tasks in queue
  if (robotStatus.status === "charging") return // Currently charging
  if (robotStatus.battery < 15) return // Battery too low

  // Get the next task
  currentTask = taskQueue.shift() || null
  if (!currentTask) return

  console.log(`Starting task ${currentTask.id}: ${currentTask.type}`)
  taskProgress = 0

  // Update robot status based on task type
  switch (currentTask.type) {
    case "pickup":
      updateRobotStatus("moving", currentTask.sourceLocation)
      break
    case "delivery":
      updateRobotStatus("moving", currentTask.sourceLocation)
      break
    case "charging":
      updateRobotStatus("charging")
      break
    case "scan":
      updateRobotStatus("scanning", currentTask.sourceLocation)
      break
    default:
      updateRobotStatus("active")
  }
}

// Simulate task progress
function updateTaskProgress() {
  if (!currentTask) return

  taskProgress += (UPDATE_INTERVAL / TASK_COMPLETION_TIME) * 100

  // Task state transitions
  if (taskProgress >= 50 && robotStatus.status === "moving") {
    // If we're moving and halfway done, we've reached the source
    if (currentTask.type === "pickup") {
      console.log(`Reached pickup location ${currentTask.sourceLocation}, picking up product ${currentTask.productId}`)
      updateRobotStatus("loading", currentTask.sourceLocation, { productId: currentTask.productId })
    } else if (currentTask.type === "delivery" && currentTask.targetLocation) {
      console.log(`Picked up product ${currentTask.productId}, moving to ${currentTask.targetLocation}`)
      updateRobotStatus("moving", currentTask.targetLocation, { productId: currentTask.productId })
    }
  }

  // Task completion
  if (taskProgress >= 100) {
    console.log(`Completed task ${currentTask.id}`)

    // Publish task completion
    mqttClient.publish(`${MQTT_TOPIC_TASKS}/completed`, {
      taskId: currentTask.id,
      completedAt: new Date(),
      status: "completed",
    })

    // Reset state
    if (currentTask.type === "delivery") {
      // After delivery, we've dropped off the load
      updateRobotStatus("idle", currentTask.targetLocation, null)
    } else {
      updateRobotStatus("idle")
    }

    currentTask = null
    taskProgress = 0
  }
}

// Main simulation loop
function simulationLoop() {
  // Update battery
  updateBattery()

  // Process tasks
  if (!currentTask) {
    processNextTask()
  } else {
    updateTaskProgress()
  }

  // Randomly generate a task if queue is empty (10% chance)
  if (taskQueue.length === 0 && !currentTask && Math.random() < 0.1) {
    generateRandomTask()
  }

  // Always publish status updates
  mqttClient.publish(MQTT_TOPIC_STATUS, robotStatus)
}

// Generate a random task for simulation purposes
function generateRandomTask() {
  const taskTypes: Task["type"][] = ["pickup", "delivery", "scan"]
  const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
  const sourceLocation = locations[Math.floor(Math.random() * locations.length)]
  let targetLocation = null

  if (taskType === "delivery") {
    // Make sure target is different from source
    do {
      targetLocation = locations[Math.floor(Math.random() * locations.length)]
    } while (targetLocation === sourceLocation)
  }

  const task: Task = {
    id: `T-${Math.floor(Math.random() * 1000)}`,
    type: taskType,
    status: "pending",
    priority: Math.random() < 0.3 ? "high" : Math.random() < 0.7 ? "medium" : "low",
    productId: `P-${Math.floor(Math.random() * 1000)}`,
    sourceLocation,
    targetLocation: targetLocation ?? undefined,
    robotId: ROBOT_ID,
    createdAt: new Date(),
  }

  console.log(`Generated random task: ${task.id} (${task.type})`)
  taskQueue.push(task)
}

// Start the simulation
function startSimulation() {
  console.log("Starting robot simulation...")

  // Initial status update
  mqttClient.publish(MQTT_TOPIC_STATUS, robotStatus)

  // Run the simulation loop at regular intervals
  setInterval(simulationLoop, UPDATE_INTERVAL)

  console.log(`Robot simulator running. Publishing to ${MQTT_TOPIC_STATUS}`)
}

// Start the application
connectMQTT().catch((error) => {
  console.error("Failed to start robot simulator:", error)
  process.exit(1)
})
