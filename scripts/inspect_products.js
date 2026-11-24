const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, condition: true, warrantyMonths: true }
  });
  console.log(`Found ${products.length} products:`);
  for (const p of products) {
    console.log(`- [${p.condition}] (${p.warrantyMonths}M) ${p.name} -> /products/${p.slug}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
