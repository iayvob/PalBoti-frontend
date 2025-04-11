import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../lib/db"
import type { ApiResponse, Product } from "../../../lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Product | Product[]>>) {
  try {
    // Only allow GET method for products endpoint
    if (req.method === "GET") {
      // Get query parameters for filtering
      const { category, status, tag } = req.query

      // Get all products
      let products = await db.getProducts()

      // Apply filters if provided
      if (category && typeof category === "string") {
        products = products.filter((p) => p.category === category)
      }

      if (status && typeof status === "string") {
        products = products.filter((p) => p.status === status)
      }

      if (tag && typeof tag === "string") {
        products = products.filter((p) => p.tags.includes(tag))
      }

      return res.status(200).json({ success: true, data: products })
    }

    // Method not allowed
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    })
  } catch (error) {
    console.error("Error processing products request:", error)
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    })
  }
}
