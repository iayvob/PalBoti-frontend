import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../lib/db"
import type { ApiResponse, Task, TaskCreationRequest } from "../../../lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Task | Task[]>>) {
  try {
    // GET method to retrieve all tasks
    if (req.method === "GET") {
      const tasks = await db.getTasks()
      return res.status(200).json({ success: true, data: tasks })
    }

    // POST method to create a new task
    if (req.method === "POST") {
      const { type, priority, productId, sourceLocation, targetLocation, robotId } = req.body as TaskCreationRequest

      // Validate required fields
      if (!type || !priority) {
        return res.status(400).json({
          success: false,
          error: "Task type and priority are required",
        })
      }

      // For pickup or delivery tasks, ensure we have product and location info
      if ((type === "pickup" || type === "delivery") && (!productId || !sourceLocation)) {
        return res.status(400).json({
          success: false,
          error: "Product ID and source location are required for pickup/delivery tasks",
        })
      }

      // Create new task
      const newTask = await db.createTask({
        type,
        priority,
        productId,
        sourceLocation,
        targetLocation,
        robotId,
      })

      // Publish task to MQTT topic (will implement this later)
      // await mqttService.publishTask(newTask);

      return res.status(201).json({ success: true, data: newTask })
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` })
  } catch (error) {
    console.error("Error processing task request:", error)
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    })
  }
}
