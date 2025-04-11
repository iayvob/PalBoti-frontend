"use client";

import { useState, useEffect } from "react";
import { Map } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import axios from "axios";

interface WarehouseZone {
  id: string;
  type: string;
  status: string;
  items: number;
  capacity?: number;
}

export default function WarehouseMapSection() {
  const [zones, setZones] = useState<WarehouseZone[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchWarehouseZones() {
      try {
        const { data } = await axios.get(`/api/warehouse/zones`, {
          params: { userId: session?.user?.id },
        });
        setZones(data.zones);
      } catch (error) {
        console.error("Error fetching warehouse zones:", error);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
    }
    fetchWarehouseZones();
  }, [status]);

  if (loading) {
    return (
      <Card className="h-full robot-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5 text-primary" />
            Warehouse Map
          </CardTitle>
          <CardDescription>Live view of warehouse zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-md" />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full robot-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Map className="mr-2 h-5 w-5 text-primary" />
          Warehouse Map
        </CardTitle>
        <CardDescription>Live view of warehouse zones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {zones.map((zone) => (
            <WarehouseZone key={zone.id} zone={zone} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            Normal
          </Badge>
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
          >
            Attention
          </Badge>
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          >
            Busy
          </Badge>
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
          >
            Empty
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function WarehouseZone({ zone }: { zone: WarehouseZone }) {
  const getZoneColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700";
      case "attention":
        return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700";
      case "busy":
        return "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700";
      case "empty":
        return "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700";
      default:
        return "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700";
    }
  };

  return (
    <div
      className={`aspect-square p-2 border rounded-md flex flex-col items-center justify-center text-center ${getZoneColor(
        zone.status
      )}`}
    >
      <div className="font-bold">{zone.id}</div>
      <div className="text-xs capitalize">{zone.type}</div>
      <div className="text-xs mt-1">{zone.items} items</div>
      {zone.capacity && (
        <div className="text-xs text-muted-foreground">
          {Math.round((zone.items / zone.capacity) * 100)}% full
        </div>
      )}
    </div>
  );
}
