import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const insight = await prisma.insight.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 })
    }

    return NextResponse.json({ insight })
  } catch (error) {
    console.error("Error fetching insight:", error)
    return NextResponse.json({ error: "Failed to fetch insight" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()

    const insight = await prisma.insight.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 })
    }

    const updatedInsight = await prisma.insight.update({
      where: { id: params.id },
      data: {
        isRead: body.isRead !== undefined ? body.isRead : insight.isRead,
        isArchived: body.isArchived !== undefined ? body.isArchived : insight.isArchived,
      },
    })

    return NextResponse.json({ insight: updatedInsight })
  } catch (error) {
    console.error("Error updating insight:", error)
    return NextResponse.json({ error: "Failed to update insight" }, { status: 500 })
  }
}
