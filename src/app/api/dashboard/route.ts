import { type NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get counts
    const productCount = await prisma.product.count();
    const robotCount = await prisma.robot.count();

    // Get active robots
    const activeRobots = await prisma.robot.count({
      where: { status: "active" },
    });

    // Get product categories
    const products = await prisma.product.findMany();
    const categories: Record<string, number> = {};

    products.forEach((product: { category: string }) => {
      if (categories[product.category]) {
        categories[product.category]++;
      } else {
        categories[product.category] = 1;
      }
    });

    // Get recent tasks
    const recentTasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        product: true,
      },
    });

    // Calculate efficiency rate (in a real app, this would be more complex)
    const completedTasks = await prisma.task.count({
      where: { status: "completed" },
    });

    const totalTasks = await prisma.task.count();

    const efficiencyRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100 * 10) / 10
      : 0;

    // Get warehouse zones
    const zones = [
      { id: "A1", type: "storage", status: "normal", items: 120, capacity: 150 },
      { id: "A2", type: "storage", status: "normal", items: 95, capacity: 150 },
      { id: "A3", type: "storage", status: "attention", items: 150, capacity: 150 },
      { id: "B1", type: "picking", status: "normal", items: 45, capacity: 75 },
      { id: "B2", type: "picking", status: "normal", items: 30, capacity: 75 },
      { id: "B3", type: "picking", status: "empty", items: 0, capacity: 75 },
      { id: "C1", type: "shipping", status: "normal", items: 75, capacity: 100 },
      { id: "C2", type: "shipping", status: "busy", items: 200, capacity: 200 },
      { id: "C3", type: "receiving", status: "normal", items: 60, capacity: 100 },
    ];

    // Get efficiency history
    const efficiencyHistory = await prisma.efficiencyRecord.findMany({
      orderBy: [{ year: "desc" }, { month: "asc" }],
      take: 6,
    });

    // Format the efficiency history data for the chart
    const formattedEfficiencyHistory = efficiencyHistory.map((record: { month: string; rate: number }) => ({
      month: record.month,
      rate: record.rate,
    }));

    return NextResponse.json({
      productCount,
      robotCount,
      activeRobots,
      categories,
      recentTasks,
      efficiencyRate,
      zones,
      efficiencyHistory: formattedEfficiencyHistory,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}