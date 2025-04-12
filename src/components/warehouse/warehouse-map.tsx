"use client";

import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

/**
 * Basic data shape for each zone/tag in your warehouse.
 * For example:
 *   { id: "TAG 1", status: "busy", items: 5, capacity: 5 }
 */
interface Zone {
  id: string;      // e.g. "TAG 1"
  status: string;  // e.g. "normal", "busy", etc.
  items: number;   // current items stored
  capacity: number;// total capacity
}

/**
 * Extended data that includes SVG positioning for each tag.
 */
interface ZoneData extends Zone {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Decide fill color based on how many items are in the zone:
 *  - 0 => green
 *  - items == capacity => red
 *  - otherwise => yellow
 */
function getFillColor(items: number, capacity: number): string {
  if (items === 0) return "green";
  if (items === capacity) return "red";
  return "yellow";
}

/**
 * Map your zone data (by ID) to the approximate coordinates
 * and sizes that match the reference image layout.
 */
function mapZonesToLayout(zones: Zone[]): ZoneData[] {
  // Hardcode positions for each tag to place them around the edges.
  // Adjust numbers as needed for a perfect match.
  const layoutMap: Record<string, Partial<ZoneData>> = {
    "TAG 1": { x: 70,  y:  5,  width: 40, height: 15 },  // top center
    "TAG 2": { x: 165, y: 60, width: 10, height: 30 },  // right side
    "TAG 3": { x: 110, y:155, width: 30, height: 15 },  // bottom right
    "TAG 4": { x:  40, y:155, width: 30, height: 15 },  // bottom left
  };

  return zones.map((zone) => {
    const layout = layoutMap[zone.id] || {};
    return {
      ...zone,
      x: layout.x ?? 0,
      y: layout.y ?? 0,
      width: layout.width ?? 20,
      height: layout.height ?? 20,
    };
  });
}

interface WarehouseMapProps {
  data: Zone[];  // e.g. [{id: "TAG 1", status: "busy", items: 5, capacity: 5}, ...]
}

/**
 * This component draws:
 *   - Outer 1.8 m x 1.8 m boundary => 180 x 180 px
 *   - Robot "home" in top-left
 *   - Corridors + center box to mimic your reference
 *   - Four tags placed with tooltips (TAG 1, 2, 3, 4)
 */
export default function WarehouseMap({ data }: WarehouseMapProps) {
  const zoneData = mapZonesToLayout(data);

  return (
    <TooltipProvider>
      <div className="relative w-full overflow-auto">
        <svg
          viewBox="0 0 180 180"
          width="100%"
          height="auto"
          style={{ border: "1px solid #ccc", background: "#fff" }}
        >
          {/* ========== Outer boundary (1.8 m x 1.8 m) ========== */}
          <rect
            x={0}
            y={0}
            width={180}
            height={180}
            fill="none"
            stroke="#000"
            strokeWidth={2}
          />

          {/* ========== Robot "Home" (top-left) ========== */}
          <rect
            x={0}
            y={0}
            width={30}
            height={30}
            fill="none"
            stroke="#000"
            strokeWidth={2}
          />
          <text x={5} y={20} fontSize={8} fill="black">
            Robot
          </text>
          <text x={5} y={28} fontSize={6} fill="black">
            home
          </text>

          {/* ========== Corridors & center box ========== */}

          {/* Left vertical corridor: 1.2 m => ~120 px from (30,0) down to (30,120) */}
          <line x1={30} y1={0} x2={30} y2={120} stroke="#000" strokeWidth={2} />

          {/* Top horizontal corridor: 50 cm => ~50 px from (30,30) to (80,30) */}
          <line x1={30} y1={30} x2={80} y2={30} stroke="#000" strokeWidth={2} />

          {/* Extend corridor downward from (80,30) to (80,60) */}
          <line x1={80} y1={30} x2={80} y2={60} stroke="#000" strokeWidth={2} />

          {/* Center box: 45 x 45 px => from (45,60) to (90,105) */}
          <rect
            x={45}
            y={60}
            width={45}
            height={45}
            fill="none"
            stroke="#000"
            strokeWidth={2}
          />

          {/* Right corridor: 1.5 cm => ~15 px from (165,0) to (165,180) */}
          <line x1={165} y1={0} x2={165} y2={180} stroke="#000" strokeWidth={2} />

          {/* Bottom corridor: entire 1.8 m => from (0,150) to (180,150) */}
          <line x1={0} y1={150} x2={180} y2={150} stroke="#000" strokeWidth={2} />

          {/* ========== Render dynamic TAG zones ========== */}
          {zoneData.map((zone) => {
            const availableSlots = zone.capacity - zone.items;
            return (
              <Tooltip key={zone.id}>
                <TooltipTrigger asChild>
                  <g>
                    {/* Outer rectangle (tag outline) */}
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      fill="none"
                      stroke="#000"
                      strokeWidth={1}
                    />
                    {/* Inner rectangle (occupancy color) */}
                    <rect
                      x={zone.x + 2}
                      y={zone.y + 2}
                      width={zone.width - 4}
                      height={zone.height - 4}
                      fill={getFillColor(zone.items, zone.capacity)}
                    />
                    {/* Tag label below */}
                    <text
                      x={zone.x}
                      y={zone.y + zone.height + 8}
                      fontSize={6}
                      fill="black"
                    >
                      {zone.id}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    <strong>{zone.id}</strong>
                  </p>
                  <p>Status: {zone.status}</p>
                  <p>Items: {zone.items} / {zone.capacity}</p>
                  <p>Available Slots: {availableSlots}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
      </div>
    </TooltipProvider>
  );
}
