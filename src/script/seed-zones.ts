import prisma from "../lib/prisma"

async function seedZones() {
  console.log("Seeding warehouse zones...")

  // Delete existing zones
  await prisma.zone.deleteMany({})

  // Create new zones
  const zones = [
    { zoneId: "A1", type: "storage", status: "normal", items: 120, capacity: 150 },
    { zoneId: "A2", type: "storage", status: "normal", items: 95, capacity: 150 },
    { zoneId: "A3", type: "storage", status: "attention", items: 150, capacity: 150 },
    { zoneId: "B1", type: "picking", status: "normal", items: 45, capacity: 75 },
    { zoneId: "B2", type: "picking", status: "normal", items: 30, capacity: 75 },
    { zoneId: "B3", type: "picking", status: "empty", items: 0, capacity: 75 },
    { zoneId: "C1", type: "shipping", status: "normal", items: 75, capacity: 100 },
    { zoneId: "C2", type: "shipping", status: "busy", items: 200, capacity: 200 },
    { zoneId: "C3", type: "receiving", status: "normal", items: 60, capacity: 100 },
  ]

  for (const zone of zones) {
    await prisma.zone.create({
      data: zone,
    })
  }

  console.log("Seeded warehouse zones successfully!")

  // Seed efficiency records
  console.log("Seeding efficiency records...")

  await prisma.efficiencyRecord.deleteMany({})

  const currentYear = new Date().getFullYear()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const records = months.slice(0, 6).map((month, index) => ({
    month,
    year: currentYear,
    rate: 90 + Math.random() * 8, // Random value between 90 and 98
  }))

  for (const record of records) {
    await prisma.efficiencyRecord.create({
      data: record,
    })
  }

  console.log("Seeded efficiency records successfully!")
}

seedZones()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
