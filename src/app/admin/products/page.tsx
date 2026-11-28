import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import { ProductsTableClient } from "./ProductsTableClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        branchStock: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Hardware Catalog &amp; Products
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Complete inventory control for {products.length} systems across Aba showrooms, multi-branch stock, pricing &amp; specifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2]" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Interactive Products Table Client */}
      <ProductsTableClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
