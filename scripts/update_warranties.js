const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Standardizing product warranties in database...");

  // Update REFURBISHED to 3 months
  const refUpdate = await prisma.product.updateMany({
    where: { condition: "REFURBISHED" },
    data: {
      warrantyMonths: 3,
      warrantyDetails: "3 Months GTC Comprehensive Diagnostic & Hardware Warranty",
    },
  });
  console.log(`Updated ${refUpdate.count} REFURBISHED products to 3 months warranty.`);

  // Update OPEN_BOX to 6 months
  const obUpdate = await prisma.product.updateMany({
    where: { condition: "OPEN_BOX" },
    data: {
      warrantyMonths: 6,
      warrantyDetails: "6 Months GTC Comprehensive Warranty",
    },
  });
  console.log(`Updated ${obUpdate.count} OPEN_BOX products to 6 months warranty.`);

  // Update BRAND_NEW to 12 months with manufacturer details
  const bnUpdate = await prisma.product.updateMany({
    where: { condition: "BRAND_NEW" },
    data: {
      warrantyMonths: 12,
      warrantyDetails: "1-Year Official Brand Manufacturer Warranty",
    },
  });
  console.log(`Updated ${bnUpdate.count} BRAND_NEW products to 12 months (1-Year) manufacturer warranty.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
