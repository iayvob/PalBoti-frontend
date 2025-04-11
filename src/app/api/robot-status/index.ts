import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../lib/db"
import type { ApiResponse, RobotStatus } from "../../../lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<RobotStatus>>) {
  try {
    // For simplicity, we're just getting status of our one robot
    // In a real app, you might have multiple robots and would need to handle that
    const robotId = "PB-001"

    // GET method to retrieve robot status
    if (req.method === "GET") {
      const status = await db.getRobotStatus(robotId)

      if (!status) {
        return res.status(404).json({ success: false, error: "Robot status not found" })
      }

      return res.status(200).json({ success: true, data: status })
    }

    // Method not allowed
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    })
  } catch (error) {
    console.error("Error processing robot status request:", error)
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    })
  }
}
