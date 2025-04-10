import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "../../../../lib/prisma"

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        notificationEmail: true,
        notificationSms: true,
        notificationPush: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      notificationEmail: user.notificationEmail,
      notificationSms: user.notificationSms,
      notificationPush: user.notificationPush,
    })
  } catch (error) {
    console.error("Error fetching user notification settings:", error)
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { notificationEmail, notificationSms, notificationPush } = body

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update notification settings
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        notificationEmail: notificationEmail !== undefined ? notificationEmail : user.notificationEmail,
        notificationSms: notificationSms !== undefined ? notificationSms : user.notificationSms,
        notificationPush: notificationPush !== undefined ? notificationPush : user.notificationPush,
      },
      select: {
        notificationEmail: true,
        notificationSms: true,
        notificationPush: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user notification settings:", error)
    return NextResponse.json({ error: "Failed to update notification settings" }, { status: 500 })
  }
}
