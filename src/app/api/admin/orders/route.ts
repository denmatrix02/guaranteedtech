import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        shipment: true,
        payment: true,
      },
    });
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, newStatus, newPaymentStatus } = body;

    if (action === "UPDATE_STATUS") {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          paymentStatus: newPaymentStatus,
        },
      });
      return NextResponse.json({ success: true, order: updated });
    }

    if (action === "CREATE_WHATSAPP_ORDER") {
      const {
        customerName,
        customerPhone,
        customerEmail,
        deliveryState,
        deliveryCity,
        deliveryAddress,
        items, // [{ productId, quantity }]
        paymentMethod,
        internalNotes,
      } = body;

      let subtotal = 0;
      const orderItems = [];

      for (const it of items) {
        const prod = await prisma.product.findUnique({ where: { id: it.productId } });
        if (prod) {
          const itemTotal = prod.basePrice * it.quantity;
          subtotal += itemTotal;
          orderItems.push({
            productId: prod.id,
            productName: prod.name,
            unitPrice: prod.basePrice,
            quantity: it.quantity,
            totalPrice: itemTotal,
          });
        }
      }

      const deliveryFee = subtotal >= 1000000 ? 0 : 5000;
      const totalAmount = subtotal + deliveryFee;
      const orderNumber = `GT-WA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail: customerEmail || `${customerPhone.replace(/\D/g, "")}@whatsapp.customer`,
          deliveryState,
          deliveryCity,
          deliveryAddress,
          channel: "WHATSAPP", // Explicitly flagged as manual WhatsApp intake!
          status: "PROCESSING",
          paymentStatus: "PAID",
          paymentMethod: paymentMethod || "CASH_ON_DELIVERY",
          subtotal,
          deliveryFee,
          totalAmount,
          internalNotes: internalNotes || "Direct WhatsApp manual order logged by store staff.",
          items: {
            create: orderItems,
          },
          shipment: {
            create: {
              carrier: "GIG_LOGISTICS",
              trackingNumber: `GIG-WA-${Math.floor(10000000 + Math.random() * 90000000)}`,
              status: "BOOKED",
              statusDescription: "Shipment registered via GIG manual dispatch intake",
            },
          },
        },
      });

      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ success: false, error: "Invalid order action" }, { status: 400 });
  } catch (err: any) {
    console.error("Order update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

