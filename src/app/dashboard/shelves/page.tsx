import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Layers, Package, Plus, AlertCircle } from "lucide-react"
import ShelfSystem from "../../../components/shelves/shelf-system"

export const metadata = {
  title: "Shelves | Smart Warehouse Manager",
  description: "Monitor and manage product placement across warehouse shelving units",
}

export default function ShelvesPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">Shelves Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage product placement across warehouse shelving units
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Shelf
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Shelves</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
            <Layers className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Available Slots</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
            <Package className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Capacity Utilization</p>
              <h3 className="text-2xl font-bold">67%</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5 text-primary" />
            Shelf System Overview
          </CardTitle>
          <CardDescription>Each shelf contains three stages for product placement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Available
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              Occupied
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              Reserved
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Maintenance
            </Badge>
          </div>

          <ShelfSystem />
        </CardContent>
      </Card>
    </>
  )
}
