import { PrismaClient } from "@prisma/client"

// Extend the NodeJS.Global interface to include the prisma property
declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient
    }
  }

  // Extend the global object to include the prisma property
  var prisma: PrismaClient | undefined
}

// Create a single instance of PrismaClient
// and reuse it to avoid too many connections
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  // Use a global variable in development to avoid exhausting your
  // connection pool during hot-reload
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
