import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "../../../lib/prisma"
import { generateWarehouseInsights } from "../../../lib/gemini"

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get insights for the user
    const insights = await prisma.insight.findMany({
      where: {
        userId: user.id,
        isArchived: false,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}

export async function POST(_req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get warehouse data for insights generation
    const robots = await prisma.robot.findMany()
    const products = await prisma.product.findMany()
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // Get the 50 most recent tasks
    })

    // Generate insights using Gemini
    const warehouseData = { robots, products, tasks }
    const generatedInsights = await generateWarehouseInsights(warehouseData)

    // Save insights to database
    const savedInsights = await Promise.all(
      generatedInsights.map(async (insight: any) => {
        return prisma.insight.create({
          data: {
            title: insight.title,
            description: insight.description,
            category: insight.category,
            confidence: insight.confidence,
            impact: insight.impact,
            userId: user.id,
            data: insight.data || {},
          },
        })
      }),
    )

    return NextResponse.json({ insights: savedInsights })
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
