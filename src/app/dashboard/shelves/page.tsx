"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Layers, Package, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useOverlay } from "@/contexts/overlay-context";

// Define shelf location type keys that match the Prisma enum
type ShelfLocation = "A1" | "A2" | "A3" | "A4";

// Slot interface matching the DB schema
interface Slot {
  id: string;
  userId: string;
  productId: string;
  stage: number;
  zone: ShelfLocation;
  updatedAt: string;
}

export default function ShelvesPage() {
  const { data: session, status } = useSession();
  const { requestOverlay, hideOverlay } = useOverlay();

  // Overall shelf stats (each shelf is expected to have 3 slots)
  const [shelfData, setShelfData] = useState({
    shelfCounts: { A1: 0, A2: 0, A3: 0, A4: 0 },
    totalShelves: 0,
    freeSlots: 0,
    capacityUtilization: 0, // percentage occupied
  });

  // Grouped slots by shelf location, each as an array of Slot.
  const [groupedSlots, setGroupedSlots] = useState<Record<ShelfLocation, Slot[]>>({
    A1: [],
    A2: [],
    A3: [],
    A4: [],
  });

  // Set up overlay state
  useEffect(() => {
    if (status === "loading") requestOverlay(true);
    else hideOverlay();
  }, [status, requestOverlay, hideOverlay]);

  useEffect(() => {
    if (status === "authenticated") hideOverlay();
  }, [status, hideOverlay]);

  // Fetch and process slots from the API
  useEffect(() => {
    async function fetchShelves() {
      if (session?.user?.id) {
        try {
          // Retrieve slots from the API endpoint.
          const { data: slots } = await axios.get<Slot[]>(
            `/api/slots?userId=${session.user.id}`
          );
          console.log(slots);

          if (slots && Array.isArray(slots)) {
            // Group slots by shelf and count occupied stages.
            const initialShelfCounts: Record<ShelfLocation, number> = {
              A1: 0,
              A2: 0,
              A3: 0,
              A4: 0,
            };
            const newGroupedSlots: Record<ShelfLocation, Slot[]> = {
              A1: [],
              A2: [],
              A3: [],
              A4: [],
            };

            slots.forEach((slot) => {
              // Ensure the slot's zone is one of the defined shelf locations.
              if (
                slot.zone &&
                Object.keys(initialShelfCounts).includes(slot.zone)
              ) {
                initialShelfCounts[slot.zone as ShelfLocation]++;
                newGroupedSlots[slot.zone as ShelfLocation].push(slot);
              }
            });

            const totalShelves = Object.keys(initialShelfCounts).length; // should be 4
            // Each shelf is expected to have 3 slots.
            const expectedTotalSlots = totalShelves * 3;
            const occupiedSlots = slots.length; // each returned slot is considered occupied
            const freeSlots = expectedTotalSlots - occupiedSlots;
            const capacityUtilization =
              expectedTotalSlots > 0
                ? Math.round((occupiedSlots / expectedTotalSlots) * 100)
                : 0;

            setShelfData({
              shelfCounts: initialShelfCounts,
              totalShelves,
              freeSlots,
              capacityUtilization,
            });
            setGroupedSlots(newGroupedSlots);
          }
        } catch (error) {
          console.error("Error fetching shelves:", error);
        }
      }
    }
    fetchShelves();
  }, [session]);

  // Fixed list of shelf locations for rendering
  const shelfLocations: ShelfLocation[] = ["A1", "A2", "A3", "A4"];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">
              Shelves Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage product placement across warehouse shelving units.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Shelves
              </p>
              <h3 className="text-2xl font-bold">{shelfData.totalShelves}</h3>
            </div>
            <Layers className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Free Slots
              </p>
              <h3 className="text-2xl font-bold">{shelfData.freeSlots}</h3>
            </div>
            <Package className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Capacity Utilization
              </p>
              <h3 className="text-2xl font-bold">
                {shelfData.capacityUtilization}%
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Shelf Mapping */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5 text-primary" />
            Shelf System Overview
          </CardTitle>
          <CardDescription>
            Each shelf contains three stages. Occupied slots display available data; empty stages are shown as free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelfLocations.map((shelf) => (
              <Card key={shelf}>
                <CardHeader>
                  <CardTitle>Shelf {shelf}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Loop through three expected stages per shelf */}
                  {[1, 2, 3].map((stageNumber) => {
                    // Find a slot for this shelf and stage.
                    const slot = groupedSlots[shelf].find(
                      (s) => s.stage === stageNumber
                    );
                    return slot ? (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between border-b py-2 last:border-b-0"
                      >
                        <div className="text-sm font-medium">
                          Stage {stageNumber}: {slot.productId}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          Occupied
                        </Badge>
                      </div>
                    ) : (
                      <div
                        key={stageNumber}
                        className="py-2 text-center text-muted-foreground border-b last:border-b-0"
                      >
                        Stage {stageNumber}: Free slot
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
