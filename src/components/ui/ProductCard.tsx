"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, MessageSquare, Check, ShieldCheck } from "lucide-react";
import { formatNaira } from "@/lib/currency";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    condition: string;
    conditionDetails?: string | null;
    basePrice: number;
    comparePrice?: number | null;
    discountPercent?: number | null;
    availabilityStatus: string;
    stockQuantity: number;
    warrantyMonths?: number;
    images: { url: string; altText?: string | null }[];
    brand?: { name: string; slug: string } | null;
    series?: string | null;
    intendedUsage?: string | null;
  };
  recommendationReason?: {
    badge: string;
    explanation: string;
  };
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, recommendationReason, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80";
  const isOutOfStock = product.stockQuantity <= 0 || product.availabilityStatus === "OUT_OF_STOCK";

  // WhatsApp Enquiry Link
  const storePhone = "2348067150130";

  // Dynamic Warranty Badge based on condition
  const warrantyLabel =
    product.condition === "BRAND_NEW"
      ? product.brand?.name
        ? `1-Yr ${product.brand.name} Warranty`
        : "1-Yr Brand Warranty"
      : product.condition === "OPEN_BOX"
      ? "6M GTC Warranty"
      : "3M GTC Warranty";
  const whatsappText = encodeURIComponent(
    `Hello GuaranteedTech, I'm interested in the ${product.name} (SKU: ${product.sku}) listed for ${formatNaira(product.basePrice)}. Please confirm availability and specs.`
  );
  const whatsappUrl = `https://wa.me/${storePhone}?text=${whatsappText}`;

  return (
    <div className="group relative flex flex-col bg-white rounded border border-[#EBEBEB] hover:border-[#FFB200] hover:shadow-xs transition-all duration-200 overflow-hidden">
      {/* Intelligent Recommendation Badge (if shown in alternative fallback) */}
      {recommendationReason && (
        <div className="bg-[#FFB200] text-slate-950 px-3 py-1.5 text-xs font-medium flex items-center justify-between border-b border-amber-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse"></span>
            {recommendationReason.badge}
          </span>
          <span className="text-[10px] font-light opacity-90">Smart Alternative</span>
        </div>
      )}

      {/* Badges Bar (Condition & Discount) */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="bg-red-500 text-white font-light text-[10px] tracking-wider px-2 py-0.5 rounded shadow-xs">
            -{product.discountPercent}% OFF
          </span>
        ) : null}
        <span
          className={`text-[9px] font-light uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
            product.condition === "BRAND_NEW"
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 text-amber-300"
          }`}
        >
          {product.condition === "BRAND_NEW" ? "Brand New" : "Refurbished A+"}
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        aria-label="Add to Wishlist"
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 shadow-xs border border-slate-100 transition-colors"
      >
        <Heart className="w-3.5 h-3.5" />
      </button>

      {/* Image Container with Zoom */}
      <Link href={`/products/${product.slug}`} className="relative w-full pt-[75%] bg-white overflow-hidden block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Series */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="font-light uppercase tracking-wider text-slate-500">
            {product.brand?.name || "GuaranteedTech"} {product.series ? `• ${product.series}` : ""}
          </span>
          <span className="font-mono text-[10px] text-slate-300">{product.sku}</span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="mb-2">
          <h3 className="font-light text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors text-xs sm:text-sm leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Recommendation explanation note */}
        {recommendationReason && (
          <p className="text-[11px] font-extralight text-amber-800 bg-amber-50/70 rounded p-1.5 mb-2 border border-amber-100">
            💡 {recommendationReason.explanation}
          </p>
        )}

        {/* Stock & Warranty Indicators */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded text-[10px] font-light">
            <Check className="w-2.5 h-2.5 text-emerald-600" />
            {isOutOfStock ? "Sourcing On Request" : "In Stock"}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-light">
            <ShieldCheck className="w-2.5 h-2.5 text-amber-500" />
            {warrantyLabel}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="text-sm sm:text-base font-normal text-[#FFB200] tracking-tight">
              {formatNaira(product.basePrice)}
            </div>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <div className="text-[11px] font-light text-slate-400 line-through">
                {formatNaira(product.comparePrice)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart + WhatsApp Enquiry */}
        <div className="mt-3 grid grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(product.id)}
            disabled={isOutOfStock}
            className={`col-span-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded font-light text-xs uppercase tracking-wider transition-colors shadow-xs ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-[#FFB200] hover:bg-[#FFA500] text-white"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp about this item"
            className="col-span-1 flex items-center justify-center rounded border border-emerald-500/40 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors p-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

