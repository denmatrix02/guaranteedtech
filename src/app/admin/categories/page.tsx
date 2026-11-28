import React from "react";
import prisma from "@/lib/prisma";
import { CategoriesClient } from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true, subcategories: true },
      },
      parent: true,
    },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Category &amp; Department Architecture
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Configure official hardware departments, custom SVG vector badges, order sequencing, and storefront taxonomy.
        </p>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
