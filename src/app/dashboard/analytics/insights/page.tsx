import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Brain, Lightbulb, ArrowLeft, RefreshCcw, Download } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "AI Insights | Analytics | Smart Warehouse Manager",
  description: "AI-powered insights and recommendations for warehouse optimization",
}

// Mock data for AI insights
const insights = [
  {
    id: "INS-001",
    title: "Optimize Shelf Arrangement",
    description:
      "Based on current product flow patterns, rearranging shelves A2 and B1 could reduce robot travel distance by 15% and improve efficiency.",
    confidence: 99.2,
    category: "optimization",
    impact: "high",
    timeToImplement: "1-2 days",
    generatedAt: "2025-04-08T14:30:00Z",
  },
  {
    id: "INS-002",
    title: "Maintenance Alert",
    description:
      "Robot PB-001 is showing early signs of reduced efficiency in its picking mechanism. Schedule maintenance within the next 48 hours to prevent downtime.",
    confidence: 87.5,
    category: "maintenance",
    impact: "medium",
    timeToImplement: "immediate",
    generatedAt: "2025-04-08T15:45:00Z",
  },
  {
    id: "INS-003",
    title: "Inventory Optimization",
    description:
      "Current electronic component stock levels are 30% higher than optimal. Consider reducing next order quantity to optimize storage space and capital allocation.",
    confidence: 95.8,
    category: "inventory",
    impact: "medium",
    timeToImplement: "next order cycle",
    generatedAt: "2025-04-08T16:20:00Z",
  },
  {
    id: "INS-004",
    title: "Traffic Flow Improvement",
    description:
      "Creating a one-way path in the central warehouse corridor would reduce robot congestion by approximately 40% during peak hours.",
    confidence: 92.3,
    category: "layout",
    impact: "high",
    timeToImplement: "3-5 days",
    generatedAt: "2025-04-08T17:10:00Z",
  },
  {
    id: "INS-005",
    title: "Energy Consumption Reduction",
    description:
      "Adjusting robot charging schedules to off-peak hours could reduce energy costs by 12% while maintaining the same operational capacity.",
    confidence: 89.7,
    category: "energy",
    impact: "low",
    timeToImplement: "1 day",
    generatedAt: "2025-04-08T18:05:00Z",
  },
]

export default function InsightsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/analytics">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">AI-Powered Insights</h1>
            <p className="text-muted-foreground">Intelligent recommendations based on warehouse data</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-primary hover:bg-primary/90">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Generate New Insights
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Latest Insights
          </CardTitle>
          <CardDescription>Generated on April 8, 2025 at 18:05</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg bg-secondary/20">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          insight.confidence > 95
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : insight.confidence > 85
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {insight.confidence}% Confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {insight.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          insight.impact === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            : insight.impact === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        }
                      >
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline">{insight.timeToImplement}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
