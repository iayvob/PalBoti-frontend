"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Brain, Lightbulb, ArrowLeft, RefreshCcw } from "lucide-react";

// Define the Insight type based on the generated data and saved fields
type Insight = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: string;
  impact: string;
  timeToImplement: string;
  generatedAt: string;
};

export default function InsightsPage() {
  const { data: session } = useSession();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Optionally, you can load existing insights when the component mounts.
  // For simplicity, this example only refreshes insights on button click.
  useEffect(() => {
    // If you need to initially load insights from an endpoint, you can do that here.
    // e.g., axios.get('/api/insights').then((res)=> setInsights(res.data.insights));
  }, []);

  const handleGenerateInsights = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await axios.post<{ insights: Insight[] }>("/api/insights", {
        userId: session.user.id,
      });

      if (response.data && response.data.insights) {
        setInsights(response.data.insights);
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      // Optionally, you can display an error alert here.
    } finally {
      setIsLoading(false);
    }
  };

  // Format the generation timestamp based on the latest insight if available.
  const latestGenerationDate = insights.length > 0 ? new Date(insights[0].generatedAt).toLocaleString() : "";

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
            <p className="text-muted-foreground">
              Intelligent recommendations based on warehouse data
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleGenerateInsights} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isLoading ? "Generating Insights..." : "Generate New Insights"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Latest Insights
          </CardTitle>
          <CardDescription>
            {latestGenerationDate
              ? `Generated on ${latestGenerationDate}`
              : "No insights generated yet."}
          </CardDescription>
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
            {/* If no insights are loaded, show a placeholder message */}
            {insights.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No insights available. Click &quot;Generate New Insights&quot; to get started.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {/* Optional footer actions could go here */}
        </CardFooter>
      </Card>
    </>
  );
}
