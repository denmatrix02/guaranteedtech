import React from "react";
import prisma from "@/lib/prisma";
import { ProductFormClient } from "../ProductFormClient";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProductFormClient
        brands={brands}
        categories={categories}
        isEdit={false}
      />
    </div>
  );
}
