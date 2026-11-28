import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductFormClient } from "../../ProductFormClient";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        specifications: { orderBy: { displayOrder: "asc" } },
        branchStock: true,
      },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProductFormClient
        initialProduct={product}
        brands={brands}
        categories={categories}
        isEdit={true}
      />
    </div>
  );
}
