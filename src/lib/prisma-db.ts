import prisma from "./prisma"
import type { Product, Task, RobotStatus } from "./types"

// Product operations with Prisma
export const getProducts = async (): Promise<Product[]> => {
  const products = await prisma.product.findMany()
  return products.map((p: {
    productId: string;
    name: string;
    category: string;
    status: string;
    location?: string | null;
    weight?: number | null;
    dimensions?: string | null;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }) => ({
    id: p.productId,
    name: p.name,
    category: p.category,
    status: p.status,
    location: p.location || undefined,
    weight: p.weight || undefined,
    dimensions: p.dimensions || undefined,
    tags: p.tags,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }))
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { productId: id },
  })

  if (!product) return null

  return {
    id: product.productId,
    name: product.name,
    category: product.category,
    status: product.status,
    location: product.location || undefined,
    weight: product.weight || undefined,
    dimensions: product.dimensions || undefined,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

// Task operations with Prisma
export const getTasks = async (): Promise<Task[]> => {
  const tasks = await prisma.task.findMany()

  return tasks.map((t: { taskId: any; type: string; status: string; priority: string; productId: { toString: () => any }; sourceLocation: any; targetLocation: any; robotId: any; createdAt: any; completedAt: any }) => ({
    id: t.taskId,
    type: t.type as Task["type"],
    status: t.status as Task["status"],
    priority: t.priority as Task["priority"],
    productId: t.productId ? t.productId.toString() : undefined,
    sourceLocation: t.sourceLocation || undefined,
    targetLocation: t.targetLocation || undefined,
    robotId: t.robotId || undefined,
    createdAt: t.createdAt,
    completedAt: t.completedAt || undefined,
  }))
}

export const getTaskById = async (id: string): Promise<Task | null> => {
  const task = await prisma.task.findUnique({
    where: { taskId: id },
  })

  if (!task) return null

  return {
    id: task.taskId,
    type: task.type as Task["type"],
    status: task.status as Task["status"],
    priority: task.priority as Task["priority"],
    productId: task.productId ? task.productId.toString() : undefined,
    sourceLocation: task.sourceLocation || undefined,
    targetLocation: task.targetLocation || undefined,
    robotId: task.robotId || undefined,
    createdAt: task.createdAt,
    completedAt: task.completedAt || undefined,
  }
}

export const createTask = async (task: Omit<Task, "id" | "createdAt" | "status">): Promise<Task> => {
  // Generate a task ID with format T-XXX
  const taskCount = await prisma.task.count()
  const taskId = `T-${String(taskCount + 1).padStart(3, "0")}`

  // Find product by productId if provided
  let productObjectId = null
  if (task.productId) {
    const product = await prisma.product.findUnique({
      where: { productId: task.productId },
    })
    if (product) {
      productObjectId = product.id
    }
  }

  // Find robot by robotId if provided
  let robotObjectId = null
  if (task.robotId) {
    const robot = await prisma.robot.findUnique({
      where: { robotId: task.robotId },
    })
    if (robot) {
      robotObjectId = robot.id
    }
  }

  const newTask = await prisma.task.create({
    data: {
      taskId,
      type: task.type,
      status: "pending",
      priority: task.priority,
      productId: productObjectId,
      sourceLocation: task.sourceLocation,
      targetLocation: task.targetLocation,
      robotId: robotObjectId,
    },
  })

  return {
    id: newTask.taskId,
    type: newTask.type as Task["type"],
    status: newTask.status as Task["status"],
    priority: newTask.priority as Task["priority"],
    productId: task.productId,
    sourceLocation: newTask.sourceLocation || undefined,
    targetLocation: newTask.targetLocation || undefined,
    robotId: task.robotId,
    createdAt: newTask.createdAt,
    completedAt: undefined,
  }
}

export const updateTaskStatus = async (
  id: string,
  status: Task["status"],
  completedAt?: Date,
): Promise<Task | null> => {
  const task = await prisma.task.findUnique({
    where: { taskId: id },
  })

  if (!task) return null

  const updatedTask = await prisma.task.update({
    where: { taskId: id },
    data: {
      status,
      completedAt: status === "completed" ? completedAt || new Date() : task.completedAt,
    },
  })

  return {
    id: updatedTask.taskId,
    type: updatedTask.type as Task["type"],
    status: updatedTask.status as Task["status"],
    priority: updatedTask.priority as Task["priority"],
    productId: updatedTask.productId ? updatedTask.productId.toString() : undefined,
    sourceLocation: updatedTask.sourceLocation || undefined,
    targetLocation: updatedTask.targetLocation || undefined,
    robotId: updatedTask.robotId || undefined,
    createdAt: updatedTask.createdAt,
    completedAt: updatedTask.completedAt || undefined,
  }
}

// Robot status operations with Prisma
export const getRobotStatus = async (id: string): Promise<RobotStatus | null> => {
  const robot = await prisma.robot.findUnique({
    where: { robotId: id },
  })

  if (!robot) return null

  return {
    id: robot.robotId,
    name: robot.name,
    status: robot.status as RobotStatus["status"],
    battery: robot.battery,
    location: robot.location,
    load: robot.load,
    lastUpdated: robot.lastUpdated,
    currentTaskId: robot.currentTaskId || undefined,
  }
}

export const updateRobotStatus = async (updatedStatus: Partial<RobotStatus>): Promise<RobotStatus> => {
  const robot = await prisma.robot.findUnique({
    where: { robotId: updatedStatus.id },
  })

  if (!robot) {
    throw new Error(`Robot with ID ${updatedStatus.id} not found`)
  }

  const updated = await prisma.robot.update({
    where: { robotId: updatedStatus.id },
    data: {
      status: updatedStatus.status || robot.status,
      battery: updatedStatus.battery || robot.battery,
      location: updatedStatus.location || robot.location,
      load: updatedStatus.load || robot.load,
      lastUpdated: new Date(),
      currentTaskId: updatedStatus.currentTaskId || robot.currentTaskId,
    },
  })

  // Log the status change
  await prisma.robotLog.create({
    data: {
      robotId: robot.id,
      eventType: "STATUS_UPDATE",
      message: `Robot status updated to ${updatedStatus.status || robot.status}`,
      data: updatedStatus,
    },
  })

  return {
    id: updated.robotId,
    name: updated.name,
    status: updated.status as RobotStatus["status"],
    battery: updated.battery,
    location: updated.location,
    load: updated.load,
    lastUpdated: updated.lastUpdated,
    currentTaskId: updated.currentTaskId || undefined,
  }
}
