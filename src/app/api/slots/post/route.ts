import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Use POST method to match the client side.
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const slots = await prisma.slot.findMany({
      where: { userId }
    });

    // Return the list of slots (can be an empty array if none are found).
    return NextResponse.json(slots);
  } catch (error) {
    console.error("Error processing slots request:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}