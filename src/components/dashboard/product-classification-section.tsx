"use client"

import { useState, useEffect } from "react"
import { Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Skeleton } from "../ui/skeleton"

export default function ProductClassificationSection() {
  const [categories, setCategories] = useState<Array<{ name: string; count: number; percentage: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const response = await fetch("/api/products/categories")
        if (!response.ok) throw new Error("Failed to fetch product categories")
        const data = await response.json()
        setCategories(data.categories)
      } catch (error) {
        console.error("Error fetching product categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductCategories()
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1 robot-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Product Classification
          </CardTitle>
          <CardDescription>Distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 robot-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          Product Classification
        </CardTitle>
        <CardDescription>Distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.count.toLocaleString()} items</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={category.percentage}
                  className="h-2"
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                  }}
                />
                <span className="text-xs text-muted-foreground w-8">{category.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
