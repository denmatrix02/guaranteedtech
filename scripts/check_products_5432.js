require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function check() {
  const direct5432 = process.env.DATABASE_URL.replace(":6543", ":5432").replace("?pgbouncer=true", "");
  console.log("Connecting with 5432...");
  const prisma = new PrismaClient({
    datasources: { db: { url: direct5432 } }
  });
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } }
      }
    });
    console.log(`Found ${products.length} products:`);
    products.forEach(p => console.log(`- ${p.name} | Cat: ${p.category?.name} (${p.category?.slug}) | Brand: ${p.brand?.name}`));
  } catch (err) {
    console.error("5432 failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
