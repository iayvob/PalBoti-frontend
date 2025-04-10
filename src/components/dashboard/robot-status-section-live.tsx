"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Battery, Circle, Cpu, Gauge, Plus, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle } from "../ui/toast"
import useRobotStatus from "../../hooks/use-robot-status"

export default function RobotStatusSectionLive() {
  const { status, loading, error } = useRobotStatus("PB-001")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: false,
    location: false,
  })

  useEffect(() => {
    if (status) {
      setFormData({
        name: status.name,
        location: status.location,
      })
    }
  }, [status])

  const handleUpdateRobot = async () => {
    // Validate form
    const errors = {
      name: !formData.name.trim(),
      location: !formData.location.trim(),
    }

    setFormErrors(errors)

    if (errors.name || errors.location) {
      return
    }

    try {
      // Send update to API
      const response = await fetch("/api/robot-status/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "PB-001",
          name: formData.name,
          location: formData.location,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update robot information")
      }

      // Show success toast
      setShowSuccessToast(true)

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowSuccessToast(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating robot:", error)
      // Could add error toast here
    }
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

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 robot-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Cpu className="mr-2 h-5 w-5 text-primary" />
              Robot Status
            </CardTitle>
            <CardDescription>Loading robot status...</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse">
              <Cpu className="h-10 w-10 text-primary/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !status) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 robot-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Cpu className="mr-2 h-5 w-5 text-primary" />
              Robot Status
            </CardTitle>
            <CardDescription>Error loading robot status</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 dark:bg-red-950 dark:text-red-200 dark:border-red-800">
            {error || "Failed to load robot status"}
          </div>
          <Button className="w-full mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
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
            <CardDescription>Real-time warehouse robot status</CardDescription>
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
                  <StatusIndicator status={status.status} />
                  <span className="ml-2 font-medium">{status.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {status.location} • ID: {status.id}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Battery className="mr-1 h-4 w-4 text-muted-foreground" />
                  <div className="w-16">
                    <Progress value={status.battery} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Gauge className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{status.load}%</span>
                </div>
              </div>
            </div>

            {status.currentTaskId && (
              <div className="mt-2 p-2 bg-primary/10 rounded-md">
                <p className="text-xs font-medium">Current Task: {status.currentTaskId}</p>
              </div>
            )}

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
