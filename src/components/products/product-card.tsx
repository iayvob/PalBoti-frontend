import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Package, TruckIcon, CheckCircle, Clock } from "lucide-react"

interface Product {
  id: string
  name: string
  status: string
  tags: string[]
  description?: string
  quantity?: number
  dateAdded?: string
  lastUpdated?: string
}

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "stored":
        return <Package className="h-4 w-4 text-blue-500" />
      case "ready-to-ship":
        return <TruckIcon className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "shipped":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Package className="h-4 w-4" />
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

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "electronics":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "clothing":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
      case "food":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "home":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
      case "toys":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100"
      case "fragile":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "heavy":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
      case "light":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100"
      case "perishable":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      case "valuable":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 border rounded-md bg-card">
        <div className="flex items-center">
          {getStatusIcon(product.status)}
          <span className="ml-2 text-sm font-medium truncate max-w-[120px]">{product.name}</span>
        </div>
        <Badge variant="outline" className={getStatusColor(product.status)}>
          {product.status}
        </Badge>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.id}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(product.status)}>
            <span className="flex items-center">
              {getStatusIcon(product.status)}
              <span className="ml-1 capitalize">{product.status}</span>
            </span>
          </Badge>
        </div>

        {product.description && <p className="text-sm text-muted-foreground mt-2">{product.description}</p>}

        {product.quantity && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Quantity:</span> {product.quantity}
          </div>
        )}

        {product.dateAdded && (
          <div className="mt-1 text-xs text-muted-foreground">
            <span>Added:</span> {product.dateAdded}
          </div>
        )}

        {product.lastUpdated && (
          <div className="text-xs text-muted-foreground">
            <span>Updated:</span> {product.lastUpdated}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
        {product.tags.map((tag) => (
          <Badge key={tag} variant="outline" className={getTagColor(tag)}>
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}
