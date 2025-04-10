"use client";

import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  PenToolIcon as Tool,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { ProductCard } from "../products/product-card";

// Mock data for shelves
const initialShelves = [
  {
    id: "S-001",
    name: "Shelf A1",
    stages: [
      { id: "S-001-1", status: "occupied", productId: "P-001" },
      { id: "S-001-2", status: "available", productId: null },
      { id: "S-001-3", status: "maintenance", productId: null },
    ],
  },
  {
    id: "S-002",
    name: "Shelf A2",
    stages: [
      { id: "S-002-1", status: "occupied", productId: "P-002" },
      { id: "S-002-2", status: "occupied", productId: "P-003" },
      { id: "S-002-3", status: "available", productId: null },
    ],
  },
  {
    id: "S-003",
    name: "Shelf A3",
    stages: [
      { id: "S-003-1", status: "reserved", productId: null },
      { id: "S-003-2", status: "available", productId: null },
      { id: "S-003-3", status: "available", productId: null },
    ],
  },
  {
    id: "S-004",
    name: "Shelf B1",
    stages: [
      { id: "S-004-1", status: "occupied", productId: "P-004" },
      { id: "S-004-2", status: "occupied", productId: "P-005" },
      { id: "S-004-3", status: "occupied", productId: "P-006" },
    ],
  },
];

// Mock data for products
const products = {
  "P-001": {
    id: "P-001",
    name: "Electronic Component A",
    status: "stored",
    tags: ["electronics", "fragile"],
  },
  "P-002": {
    id: "P-002",
    name: "Clothing Item B",
    status: "ready-to-ship",
    tags: ["clothing", "light"],
  },
  "P-003": {
    id: "P-003",
    name: "Food Product C",
    status: "stored",
    tags: ["food", "perishable"],
  },
  "P-004": {
    id: "P-004",
    name: "Home Goods D",
    status: "processing",
    tags: ["home", "heavy"],
  },
  "P-005": {
    id: "P-005",
    name: "Toy Item E",
    status: "stored",
    tags: ["toys", "fragile"],
  },
  "P-006": {
    id: "P-006",
    name: "Electronic Component F",
    status: "ready-to-ship",
    tags: ["electronics", "valuable"],
  },
};

export default function ShelfSystem() {
  const [shelves, setShelves] = useState(initialShelves);
  const [expandedShelf, setExpandedShelf] = useState<string | null>("S-001");

  const toggleShelf = (shelfId: string) => {
    if (expandedShelf === shelfId) {
      setExpandedShelf(null);
    } else {
      setExpandedShelf(shelfId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "occupied":
        return <Package className="h-5 w-5 text-red-500" />;
      case "reserved":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "maintenance":
        return <Tool className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {shelves.map((shelf) => (
        <Card key={shelf.id} className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 h-auto"
            onClick={() => toggleShelf(shelf.id)}
          >
            <div className="flex items-center">
              <span className="font-medium">{shelf.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({shelf.id})
              </span>
            </div>
            {expandedShelf === shelf.id ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>

          {expandedShelf === shelf.id && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {shelf.stages.map((stage) => (
                  <div key={stage.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {getStatusIcon(stage.status)}
                        <span className="ml-2 font-medium capitalize">
                          {stage.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {stage.id}
                      </span>
                    </div>

                    {stage.productId ? (
                      <div className="mt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                {stage.productId &&
                                  products[
                                    stage.productId as keyof typeof products
                                  ] && (
                                    <ProductCard
                                      product={
                                        products[
                                          stage.productId as keyof typeof products
                                        ]
                                      }
                                      compact
                                    />
                                  )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              align="start"
                              className="max-w-sm"
                            >
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="link" className="p-0 h-auto">
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Product Details</DialogTitle>
                                    <DialogDescription>
                                      Complete information about this product
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    {stage.productId in products && (
                                      <ProductCard
                                        product={
                                          products[
                                            stage.productId as keyof typeof products
                                          ]
                                        }
                                      />
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">Close</Button>
                                    <Button>Move Product</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={stage.status === "maintenance"}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Assign Product
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
