const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding realistic sample orders and GIG shipments...");

  const customer = await prisma.user.findFirst({ where: { email: "customer@guaranteedtech.ng" } });
  const products = await prisma.product.findMany({ take: 3 });

  if (!products.length) {
    console.error("No products found to attach to orders.");
    return;
  }

  // Order 1: Delivered ThinkPad in Lagos (Bank Transfer / Confirmed)
  const o1 = await prisma.order.create({
    data: {
      orderNumber: "GT-2026-08492",
      channel: "WEBSITE",
      userId: customer ? customer.id : null,
      customerName: "Emeka Okafor",
      customerEmail: "emeka.okafor@techhub.ng",
      customerPhone: "+234 803 111 2233",
      deliveryAddress: "Plot 14, Admiralty Way, Lekki Phase 1",
      deliveryCity: "Lekki",
      deliveryState: "Lagos",
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "BANK_TRANSFER",
      subtotal: 485000,
      deliveryFee: 3500,
      totalAmount: 488500,
      notes: "Delivered to reception at TechHub.",
      items: {
        create: [
          {
            productId: products[0].id,
            productName: products[0].name,
            unitPrice: 485000,
            quantity: 1,
            totalPrice: 485000,
          },
        ],
      },
      shipment: {
        create: {
          carrier: "GIG_LOGISTICS",
          trackingNumber: "GIG-LOS-883492",
          waybillNumber: "WAYBILL-883492",
          status: "DELIVERED",
          pickupStation: "GIG Express Lekki Terminal",
          statusDescription: "Delivered to Lekki office reception",
          deliveredAt: new Date(Date.now() - 86400000 * 2),
        },
      },
    },
  });

  // Order 2: In-Transit HP EliteBook to Abuja (WhatsApp Intake / Paystack)
  const o2 = await prisma.order.create({
    data: {
      orderNumber: "GT-2026-08501",
      channel: "WHATSAPP",
      userId: customer ? customer.id : null,
      customerName: "Dr. Aisha Bello",
      customerEmail: "aisha.bello@fct.gov.ng",
      customerPhone: "+234 802 444 7788",
      deliveryAddress: "Suite 402, Federal Secretariat Complex, Shehu Shagari Way",
      deliveryCity: "Central Business District",
      deliveryState: "Abuja",
      status: "SHIPPED",
      paymentStatus: "PAID",
      paymentMethod: "PAYSTACK",
      subtotal: 620000,
      deliveryFee: 6500,
      totalAmount: 626500,
      internalNotes: "WhatsApp ref: WA-2026-0219-447. Requested express delivery to Abuja.",
      items: {
        create: [
          {
            productId: products[1] ? products[1].id : products[0].id,
            productName: products[1] ? products[1].name : products[0].name,
            unitPrice: 620000,
            quantity: 1,
            totalPrice: 620000,
          },
        ],
      },
      shipment: {
        create: {
          carrier: "GIG_LOGISTICS",
          trackingNumber: "GIG-ABJ-904122",
          waybillNumber: "WAYBILL-904122",
          status: "IN_TRANSIT",
          pickupStation: "GIG Express Wuse 2 Hub, Abuja",
          statusDescription: "Departed Lagos sort facility, en route to Abuja Hub",
        },
      },
    },
  });

  // Order 3: Processing Gaming / CAD Laptop to Port Harcourt (Cash on Delivery)
  const o3 = await prisma.order.create({
    data: {
      orderNumber: "GT-2026-08515",
      channel: "WEBSITE",
      userId: customer ? customer.id : null,
      customerName: "Engr. Nnamdi Eze",
      customerEmail: "nnamdi.eze@shell-partners.ng",
      customerPhone: "+234 809 555 6677",
      deliveryAddress: "32 Trans-Amadi Industrial Layout",
      deliveryCity: "Port Harcourt",
      deliveryState: "Rivers",
      status: "PROCESSING",
      paymentStatus: "PENDING_VERIFICATION",
      paymentMethod: "CASH_ON_DELIVERY",
      subtotal: 1450000,
      deliveryFee: 7500,
      totalAmount: 1457500,
      notes: "Customer requested terminal pickup and inspection before cash payment.",
      items: {
        create: [
          {
            productId: products[2] ? products[2].id : products[0].id,
            productName: products[2] ? products[2].name : products[0].name,
            unitPrice: 1450000,
            quantity: 1,
            totalPrice: 1450000,
          },
        ],
      },
      shipment: {
        create: {
          carrier: "GIG_LOGISTICS",
          trackingNumber: "GIG-PHC-771239",
          waybillNumber: "WAYBILL-771239",
          status: "BOOKED",
          pickupStation: "GIG Express Trans-Amadi Hub",
          statusDescription: "Waybill generated, waiting carrier dispatch",
          codAmount: 1457500,
        },
      },
    },
  });

  console.log("Successfully seeded 3 realistic Nigerian orders with GIG tracking:", [
    o1.orderNumber,
    o2.orderNumber,
    o3.orderNumber,
  ]);
}

main()
  .catch((e) => {
    console.error("Error seeding orders:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
