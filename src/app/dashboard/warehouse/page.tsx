"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import WarehouseMapSection from "@/components/dashboard/warehouse-map-section";

interface Zone {
  id: string;
  status: string;
  items: number;
  capacity: number;
}

export default function WarehousePage() {
  const [zones] = useState<Zone[]>([
    { id: "A1", status: "normal", items: 2, capacity: 3 },
    { id: "A2", status: "attention", items: 2, capacity: 3 },
    { id: "A3", status: "busy", items: 3, capacity: 3 },
    { id: "A4", status: "empty", items: 0, capacity: 3 },
  ]);
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">
              Warehouse Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage warehouse zones, storage areas, and capacity
            </p>
          </div>
        </div>
      </div>

      <WarehouseMapSection />
    </TooltipProvider>
  );
}
