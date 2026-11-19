import React from "react";
import prisma from "@/lib/prisma";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        shipment: true,
        payment: true,
      },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, basePrice: true, sku: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Order Management &amp; Fulfillment Queue
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Review website purchases, process manual WhatsApp sales, manage payments, and generate GIG Logistics waybills.
        </p>
      </div>

      <OrdersClient initialOrders={orders} products={products} />
    </div>
  );
}

