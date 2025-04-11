import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Brain,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Textarea } from "../../../components/ui/textarea";
import Link from "next/link";

export const metadata = {
  title: "Analytics | Smart Warehouse Manager",
  description: "Insights and performance metrics for warehouse operations",
};

export default function AnalyticsPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Insights and performance metrics for warehouse operations
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Efficiency Rate
              </p>
              <h3 className="text-2xl font-bold">94.2%</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Products Processed
              </p>
              <h3 className="text-2xl font-bold">1,245</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Robot Uptime
              </p>
              <h3 className="text-2xl font-bold">99.7%</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Avg. Processing Time
              </p>
              <h3 className="text-2xl font-bold">2.3 min</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Key performance indicators over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                <p className="mt-2">
                  Performance chart visualization would appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Feedback
              </CardTitle>
              <CardDescription>
                Share your thoughts on system performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your feedback about the system performance..."
                className="min-h-[120px] border-primary/30 focus:border-primary"
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" className="flex items-center">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Positive
                </Button>
                <Button variant="outline" className="flex items-center">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Negative
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={"/dashboard/analytics/feedback"}>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Submit Feedback
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Intelligent suggestions based on warehouse data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-secondary/20">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Optimize Shelf Arrangement</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on current product flow patterns, rearranging shelves
                    A2 and B1 could reduce robot travel distance by 15% and
                    improve efficiency.
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      99.2% Confidence
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-secondary/20">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Maintenance Alert</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Robot PB-001 is showing early signs of reduced efficiency in
                    its picking mechanism. Schedule maintenance within the next
                    48 hours to prevent downtime.
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    >
                      87.5% Confidence
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-secondary/20">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Inventory Optimization</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current electronic component stock levels are 30% higher
                    than optimal. Consider reducing next order quantity to
                    optimize storage space and capital allocation.
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      95.8% Confidence
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={"/dashboard/analytics/insights"}>
            <Button variant="outline" className="w-full">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Generate New Insights
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
