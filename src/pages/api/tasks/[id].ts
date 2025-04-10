import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../lib/db"
import type { ApiResponse, Task } from "../../../lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Task>>) {
  try {
    // Extract task ID from URL
    const { id } = req.query

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Task ID is required and must be a string",
      })
    }

    // GET method to retrieve a specific task
    if (req.method === "GET") {
      const task = await db.getTaskById(id)

      if (!task) {
        return res.status(404).json({ success: false, error: "Task not found" })
      }

      return res.status(200).json({ success: true, data: task })
    }

    // PATCH method to update task status
    if (req.method === "PATCH") {
      const { status } = req.body

      if (!status) {
        return res.status(400).json({
          success: false,
          error: "Task status is required for updates",
        })
      }

      const updatedTask = await db.updateTaskStatus(id, status)

      if (!updatedTask) {
        return res.status(404).json({ success: false, error: "Task not found" })
      }

      return res.status(200).json({ success: true, data: updatedTask })
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "PATCH"])
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    })
  } catch (error) {
    console.error("Error processing task request:", error)
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    })
  }
}
