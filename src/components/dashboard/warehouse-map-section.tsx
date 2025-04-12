"use client";

import { useState, useEffect } from "react";
import { Map, Package, AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { useSession } from "next-auth/react";
import axios from "axios";

// Updated Slot interface that aligns with the provided database model.
interface Slot {
  id: string;
  userId: string;
  productId: string;
  stage: number;
  zone: string;
  updatedAt: string;
}

// WarehouseZone uses a shelves object with slot1, slot2, and slot3.
// Each slot will be either a Slot object (if occupied) or null (if free)
export interface WarehouseZone {
  id: string;
  type: string;
  status: string;
  items: number;
  capacity: number;
  shelves: {
    slot1: Slot | null;
    slot2: Slot | null;
    slot3: Slot | null;
  };
}

export default function WarehouseMapSection() {
  const [zones, setZones] = useState<WarehouseZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchWarehouseZones() {
      try {
        // Use POST to fetch slots, sending the userId in the JSON body.
        const { data } = await axios.post(`/api/slots/post`, {
          userId: session?.user?.id,
        });

        // Initialize zones with default values.
        // Shelves are defined as an object with fixed keys.
        const zoneMap: Record<string, WarehouseZone> = {
          A1: {
            id: "A1",
            type: "Storage",
            status: "empty",
            items: 0,
            capacity: 3,
            shelves: { slot1: null, slot2: null, slot3: null },
          },
          A2: {
            id: "A2",
            type: "Storage",
            status: "empty",
            items: 0,
            capacity: 3,
            shelves: { slot1: null, slot2: null, slot3: null },
          },
          A3: {
            id: "A3",
            type: "Storage",
            status: "empty",
            items: 0,
            capacity: 3,
            shelves: { slot1: null, slot2: null, slot3: null },
          },
          A4: {
            id: "A4",
            type: "Storage",
            status: "empty",
            items: 0,
            capacity: 3,
            shelves: { slot1: null, slot2: null, slot3: null },
          },
        };

        // Process each slot from the API and update the corresponding shelf.
        data.forEach((slot: Slot) => {
          if (slot.zone in zoneMap) {
            zoneMap[slot.zone].items += 1;

            // Use the stage value to determine which shelf to update.
            if (slot.stage === 1) {
              zoneMap[slot.zone].shelves.slot1 = slot;
            } else if (slot.stage === 2) {
              zoneMap[slot.zone].shelves.slot2 = slot;
            } else if (slot.stage === 3) {
              zoneMap[slot.zone].shelves.slot3 = slot;
            }

            // Update zone status based on fill rate.
            const fillRate = zoneMap[slot.zone].items / zoneMap[slot.zone].capacity;
            if (fillRate >= 1) {
              zoneMap[slot.zone].status = "busy";
            } else if (fillRate >= 0.7) {
              zoneMap[slot.zone].status = "attention";
            } else if (zoneMap[slot.zone].items === 0) {
              zoneMap[slot.zone].status = "empty";
            } else {
              zoneMap[slot.zone].status = "normal";
            }
          }
        });

        setZones(Object.values(zoneMap));
        setError(null);
      } catch (error) {
        console.error("Error fetching warehouse zones:", error);
        setError("Failed to load warehouse data");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchWarehouseZones();
    }
  }, [status, session?.user?.id]);

  if (loading) {
    return (
      <Card className="h-full robot-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5 text-primary" />
            Warehouse Map
          </CardTitle>
          <CardDescription>Loading warehouse data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full robot-card">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
            {error}
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
        <div className="grid grid-cols-2 gap-4 mb-6">
          {zones.map((zone) => (
            <WarehouseZone key={zone.id} zone={zone} />
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Zone Status Legend:</div>
          <div className="flex flex-wrap gap-2">
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
              Full
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
            >
              Empty
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WarehouseZoneProps {
  zone: WarehouseZone;
}

function WarehouseZone({ zone }: WarehouseZoneProps) {
  // Determine icon based on occupancy.
  const getStatusIcon = () => {
    if (zone.items >= zone.capacity) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <Package className="h-4 w-4 text-primary" />;
  };

  const utilization = Math.round((zone.items / zone.capacity) * 100);
  const availableSlots = zone.capacity - zone.items;

  return (
    <div className={`p-4 border rounded-lg flex flex-col ${getZoneBgColor(zone.status)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg">{zone.id}</div>
        {getStatusIcon()}
      </div>
      <div className="text-sm text-muted-foreground capitalize">{zone.type}</div>
      <div className="mt-2 text-sm">
        <span className="font-medium">{zone.items}</span> / {zone.capacity} items
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {utilization}% utilized
      </div>
      {/* Display individual slot statuses */}
      <div className="mt-2 text-sm">
        <p>Slot 1: {zone.shelves.slot1 ? "Occupied" : "Free"}</p>
        <p>Slot 2: {zone.shelves.slot2 ? "Occupied" : "Free"}</p>
        <p>Slot 3: {zone.shelves.slot3 ? "Occupied" : "Free"}</p>
      </div>
      {/* Progress bar with tooltip */}
      <div className="flex flex-col mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full bg-secondary rounded-full h-2.5 relative cursor-pointer">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{utilization}% utilized</p>
              <p>{availableSlots} slots available</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// Helper function to get background color based on status.
const getZoneBgColor = (status: string): string => {
  switch (status) {
    case "normal":
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    case "attention":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    case "busy":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    case "empty":
      return "bg-gray-50 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700";
    default:
      return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
  }
};
