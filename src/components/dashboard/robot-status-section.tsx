"use client"

import type React from "react"

import { useState } from "react"
import { Battery, Circle, Cpu, Gauge, Plus, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle } from "../ui/toast"

// Initial robot data
const initialRobot = {
  id: "PB-001",
  name: "PalBoti Prime",
  status: "active",
  battery: 78,
  load: 45,
  location: "Zone A",
}

export default function RobotStatusSection() {
  const [robot, setRobot] = useState(initialRobot)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: false,
    location: false,
  })

  const handleUpdateRobot = () => {
    // Validate form
    const errors = {
      name: !formData.name.trim(),
      location: !formData.location.trim(),
    }

    setFormErrors(errors)

    if (errors.name || errors.location) {
      return
    }

    // Update robot data
    setRobot({
      ...robot,
      name: formData.name,
      location: formData.location,
    })

    // Show success toast
    setShowSuccessToast(true)

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)

    // Reset form
    setFormData({
      name: "",
      location: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when typing
    if (value.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  return (
    <>
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 robot-card animate-pulse-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Cpu className="mr-2 h-5 w-5 text-primary" />
              Robot Status
            </CardTitle>
            <CardDescription>Current status of warehouse robot</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Configure Robot</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Robot Information</DialogTitle>
                <DialogDescription>Modify the robot's name and current location.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Robot Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter robot name"
                    className={formErrors.name ? "error-field" : ""}
                  />
                  {formErrors.name && <p className="error-message">Robot name is required</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter current location"
                    className={formErrors.location ? "error-field" : ""}
                  />
                  {formErrors.location && <p className="error-message">Location is required</p>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleUpdateRobot} className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  <StatusIndicator status={robot.status} />
                  <span className="ml-2 font-medium">{robot.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {robot.location} • ID: {robot.id}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Battery className="mr-1 h-4 w-4 text-muted-foreground" />
                  <div className="w-16">
                    <Progress value={robot.battery} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Gauge className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{robot.load}%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Add More Robots</h4>
              <p className="text-xs text-muted-foreground mb-3">
                The system is designed to scale with your warehouse needs.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Robot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSuccessToast && (
        <ToastProvider>
          <Toast>
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>Robot information has been updated successfully.</ToastDescription>
            <ToastClose onClick={() => setShowSuccessToast(false)} />
          </Toast>
        </ToastProvider>
      )}
    </>
  )
}

function StatusIndicator({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500"
      case "charging":
        return "text-yellow-500"
      case "idle":
        return "text-blue-500"
      case "maintenance":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return <Circle className={`h-3 w-3 fill-current ${getStatusColor(status)}`} />
}
