import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all products
    const products = await prisma.product.findMany({
      where: {
        userId
      }
    })

    // Count products by category
    const categoryCounts: Record<string, number> = {}
    products.forEach((product: { category: string }) => {
      if (categoryCounts[product.category]) {
        categoryCounts[product.category]++
      } else {
        categoryCounts[product.category] = 1
      }
    })

    // Calculate total for percentages
    const totalProducts = products.length

    // Format the data for the frontend
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalProducts) * 100),
    }))

    // Sort by count in descending order
    categories.sort((a, b) => b.count - a.count)

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching product categories:", error)
    return NextResponse.json({ error: "Failed to fetch product categories" }, { status: 500 })
  }
}
