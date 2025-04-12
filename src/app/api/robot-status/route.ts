// /api/robot-status/route.ts
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const robot = await prisma.robot.findFirst()
    if (!robot) {
      return NextResponse.json({ error: "robot not existed" }, { status: 400 })
    }

    return NextResponse.json({
      robotId: robot.id,
      name: robot.name,
      location: robot.location,
      charge: robot.charge
    })
  } catch (error) {
    console.error("Error processing robot status request:", error)
    return NextResponse.json({
      success: false,
      error: "An unexpected error occurred",
    }, { status: 500 })
  }
}
