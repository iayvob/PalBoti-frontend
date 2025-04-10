import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Package, ArrowLeft, Edit, Trash2, TruckIcon, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Product ${params.id} | Smart Warehouse Manager`,
    description: "Detailed information about this product",
  }
}

// Mock function to get product by ID
function getProductById(id: string) {
  const products = {
    "P-001": {
      id: "P-001",
      name: "Electronic Component A",
      status: "stored",
      tags: ["electronics", "fragile"],
      description: "High-quality electronic component for industrial use",
      quantity: 15,
      dateAdded: "2025-03-15",
      lastUpdated: "2025-04-02",
      location: "Shelf A1, Stage 1",
      sku: "EC-A-001",
      price: "$129.99",
      weight: "0.5 kg",
      dimensions: "10 x 5 x 2 cm",
      supplier: "ElectroTech Industries",
    },
    "P-002": {
      id: "P-002",
      name: "Clothing Item B",
      status: "ready-to-ship",
      tags: ["clothing", "light"],
      description: "Premium cotton t-shirt, medium size",
      quantity: 50,
      dateAdded: "2025-03-18",
      lastUpdated: "2025-04-05",
      location: "Shelf A2, Stage 1",
      sku: "CL-B-002",
      price: "$24.99",
      weight: "0.2 kg",
      dimensions: "30 x 20 x 2 cm",
      supplier: "Fashion Trends Co.",
    },
  }

  return products[id as keyof typeof products] || null
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "stored":
        return <Package className="h-5 w-5 text-blue-500" />
      case "ready-to-ship":
        return <TruckIcon className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "shipped":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stored":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "ready-to-ship":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "shipped":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
            <p className="text-muted-foreground">{product.id}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="flex items-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Product Details
              </CardTitle>
              <CardDescription>Complete information about this product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{product.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p>{product.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p>{product.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p>{product.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p>{product.quantity}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Additional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p>{product.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p>{product.dimensions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p>{product.supplier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{product.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 border-t pt-6">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Badge variant="outline" className={`${getStatusColor(product.status)} px-3 py-1`}>
                  <span className="flex items-center">
                    {getStatusIcon(product.status)}
                    <span className="ml-1 capitalize">{product.status}</span>
                  </span>
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Date Added</p>
                  <p>{product.dateAdded}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p>{product.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t pt-6">
              <Button className="w-full bg-primary hover:bg-primary/90">Update Status</Button>
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
