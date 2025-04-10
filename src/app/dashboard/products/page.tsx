import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Package, Plus, Filter, Search } from "lucide-react"
import { ProductCard } from "../../../components/products/product-card"
import { Input } from "../../../components/ui/input"

export const metadata = {
  title: "Products | Smart Warehouse Manager",
  description: "View and manage all products in the warehouse system",
}

// Mock data for products
const products = [
  {
    id: "P-001",
    name: "Electronic Component A",
    status: "stored",
    tags: ["electronics", "fragile"],
    description: "High-quality electronic component for industrial use",
    quantity: 15,
    dateAdded: "2025-03-15",
    lastUpdated: "2025-04-02",
  },
  {
    id: "P-002",
    name: "Clothing Item B",
    status: "ready-to-ship",
    tags: ["clothing", "light"],
    description: "Premium cotton t-shirt, medium size",
    quantity: 50,
    dateAdded: "2025-03-18",
    lastUpdated: "2025-04-05",
  },
  {
    id: "P-003",
    name: "Food Product C",
    status: "stored",
    tags: ["food", "perishable"],
    description: "Organic food product with 6-month shelf life",
    quantity: 100,
    dateAdded: "2025-03-20",
    lastUpdated: "2025-04-01",
  },
  {
    id: "P-004",
    name: "Home Goods D",
    status: "processing",
    tags: ["home", "heavy"],
    description: "Decorative home item for living room",
    quantity: 25,
    dateAdded: "2025-03-22",
    lastUpdated: "2025-04-03",
  },
  {
    id: "P-005",
    name: "Toy Item E",
    status: "stored",
    tags: ["toys", "fragile"],
    description: "Educational toy for children ages 3-5",
    quantity: 75,
    dateAdded: "2025-03-25",
    lastUpdated: "2025-04-04",
  },
  {
    id: "P-006",
    name: "Electronic Component F",
    status: "ready-to-ship",
    tags: ["electronics", "valuable"],
    description: "High-end electronic device with advanced features",
    quantity: 10,
    dateAdded: "2025-03-28",
    lastUpdated: "2025-04-06",
  },
]

export default function ProductsPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">Products Management</h1>
            <p className="text-muted-foreground">View and manage all products in the warehouse system</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Product Inventory
          </CardTitle>
          <CardDescription>Complete list of products with status and details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8 border-primary/30 focus:border-primary"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Stored
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Ready to Ship
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
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
  )
}
