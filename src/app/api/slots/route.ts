// src/app/api/slots/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Named export for GET method
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const slots = await prisma.slot.findMany({
      where: { userId }
    });

    if (!slots) {
      return NextResponse.json(
        { error: "shelves not existed" },
        { status: 404 }
      );
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Error processing shelves status request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
