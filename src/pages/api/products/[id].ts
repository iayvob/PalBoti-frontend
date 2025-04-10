import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../lib/db"
import type { ApiResponse, Product } from "../../../lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Product>>) {
  try {
    // Extract product ID from URL
    const { id } = req.query

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Product ID is required and must be a string",
      })
    }

    // Only allow GET method
    if (req.method === "GET") {
      const product = await db.getProductById(id)

      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" })
      }

      return res.status(200).json({ success: true, data: product })
    }

    // Method not allowed
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    })
  } catch (error) {
    console.error("Error processing product request:", error)
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    })
  }
}
