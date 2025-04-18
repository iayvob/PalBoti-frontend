import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { generateWarehouseInsights } from "../../../lib/gemini"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    console.log(userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get insights for the user
    const insights = await prisma.insight.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" }, // Replace 'updatedAt' with a valid field like 'createdAt'
    })

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get warehouse data for insights generation
    const robots = await prisma.robot.findMany()
    const products = await prisma.product.findMany()
    const tasks = await prisma.task.findMany({
      orderBy: { updatedAt: "desc" },
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
            impact: insight.impact,
            userId: user.id,
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
