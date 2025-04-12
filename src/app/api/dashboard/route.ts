// src/app/api/dashboard/route.ts
import { type NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Count products for the provided userId.
    const productCount = await prisma.product.count({
      where: { userId },
    });

    // Retrieve products (if needed for further processing)
    const products = await prisma.product.findMany({
      where: { userId },
    });

    // (Optional) Example: Aggregate categories (not sent to client)
    const categories: Record<string, number> = {};
    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });

    // Get robot data – robot model does not have a userId, so remove that filter.
    const robotCount = await prisma.robot.count(); 
    const activeRobots = await prisma.robot.count(); // Update if you add a filter in the future

    // Calculate efficiency rate based on tasks completion.
    const completedTasks = await prisma.task.count({
      where: {
        userId,
        status: "completed",
      },
    });

    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    const efficiencyRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 1000) / 10 : 0;

    return NextResponse.json({
      productCount,
      robotCount,
      activeRobots,
      efficiencyRate,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}