import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryState,
      deliveryCity,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      items,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: "Cart is empty." }, { status: 400 });
    }

    if (!customerName || !customerPhone || !customerEmail || !deliveryState || !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: "Please provide all required shipping details." },
        { status: 400 }
      );
    }

    // SERVER-SIDE PRICE AND STOCK VERIFICATION
    let computedSubtotal = 0;
    const verifiedOrderItems: any[] = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product.name}` },
          { status: 400 }
        );
      }

      // Check stock
      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stockQuantity}`,
          },
          { status: 400 }
        );
      }

      let unitPrice = dbProduct.basePrice;
      let variantName = null;

      if (item.variantId) {
        const variant = dbProduct.variants.find((v: any) => v.id === item.variantId);
        if (variant) {
          unitPrice += variant.priceAdjustment;
          variantName = variant.name;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      computedSubtotal += itemTotal;

      verifiedOrderItems.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        productName: dbProduct.name,
        variantName,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Server-side delivery fee calculation (Free over ₦1M, otherwise ₦5,000)
    const deliveryFee = computedSubtotal >= 1000000 ? 0 : 5000;
    const totalAmount = computedSubtotal + deliveryFee;

    // Generate unique order number: GT-YYYY-RANDOM
    const orderNumber = `GT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order and deduct stock transactionally
    const order = await prisma.$transaction(async (tx: any) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          deliveryState,
          deliveryCity,
          deliveryAddress,
          deliveryInstructions,
          channel: "WEBSITE",
          status: paymentMethod === "CASH_ON_DELIVERY" ? "PROCESSING" : "AWAITING_PAYMENT",
          paymentStatus: "UNPAID",
          paymentMethod: paymentMethod || "PAYSTACK",
          subtotal: computedSubtotal,
          deliveryFee,
          totalAmount,
          items: {
            create: verifiedOrderItems,
          },
          shipment: {
            create: {
              carrier: "GIG_LOGISTICS",
              trackingNumber: `GIG-GT-${Math.floor(10000000 + Math.random() * 90000000)}`,
              status: "BOOKED",
              statusDescription: "Shipment manifest created, awaiting warehouse pickup",
              codAmount: paymentMethod === "CASH_ON_DELIVERY" ? totalAmount : 0,
            },
          },
        },
      });

      // 2. Decrement stock
      for (const item of verifiedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
    });
  } catch (err: any) {
    console.error("Checkout submission error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

