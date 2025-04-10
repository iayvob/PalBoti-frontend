// Type definitions for our API

export interface Product {
  id: string
  name: string
  category: string
  status: string
  location?: string
  weight?: number
  dimensions?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  type: "pickup" | "delivery" | "scan" | "maintenance" | "charging"
  status: "pending" | "in-progress" | "completed" | "failed"
  priority: "low" | "medium" | "high"
  productId?: string
  sourceLocation?: string
  targetLocation?: string
  robotId?: string
  createdAt: Date
  completedAt?: Date
}

export interface RobotStatus {
  id: string
  name: string
  status: "maintenance" | "active" | "charging" | "idle" | "moving" | "scanning" | "loading"
  battery: number
  location: string
  load: number | null
  lastUpdated: Date
  currentTaskId?: string | null
}

export interface TaskCreationRequest {
  type: "pickup" | "delivery" | "scan" | "maintenance"
  priority: "low" | "medium" | "high"
  productId?: string
  sourceLocation?: string
  targetLocation?: string
  robotId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
