// Script to seed the database with initial data
import prisma from "../lib/prisma"

async function main() {
  console.log("Seeding database...")

  // Create robot
  const robot = await prisma.robot.upsert({
    where: { robotId: "PB-001" },
    update: {},
    create: {
      robotId: "PB-001",
      name: "PalBoti Prime",
      status: "active",
      battery: 78,
      location: "Zone A",
      load: 45,
      lastUpdated: new Date(),
    },
  })

  console.log("Created robot:", robot)

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { productId: "P-001" },
      update: {},
      create: {
        productId: "P-001",
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
    }),
    prisma.product.upsert({
      where: { productId: "P-002" },
      update: {},
      create: {
        productId: "P-002",
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
    }),
    prisma.product.upsert({
      where: { productId: "P-003" },
      update: {},
      create: {
        productId: "P-003",
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
    }),
  ])

  console.log(`Created ${products.length} products`)

  // Create a completed task
  const task = await prisma.task.create({
    data: {
      taskId: "T-001",
      type: "pickup",
      status: "completed",
      priority: "high",
      sourceLocation: "Shelf A1, Stage 1",
      targetLocation: "Shipping Zone",
      createdAt: new Date("2025-04-05"),
      completedAt: new Date("2025-04-05T14:30:00"),
      product: {
        connect: {
          id: products[0].id,
        },
      },
      robot: {
        connect: {
          id: robot.id,
        },
      },
    },
  })

  console.log("Created task:", task)

  console.log("Database seeding completed successfully")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
