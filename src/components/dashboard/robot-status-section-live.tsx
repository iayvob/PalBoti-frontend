"use client";

import { useState, useEffect } from "react";
import { Battery, Circle, Cpu } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import axios from "axios";
import { useSession } from "next-auth/react";

interface RobotStats {
  name: string;
  robotId: string;
  location: string | null;
  charge: string;
}

export default function RobotStatusSectionLive() {
  const [stats, setStats] = useState<RobotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRobotStatus = async () => {
      try {
        const { data } = await axios.get("/api/robot-status");

        console.log(data);
        setStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching robot:", error);
        setError("Failed to fetch robot status");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.id) {
      fetchRobotStatus();
    }
  }, [session?.user.id]);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 robot-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" />
            Robot Status
          </CardTitle>
          <CardDescription>Loading robot status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse">
              <Cpu className="h-10 w-10 text-primary/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 robot-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" />
            Robot Status
          </CardTitle>
          <CardDescription>Error loading robot status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 dark:bg-red-950 dark:text-red-200 dark:border-red-800">
            {error || "Failed to load robot status"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 robot-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" />
          Robot Status
        </CardTitle>
        <CardDescription>Real-time warehouse robot status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center">
                <Circle className="h-3 w-3 fill-current text-green-500" />
                <span className="ml-2 font-medium">Robot #{stats.robotId}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Location: {stats.location || "Unknown"}
              </div>
            </div>
            <div className="flex items-center">
              <Battery className="mr-1 h-4 w-4 text-muted-foreground" />
              <div className="w-16">
                <Progress value={parseInt(stats.charge)} className="h-2" />
              </div>
              <span className="ml-2 text-xs">{stats.charge}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
