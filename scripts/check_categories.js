require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function main() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, description: true }
  });
  console.log("Current Categories in DB:", categories);

  const brands = await prisma.brand.findMany({
    select: { id: true, name: true, slug: true }
  });
  console.log("Current Brands in DB:", brands);
}

main().catch(console.error).finally(() => prisma.$disconnect());
