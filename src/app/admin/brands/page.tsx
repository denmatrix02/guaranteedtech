import React from "react";
import prisma from "@/lib/prisma";
import { BrandsClient } from "./BrandsClient";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Hardware Manufacturers &amp; Brands
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Manage manufacturer partnerships, brand showcase badges, and catalog filter mapping.
        </p>
      </div>

      <BrandsClient initialBrands={brands} />
    </div>
  );
}
