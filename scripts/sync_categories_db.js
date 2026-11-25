require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

const categoriesToSync = [
  { name: "Laptops", slug: "laptops", description: "Certified business laptops, executive ultrabooks, student laptops & workstation machines.", displayOrder: 1 },
  { name: "Desktops", slug: "desktops", description: "Tower desktops, all-in-one PCs, and micro form factor workstations.", displayOrder: 2 },
  { name: "A4 Printers", slug: "a4-printers", description: "LaserJet printers, high-capacity MegaTank/EcoTank multifunction color printers.", displayOrder: 3 },
  { name: "Receipt Printers", slug: "receipt-printers", description: "Thermal POS 58mm & 80mm receipt printers with USB, Bluetooth, and LAN interfaces.", displayOrder: 4 },
  { name: "Projectors", slug: "projectors", description: "Full HD & 4K presentation projectors for executive boardrooms, churches & classrooms.", displayOrder: 5 },
  { name: "Routers", slug: "routers", description: "Dual-band Gigabit Wi-Fi 6 routers, multi-WAN load balance routers & VPN gateways.", displayOrder: 6 },
  { name: "Access Points", slug: "access-points", description: "Long-range ceiling and outdoor dual-band PoE wireless access points.", displayOrder: 7 },
  { name: "Network Cables", slug: "network-cables", description: "Pure copper Cat6 & Cat6A patch cords, RJ45 connectors & 305m roll cables.", displayOrder: 8 },
  { name: "Laptop Batteries", slug: "laptop-batteries", description: "Original OEM certified replacement batteries for HP, Dell, Lenovo, Apple & ASUS.", displayOrder: 9 },
  { name: "UPS", slug: "ups", description: "Pure sine wave uninterruptible power supplies, voltage surge protectors & power backups.", displayOrder: 10 },
  { name: "Point of Sale Systems", slug: "pos-systems", description: "Touchscreen POS terminals, 1D/2D barcode scanners, metal cash drawers & accessories.", displayOrder: 11 },
  { name: "Other Accessories", slug: "other-accessories", description: "Ergonomic mice, mechanical keyboards, multi-port USB-C hubs, power adapters & laptop bags.", displayOrder: 12 },
];

async function main() {
  console.log("Upserting official categories into database...");
  for (const cat of categoriesToSync) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isPopular: true,
      },
    });
    console.log(`Synced: ${record.name} (${record.slug})`);
  }
  console.log("Done syncing categories.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
