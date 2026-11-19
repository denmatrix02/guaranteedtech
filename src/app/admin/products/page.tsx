import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import {
  Plus,
  Package,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Inventory &amp; Product Management
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Manage your verified catalog of {products.length} computers, hardware specifications, and stock quantities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[1.5]" /> Add New Computer
          </Link>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Package className="w-4 h-4 text-[#FFB200] stroke-[1.5]" />
            <span className="font-normal text-slate-800">{products.length} Registered Systems</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Brand / Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Price (₦)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {products.map((p: any) => {
                const img = p.images?.[0]?.url || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&q=80";
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                          <Image src={img} alt={p.name} fill className="object-contain p-1" />
                        </div>
                        <div className="max-w-xs">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="font-normal text-slate-800 hover:text-[#FFB200] line-clamp-1 flex items-center gap-1 transition-colors"
                          >
                            {p.name}
                            <ExternalLink className="w-3 h-3 text-slate-400 inline" />
                          </Link>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            SKU: {p.sku} {p.series ? `• ${p.series}` : ""}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-normal text-slate-800 block">{p.brand.name}</span>
                      <span className="text-[11px] font-extralight text-slate-400">{p.category.name}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider ${p.condition === "BRAND_NEW"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                      >
                        {p.condition === "BRAND_NEW" ? "Brand New" : "Refurbished A+"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-normal text-slate-800">
                      {formatNaira(p.basePrice)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-normal ${p.stockQuantity <= 5 ? "text-red-500 font-medium" : "text-slate-700"
                          }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.availabilityStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4 stroke-[1.4]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
