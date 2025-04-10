import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Warehouse, Plus, Filter, Search } from "lucide-react"
import { Input } from "../../../components/ui/input"
import WarehouseMapSection from "../../../components/dashboard/warehouse-map-section"

export const metadata = {
  title: "Warehouse | Smart Warehouse Manager",
  description: "View and manage warehouse zones and storage areas",
}

// Mock data for warehouse zones
const zones = [
  { id: "A1", type: "storage", status: "normal", items: 120, capacity: 150, utilization: 80 },
  { id: "A2", type: "storage", status: "normal", items: 95, capacity: 150, utilization: 63 },
  { id: "A3", type: "storage", status: "attention", items: 150, capacity: 150, utilization: 100 },
  { id: "B1", type: "picking", status: "normal", items: 45, capacity: 75, utilization: 60 },
  { id: "B2", type: "picking", status: "normal", items: 30, capacity: 75, utilization: 40 },
  { id: "B3", type: "picking", status: "empty", items: 0, capacity: 75, utilization: 0 },
  { id: "C1", type: "shipping", status: "normal", items: 75, capacity: 100, utilization: 75 },
  { id: "C2", type: "shipping", status: "busy", items: 200, capacity: 200, utilization: 100 },
  { id: "C3", type: "receiving", status: "normal", items: 60, capacity: 100, utilization: 60 },
]

export default function WarehousePage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">Warehouse Management</h1>
            <p className="text-muted-foreground">Monitor and manage warehouse zones, storage areas, and capacity</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Zone
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Warehouse className="mr-2 h-5 w-5 text-primary" />
              Warehouse Map
            </CardTitle>
            <CardDescription>Live view of warehouse zones</CardDescription>
          </CardHeader>
          <CardContent>
            <WarehouseMapSection />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Warehouse className="mr-2 h-5 w-5 text-primary" />
              Zone Statistics
            </CardTitle>
            <CardDescription>Capacity and utilization by zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search zones..."
                  className="w-full pl-8 border-primary/30 focus:border-primary"
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">{zone.id}</span>
                      <span className="ml-2 text-xs text-muted-foreground capitalize">({zone.type})</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        zone.status === "normal"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : zone.status === "attention"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : zone.status === "busy"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                      }
                    >
                      {zone.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Items</p>
                      <p className="font-medium">{zone.items}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-medium">{zone.capacity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Utilization</p>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${zone.utilization}%` }}></div>
                      </div>
                      <p className="text-xs text-right mt-1">{zone.utilization}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
