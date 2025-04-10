// Script to initialize MongoDB database with Prisma
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Initializing MongoDB database...")

  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Successfully connected to MongoDB")

    // Check if we can query the database
    const robotCount = await prisma.robot.count()
    console.log(`Found ${robotCount} robots in the database`)

    const productCount = await prisma.product.count()
    console.log(`Found ${productCount} products in the database`)

    const taskCount = await prisma.task.count()
    console.log(`Found ${taskCount} tasks in the database`)

    console.log("Database initialization completed successfully")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
