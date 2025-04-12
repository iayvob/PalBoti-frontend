"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Package } from "lucide-react";
import { ProductCard } from "../../../components/products/product-card";
import axios from "axios";
import { useSession } from "next-auth/react";

// Define the Product type based on your database model
type Product = {
  id: string;
  userId: string;
  category: string;
  stage: number;
  status: string;
  location?: string;
  tags: string[];
  updatedAt: string;
};

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products when the user session is available
  useEffect(() => {
    if (session?.user?.id) {
      axios
        .post("/api/products", { userId: session.user.id })
        .then((res) => {
          if (res.data.success && res.data.data) {
            setProducts(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
        });
    }
  }, [session]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">
              Products Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all products in the warehouse system
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Product Inventory
          </CardTitle>
          <CardDescription>
            Complete list of products with status and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              Stored
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            >
              Ready to Ship
            </Badge>
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            >
              Processing
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
