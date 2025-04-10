// Mock database for now, will be replaced with Prisma
// This is temporary until we set up Prisma with MongoDB

import type { Product, Task, RobotStatus } from "./types"

// Mock products data
const products: Product[] = [
  {
    id: "P-001",
    name: "Electronic Component A",
    category: "electronics",
    status: "stored",
    location: "Shelf A1, Stage 1",
    weight: 0.5,
    dimensions: "10 x 5 x 2 cm",
    tags: ["electronics", "fragile"],
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-04-02"),
  },
  {
    id: "P-002",
    name: "Clothing Item B",
    category: "clothing",
    status: "ready-to-ship",
    location: "Shelf A2, Stage 1",
    weight: 0.2,
    dimensions: "30 x 20 x 2 cm",
    tags: ["clothing", "light"],
    createdAt: new Date("2025-03-18"),
    updatedAt: new Date("2025-04-05"),
  },
  {
    id: "P-003",
    name: "Food Product C",
    category: "food",
    status: "stored",
    location: "Shelf B1, Stage 2",
    weight: 1.0,
    dimensions: "20 x 15 x 10 cm",
    tags: ["food", "perishable"],
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-04-01"),
  },
]

// Mock tasks data
const tasks: Task[] = [
  {
    id: "T-001",
    type: "pickup",
    status: "completed",
    priority: "high",
    productId: "P-001",
    sourceLocation: "Shelf A1, Stage 1",
    targetLocation: "Shipping Zone",
    robotId: "PB-001",
    createdAt: new Date("2025-04-05"),
    completedAt: new Date("2025-04-05T14:30:00"),
  },
]

// Mock robot status
const robotStatus: RobotStatus = {
  id: "PB-001",
  name: "PalBoti Prime",
  status: "active",
  battery: 78,
  location: "Zone A",
  load: 45,
  lastUpdated: new Date(),
  currentTaskId: undefined,
}

// Mock database functions
export const db = {
  // Product operations
  getProducts: async (): Promise<Product[]> => {
    return [...products]
  },

  getProductById: async (id: string): Promise<Product | null> => {
    return products.find((p) => p.id === id) || null
  },

  // Task operations
  getTasks: async (): Promise<Task[]> => {
    return [...tasks]
  },

  getTaskById: async (id: string): Promise<Task | null> => {
    return tasks.find((t) => t.id === id) || null
  },

  createTask: async (task: Omit<Task, "id" | "createdAt" | "status">): Promise<Task> => {
    const newTask: Task = {
      id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
      status: "pending",
      createdAt: new Date(),
      ...task,
    }
    tasks.push(newTask)
    return newTask
  },

  updateTaskStatus: async (id: string, status: Task["status"], completedAt?: Date): Promise<Task | null> => {
    const taskIndex = tasks.findIndex((t) => t.id === id)
    if (taskIndex === -1) return null

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      completedAt: status === "completed" ? completedAt || new Date() : tasks[taskIndex].completedAt,
    }

    return tasks[taskIndex]
  },

  // Robot status operations
  getRobotStatus: async (id: string): Promise<RobotStatus | null> => {
    if (id === robotStatus.id) return { ...robotStatus }
    return null
  },

  updateRobotStatus: async (updatedStatus: Partial<RobotStatus>): Promise<RobotStatus> => {
    Object.assign(robotStatus, { ...updatedStatus, lastUpdated: new Date() })
    return { ...robotStatus }
  },
}
