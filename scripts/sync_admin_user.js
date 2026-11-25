const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function main() {
  const hash = await bcrypt.hash("Admin@GT2026!", 10);

  // 1. Ensure admin@guaranteedtech.ng exists and is Executive Admin
  const adminNg = await prisma.user.upsert({
    where: { email: "admin@guaranteedtech.ng" },
    update: {
      name: "Executive Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash: hash
    },
    create: {
      email: "admin@guaranteedtech.ng",
      name: "Executive Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash: hash
    }
  });
  console.log("admin@guaranteedtech.ng upserted:", adminNg.email);

  // 2. Ensure admin@guaranteedtech.org exists as well
  const adminOrg = await prisma.user.upsert({
    where: { email: "admin@guaranteedtech.org" },
    update: {
      name: "Executive Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash: hash
    },
    create: {
      email: "admin@guaranteedtech.org",
      name: "Executive Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash: hash
    }
  });
  console.log("admin@guaranteedtech.org upserted:", adminOrg.email);

  // 3. Ensure guarateedtech17@gmail.com and guaranteedtech17@gmail.com exist
  const gmail = await prisma.user.upsert({
    where: { email: "guaranteedtech17@gmail.com" },
    update: {
      name: "Executive Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash: hash
    },
    create: {
      email: "guaranteedtech17@gmail.com",
      name: "Executive Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      passwordHash: hash
    }
  });
  console.log("guaranteedtech17@gmail.com upserted:", gmail.email);

  const allAdmins = await prisma.user.findMany({
    where: { role: "SUPER_ADMIN" },
    select: { id: true, email: true, name: true, role: true }
  });
  console.log("All Super Admins in DB:", allAdmins);
}

main().catch(console.error).finally(() => prisma.$disconnect());
