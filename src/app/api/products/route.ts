// src/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Extract the userId from the JSON body
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Retrieve all products for the provided userId
    const products = await prisma.product.findMany({
      where: { userId },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error processing products request:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
