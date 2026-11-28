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
}

main().catch(console.error).finally(() => prisma.$disconnect());
