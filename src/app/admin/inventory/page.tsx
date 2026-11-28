import React from "react";
import prisma from "@/lib/prisma";
import { InventoryClient } from "./InventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      stockQuantity: true,
      lowStockThreshold: true,
      availabilityStatus: true,
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      branchStock: true,
    },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Multi-Showroom Stock &amp; Inventory Manager
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Rapidly update on-hand unit allocations between 111/113 Azikiwe Road and No. 2 Asa Road showrooms with live autosave.
        </p>
      </div>

      <InventoryClient initialProducts={products} />
    </div>
  );
}
