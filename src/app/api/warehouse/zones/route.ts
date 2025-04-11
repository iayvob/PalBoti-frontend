import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real application, this would fetch from the database
    // For now, we'll use the same data structure but fetch from a Zone model
    // that would need to be added to the Prisma schema

    // Check if the Zone model exists in Prisma
    let zones
    try {
      // Try to fetch zones from the database
      zones = await prisma.zone.findMany()
    } catch (e) {
      // If the Zone model doesn't exist, use mock data
      zones = [
        { id: "A1", type: "storage", status: "normal", items: 120, capacity: 150 },
        { id: "A2", type: "storage", status: "normal", items: 95, capacity: 150 },
        { id: "A3", type: "storage", status: "attention", items: 150, capacity: 150 },
        { id: "B1", type: "picking", status: "normal", items: 45, capacity: 75 },
        { id: "B2", type: "picking", status: "normal", items: 30, capacity: 75 },
        { id: "B3", type: "picking", status: "empty", items: 0, capacity: 75 },
        { id: "C1", type: "shipping", status: "normal", items: 75, capacity: 100 },
        { id: "C2", type: "shipping", status: "busy", items: 200, capacity: 200 },
        { id: "C3", type: "receiving", status: "normal", items: 60, capacity: 100 },
      ]
    }

    return NextResponse.json({ zones })
  } catch (error) {
    console.error("Error fetching warehouse zones:", error)
    return NextResponse.json({ error: "Failed to fetch warehouse zones" }, { status: 500 })
  }
}
