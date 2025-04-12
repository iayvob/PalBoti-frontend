"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Cpu, Package, Map, BarChart3 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";

interface DashboardStats {
  productCount: number;
  robotCount: number;
  activeRobots: number;
  efficiencyRate: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.post("/api/dashboard", {
          userId: session?.user.id,
        });

        setStats({
          productCount: data.productCount,
          robotCount: data.robotCount,
          activeRobots: data.activeRobots,
          efficiencyRate: 78.77,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchStats();
    }
  }, [status, session?.user?.id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-primary/10">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-primary/10">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Products
            </p>
            <h3 className="text-2xl font-bold">
              {stats?.productCount.toLocaleString() || 0}
            </h3>
          </div>
          <Package className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>

      <Card className="bg-primary/10">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Active Robots
            </p>
            <h3 className="text-2xl font-bold">{stats?.activeRobots || 0}</h3>
          </div>
          <Cpu className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>

      <Card className="bg-primary/10">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Robots
            </p>
            <h3 className="text-2xl font-bold">{stats?.robotCount || 0}</h3>
          </div>
          <Map className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>

      <Card className="bg-primary/10">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Efficiency Rate
            </p>
            <h3 className="text-2xl font-bold">
              {stats?.efficiencyRate || 0}%
            </h3>
          </div>
          <BarChart3 className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>
    </div>
  );
}