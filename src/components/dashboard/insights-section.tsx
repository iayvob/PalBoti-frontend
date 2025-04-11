"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Brain,
  Lightbulb,
  RefreshCcw,
  ArrowRight,
  Check,
  Archive,
  LineChart,
} from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useOverlay } from "@/contexts/overlay-context";
import { redirect } from "next/navigation";

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  impact: string;
  createdAt: string;
  isRead: boolean;
  isArchived: boolean;
}

export default function InsightsSection() {
  const { data: session, status } = useSession();
  const { requestOverlay, hideOverlay } = useOverlay();

  // Overlay on loading state
  useEffect(() => {
    if (status === "loading") requestOverlay(true);
    else hideOverlay();
  }, [status, requestOverlay, hideOverlay]);

  // Redirect on auth
  useEffect(() => {
    if (status === "authenticated") {
      hideOverlay();
      redirect("/dashboard");
    }
  }, [status, hideOverlay]);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const [chartData, setChartData] = useState<{
    efficiency: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        tension: number;
      }[];
    };
    categories: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      }[];
    };
  }>({
    efficiency: {
      labels: [],
      datasets: [
        {
          label: "Efficiency Rate",
          data: [],
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.3,
        },
      ],
    },
    categories: {
      labels: [],
      datasets: [
        {
          label: "Product Categories",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    },
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `/api/insights?userId=${session?.user?.id}`
        );

        if (data.insights) {
          setInsights(data.insights);
        }

        // Fetch chart data
        const dashboardResponse = await fetch("/api/dashboard");
        const dashboardData = await dashboardResponse.json();

        if (dashboardData.categories) {
          // Process category data for chart
          const categoryLabels = Object.keys(dashboardData.categories);
          const categoryValues = Object.values(dashboardData.categories);

          // Generate colors based on the number of categories
          const colors = categoryLabels.map((_, index) => {
            const opacity = 0.3 + 0.4 * (index / categoryLabels.length);
            return {
              bg: `rgba(239, 68, 68, ${opacity})`,
              border: "rgba(239, 68, 68, 1)",
            };
          });

          setChartData((prev) => ({
            ...prev,
            categories: {
              labels: categoryLabels,
              datasets: [
                {
                  ...prev.categories.datasets[0],
                  data: categoryValues as number[],
                  backgroundColor: colors.map((c) => c.bg),
                  borderColor: colors.map((c) => c.border),
                },
              ],
            },
          }));
        }

        // Set efficiency data if available
        if (dashboardData.efficiencyHistory) {
          setChartData((prev: typeof chartData) => ({
            ...prev,
            efficiency: {
              labels: dashboardData.efficiencyHistory.map(
                (item: { month: string; rate: number }) => item.month
              ),
              datasets: [
                {
                  ...prev.efficiency.datasets[0],
                  data: dashboardData.efficiencyHistory.map(
                    (item: { month: string; rate: number }) => item.rate
                  ) as number[],
                },
              ],
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
        toast({
          title: "Error",
          description: "Failed to fetch insights. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchInsights();
    }
  }, [status]);

  const generateInsights = async () => {
    try {
      setGenerating(true);
      const { data } = await axios.post("/api/insights", {
        userId: session?.user.id,
      });

      if (data.insights) {
        setInsights([...data.insights, ...insights]);
        toast({
          title: "Success",
          description: `Generated ${data.insights.length} new insights.`,
        });
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { status } = await axios.get(`/api/insights/${id}`);

      if (status === 200) {
        setInsights(
          insights.map((insight) =>
            insight.id === id ? { ...insight, isRead: true } : insight
          )
        );
      }
    } catch (error) {
      console.error("Error marking insight as read:", error);
    }
  };

  const archiveInsight = async (id: string) => {
    try {
      const { status } = await axios.patch(`/api/insights/${id}`, {
        userId: session?.user.id,
      });

      if (status === 200) {
        setInsights(insights.filter((insight) => insight.id !== id));
        toast({
          title: "Insight archived",
          description: "The insight has been archived successfully.",
        });
      }
    } catch (error) {
      console.error("Error archiving insight:", error);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "optimization":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "maintenance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "inventory":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "layout":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
      case "energy":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Remove these hardcoded chart data objects
  // const efficiencyData = { ... }
  // const categoryData = { ... }

  // Sample chart data
  const efficiencyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Efficiency Rate",
        data: [92, 93, 94.5, 94.2, 95.1, 96.3],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const categoryData = {
    labels: ["Electronics", "Clothing", "Food", "Home Goods", "Toys"],
    datasets: [
      {
        label: "Product Categories",
        data: [1245, 876, 543, 432, 321],
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(239, 68, 68, 0.5)",
          "rgba(239, 68, 68, 0.4)",
          "rgba(239, 68, 68, 0.3)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
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
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                        <div className="w-full">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-5/6 mb-1" />
                          <Skeleton className="h-4 w-4/6 mb-2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : insights.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No insights available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Generate new insights to get AI-powered recommendations for
                    your warehouse.
                  </p>
                  <Button
                    onClick={generateInsights}
                    disabled={generating}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {generating ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Insights
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-4 border rounded-lg bg-secondary/20"
                    >
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <h4 className="font-medium">{insight.title}</h4>
                            <Badge
                              variant="outline"
                              className={
                                insight.confidence > 0.9
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : insight.confidence > 0.7
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              }
                            >
                              {(insight.confidence * 100).toFixed(1)}%
                              Confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={getCategoryColor(insight.category)}
                            >
                              {insight.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getImpactColor(insight.impact)}
                            >
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            {!insight.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(insight.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark as Read
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => archiveInsight(insight.id)}
                            >
                              <Archive className="h-3 w-3 mr-1" />
                              Archive
                            </Button>
                            <Button
                              size="sm"
                              className="ml-auto bg-primary hover:bg-primary/90"
                            >
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={generateInsights}
                    disabled={generating}
                    variant="outline"
                    className="w-full"
                  >
                    {generating ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Generate New Insights
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key warehouse performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Efficiency Rate</h4>
                <Line
                  data={
                    chartData.efficiency.labels.length > 0
                      ? chartData.efficiency
                      : efficiencyData
                  }
                />
              </div>

              <div>
                <Pie
                  data={
                    chartData.categories.labels.length > 0
                      ? chartData.categories
                      : categoryData
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
