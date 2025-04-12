"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";
import { useSession } from "next-auth/react";

// Type definitions matching your Prisma slot model and your shelf system
type Slot = {
  id: string;
  userId: string;
  name: string;
  category: string;
  status: string;
  location?: string;
  stage: number;
  zone: string;
  updatedAt: string;
  productId?: string;
};

type Stage = {
  id: string;
  status: string;
  productId: string | null;
};

type Shelf = {
  id: string;
  name: string;
  stages: Stage[];
};

type Product = {
  id: string;
  name: string;
  status: string;
  tags: string[];
};

export default function ShelfSystem() {
  const { data: session } = useSession();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedShelf, setExpandedShelf] = useState<string | null>(null);

  // Fetch slots data from your API using the current user's ID
  useEffect(() => {
    async function fetchSlots() {
      if (session?.user?.id) {
        try {
          const { data } = await axios.post<Slot[]>("/api/slots", {
            userId: session.user.id,
          });
          if (Array.isArray(data)) {
            setSlots(data);
          }
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      }
    }
    fetchSlots();
  }, [session]);

  // Fetch products data from your API using the current user's ID
  useEffect(() => {
    async function fetchProducts() {
      if (session?.user?.id) {
        try {
          const response = await axios.post<{ success: boolean; data: Product[] }>("/api/products", {
            userId: session.user.id,
          });
          if (response.data.success && Array.isArray(response.data.data)) {
            setProducts(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    }
    fetchProducts();
  }, [session]);

  // Map fetched slots into shelves based on location and stage.
  // Use the slot's status directly and assign productId if available.
  useEffect(() => {
    if (slots.length > 0) {
      const shelvesMap: { [key: string]: Shelf } = {};

      slots.forEach((slot) => {
        // Only process slots with a defined location (e.g. "A1", "A2", etc.)
        if (!slot.location) return;

        const shelfId = slot.location;
        if (!shelvesMap[shelfId]) {
          shelvesMap[shelfId] = {
            id: shelfId,
            name: `Shelf ${shelfId}`,
            stages: [],
          };
        }
        shelvesMap[shelfId].stages.push({
          id: `${shelfId}-${slot.stage}`,
          status: slot.status, // using the status from slot directly
          productId: slot.productId ? slot.productId : null,
        });
      });

      // Sort each shelf's stages by the stage number (extracted from the stage id)
      const mappedShelves = Object.values(shelvesMap).map((shelf) => ({
        ...shelf,
        stages: shelf.stages.sort((a, b) => {
          const stageA = parseInt(a.id.split("-")[1]);
          const stageB = parseInt(b.id.split("-")[1]);
          return stageA - stageB;
        }),
      }));

      setShelves(mappedShelves);
    }
  }, [slots]);

  const toggleShelf = (shelfId: string) => {
    setExpandedShelf(expandedShelf === shelfId ? null : shelfId);
  };

  // Get the icon for a given stage status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
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

  // Helper to find a product by its id from the fetched list
  const getProductById = (id: string) =>
    products.find((product) => product.id === id);

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
                    {stage.productId && (
                      <div className="mt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                {getProductById(stage.productId) && (
                                  <ProductCard
                                    product={getProductById(stage.productId)!}
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
                                    {getProductById(stage.productId) && (
                                      <ProductCard
                                        product={getProductById(stage.productId)!}
                                      />
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">
                                      Close
                                    </Button>
                                    <Button>Move Product</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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