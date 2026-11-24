import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductDetailClient } from "./ProductDetailClient";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: {
        include: { parent: true },
      },
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: { priceAdjustment: "asc" } },
      specifications: { orderBy: { displayOrder: "asc" } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
      sourceRelations: {
        include: {
          relatedProduct: {
            include: {
              brand: true,
              category: true,
              images: { orderBy: { displayOrder: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!product) {
    // Attempt fallback match for historical or slightly altered slugs
    const cleanPrefix = slug.replace(/-ssd$/, "").split("-").slice(0, 4).join("-");
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: { startsWith: cleanPrefix } },
          { slug: { contains: cleanPrefix } },
        ],
      },
      include: {
        brand: true,
        category: {
          include: { parent: true },
        },
        images: { orderBy: { displayOrder: "asc" } },
        variants: { orderBy: { priceAdjustment: "asc" } },
        specifications: { orderBy: { displayOrder: "asc" } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
        sourceRelations: {
          include: {
            relatedProduct: {
              include: {
                brand: true,
                category: true,
                images: { orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
      },
    });
  }

  if (!product) {
    notFound();
  }

  // Increment view counter in background
  prisma.product
    .update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  // Extract related alternative products and accessories
  const alternativeProducts = product.sourceRelations
    .filter((rel: any) => rel.relationType === "ALTERNATIVE")
    .map((rel: any) => rel.relatedProduct);

  const accessoryProducts = product.sourceRelations
    .filter(
      (rel: any) =>
        rel.relationType === "ACCESSORY" ||
        rel.relationType === "FREQUENTLY_BOUGHT_TOGETHER"
    )
    .map((rel: any) => rel.relatedProduct);

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-light text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/shop" className="hover:text-slate-800 transition-colors">Shop</Link>
          {product.category?.parent && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link
                href={`/shop?category=${product.category.parent.slug}`}
                className="hover:text-slate-800 transition-colors"
              >
                {product.category.parent.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="hover:text-slate-800 transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-800 font-normal line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Interactive Box (Client Component for Gallery, Variants & Add to Cart) */}
        <ProductDetailClient product={product as any} />

        {/* Technical Specifications Matrix */}
        <div className="mt-12 bg-white rounded border border-[#EBEBEB] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#FFB200]" />
            <h2 className="text-sm sm:text-base font-light uppercase tracking-[0.16em] text-slate-800">
              Technical Specifications &amp; Hardware Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {product.specifications.length > 0 ? (
              product.specifications.map((spec: any) => (
                <div
                  key={spec.id}
                  className="flex justify-between py-2 border-b border-slate-100 text-xs"
                >
                  <span className="font-light text-slate-500">{spec.specKey}</span>
                  <span className="font-normal text-slate-800 text-right max-w-xs">{spec.specValue}</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-extralight text-slate-400 italic">
                Standard enterprise configuration. Contact our technical team for custom RAM/SSD expansion.
              </p>
            )}
          </div>
        </div>

        {/* Verified Alternative Recommendations (CRITICAL REQUIREMENT) */}
        {alternativeProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm sm:text-base font-light uppercase tracking-[0.16em] text-slate-800">
                  Alternative Recommendations
                </h2>
                <p className="text-xs font-extralight text-slate-400 mt-1">
                  Comparable enterprise computers in the same class, performance tier, and price range.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {alternativeProducts.map((alt: any) => (
                <ProductCard
                  key={alt.id}
                  product={alt as any}
                  recommendationReason={{
                    badge: `Alternative ${alt.brand?.name || "System"}`,
                    explanation: "Tested equivalent specifications with matching reliability and warranty.",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Frequently Bought Together Accessories */}
        {accessoryProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm sm:text-base font-light uppercase tracking-[0.16em] text-slate-800">
                  Frequently Bought Together
                </h2>
                <p className="text-xs font-extralight text-slate-400 mt-1">
                  Essential peripherals, docks, and power solutions tested for this computer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {accessoryProducts.map((acc: any) => (
                <ProductCard key={acc.id} product={acc as any} />
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded border border-[#EBEBEB] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-light uppercase tracking-[0.16em] text-slate-800">
                Customer Reviews ({product.reviews.length})
              </h2>
              <p className="text-xs font-extralight text-slate-400 mt-0.5">
                Verified buyer testimonials from Nigerian professionals
              </p>
            </div>
          </div>

          {product.reviews.length === 0 ? (
            <p className="text-xs font-extralight text-slate-400 py-4 italic">
              No customer reviews yet. Be the first to review this verified GuaranteedTech system!
            </p>
          ) : (
            <div className="space-y-3">
              {product.reviews.map((rev: any) => (
                <div key={rev.id} className="p-4 rounded bg-white border border-[#EBEBEB]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-normal text-xs text-slate-800">{rev.reviewerName}</span>
                    <span className="text-[10px] font-light text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Verified Purchase
                    </span>
                  </div>
                  <h4 className="font-normal text-xs text-slate-700 mb-1">&quot;{rev.title}&quot;</h4>
                  <p className="text-xs font-extralight text-slate-500 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

