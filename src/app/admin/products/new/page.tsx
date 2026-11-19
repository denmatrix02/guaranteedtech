import React from "react";
import prisma from "@/lib/prisma";
import { AddProductClient } from "./AddProductClient";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Register New Computer / Hardware
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Add a new machine to the GuaranteedTech inventory with GTC specifications and pricing.
        </p>
      </div>

      <AddProductClient brands={brands} categories={categories} />
    </div>
  );
}

