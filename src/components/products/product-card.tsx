import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Package, TruckIcon, CheckCircle, Clock } from "lucide-react";

// The updated Product interface – note that **name**, **email**, etc. have been removed.
export interface Product {
  id: string;
  userId: string;
  category: string;
  stage: number;
  status: string;
  location?: string;
  tags: string[];
  updatedAt: string;
}

export interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  // Choose an icon based on the product status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "stored":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "ready-to-ship":
        return <TruckIcon className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "shipped":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Assign a badge color based on product status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "stored":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "ready-to-ship":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "shipped":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Return a compact layout if required (useful in lists)
  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 border rounded-md bg-card">
        <div className="flex items-center">
          {getStatusIcon(product.status)}
          <span className="ml-2 text-sm font-medium truncate max-w-[120px]">
            {product.category}
          </span>
        </div>
        <Badge variant="outline" className={getStatusColor(product.status)}>
          {product.status}
        </Badge>
      </div>
    );
  }

  // Detailed card view
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            {/* Use category as the product title */}
            <h3 className="font-medium">{product.category}</h3>
            <p className="text-xs text-muted-foreground">{product.id}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(product.status)}>
            <span className="flex items-center">
              {getStatusIcon(product.status)}
              <span className="ml-1 capitalize">{product.status}</span>
            </span>
          </Badge>
        </div>

        {/* Optionally display the location if available */}
        {product.location && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Location:</span> {product.location}
          </div>
        )}

        {product.stage && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Location:</span> {product.stage}
          </div>
        )}

        {/* Display the last updated date */}
        <div className="mt-1 text-xs text-muted-foreground">
          <span>Last Updated:</span>{" "}
          {new Date(product.updatedAt).toLocaleString()}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
        {product.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
          >
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
