"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/currency";
import {
  ShoppingCart,
  Zap,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Heart,
} from "lucide-react";

export function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
  );

  const defaultVariant = product.variants?.find((v: any) => v.isDefault) || product.variants?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<any>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Compute live price with variant adjustment
  const currentPrice = product.basePrice + (selectedVariant?.priceAdjustment || 0);
  const isOutOfStock = product.stockQuantity <= 0 || product.availabilityStatus === "OUT_OF_STOCK";

  // Pre-filled WhatsApp message
  const whatsappText = encodeURIComponent(
    `Hello GuaranteedTech, I'm interested in the ${product.name} (SKU: ${product.sku}${selectedVariant ? ` - ${selectedVariant.name}` : ""}) listed at ${formatNaira(currentPrice)} on your website. Please confirm availability and shipping details.`
  );
  const whatsappUrl = `https://wa.me/2348067150130?text=${whatsappText}`;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        comparePrice: product.comparePrice,
        imageUrl: selectedImage,
        sku: product.sku,
        condition: product.condition,
      },
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            priceAdjustment: selectedVariant.priceAdjustment,
            ram: selectedVariant.ram,
            storage: selectedVariant.storage,
          }
        : null,
      quantity,
      unitPrice: currentPrice,
      totalPrice: currentPrice * quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative w-full h-80 sm:h-96 md:h-[450px] bg-white rounded border border-[#EBEBEB] overflow-hidden flex items-center justify-center p-6">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-contain p-4"
            />
            {/* Condition Badge */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <span
                className={`text-[10px] font-light uppercase tracking-wider px-2.5 py-1 rounded shadow-xs ${
                  product.condition === "BRAND_NEW"
                    ? "bg-emerald-600 text-white"
                    : product.condition === "OPEN_BOX"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-900 text-amber-300"
                }`}
              >
                {product.condition === "BRAND_NEW"
                  ? `Brand New • 1-Year ${product.brand?.name || "Brand"} Warranty`
                  : product.condition === "OPEN_BOX"
                  ? "Open Box • 6M GTC Warranty"
                  : "Refurbished Grade A+ • 3M GTC Warranty"}
              </span>
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="bg-red-500 text-white font-light text-[10px] px-2 py-0.5 rounded shadow-xs">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-16 h-16 rounded border bg-white overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === img.url
                      ? "border-[#FFB200] ring-1 ring-[#FFB200]"
                      : "border-[#EBEBEB] hover:border-slate-400"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.name}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buy Box & Product Info */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Brand, Series & SKU */}
            <div className="flex items-center justify-between text-xs font-light text-slate-400 mb-2">
              <span className="uppercase tracking-wider text-slate-600">
                {product.brand?.name} {product.series ? `• ${product.series}` : ""}
              </span>
              <span className="font-mono text-[11px] text-slate-300">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide leading-snug mb-3">
              {product.name}
            </h1>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-slate-100">
              <span className="text-2xl sm:text-3xl font-normal text-[#FFB200] tracking-tight">
                {formatNaira(currentPrice)}
              </span>
              {product.comparePrice && (
                <span className="text-sm font-light text-slate-400 line-through">
                  {formatNaira(product.comparePrice)}
                </span>
              )}
              <span className="text-[11px] font-light text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded">
                In Stock &amp; Ready to Ship
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-xs sm:text-sm font-extralight text-slate-500 leading-relaxed my-4">
                {product.shortDescription}
              </p>
            )}

            {/* Condition & Inspection Details */}
            {product.conditionDetails && (
              <div className="p-3 rounded bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2.5 mb-5">
                <ShieldCheck className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="font-normal text-slate-800 block mb-0.5">
                    GTC Inspection Report:
                  </span>
                  <span className="font-extralight">{product.conditionDetails}</span>
                </div>
              </div>
            )}

            {/* Hardware Variants Selection (RAM, SSD, CPU) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2.5 mb-6">
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700">
                  Hardware Configuration:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded border text-left text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[#FFB200] bg-amber-50/30 text-slate-900"
                            : "border-[#EBEBEB] hover:border-slate-300 text-slate-600 bg-white"
                        }`}
                      >
                        <span className="font-light">{v.name}</span>
                        {v.priceAdjustment !== 0 && (
                          <span className="text-[11px] font-normal text-amber-600 mt-1">
                            {v.priceAdjustment > 0
                              ? `+${formatNaira(v.priceAdjustment)}`
                              : `-${formatNaira(Math.abs(v.priceAdjustment))}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-light text-slate-600 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-[#EBEBEB] rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-light text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3 px-6 rounded font-light text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors shadow-xs ${
                    isOutOfStock
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#FFB200] hover:bg-[#FFA500] text-white"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-6 rounded font-light text-xs uppercase tracking-[0.14em] bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FFB200]" /> Buy Now
                </button>
              </div>

              {/* Direct WhatsApp Ordering / Sourcing Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-6 rounded font-light text-xs border border-emerald-500/40 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100/60 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Enquire or Order via WhatsApp (+234 806 715 0130)
              </a>
            </div>
          </div>

          {/* Delivery & Warranty Guarantees Banner */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-[11px] font-extralight text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 stroke-[1.5]" />
              <span>GIG Logistics Nationwide</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB200] flex-shrink-0 stroke-[1.5]" />
              <span>
                {product.condition === "BRAND_NEW"
                  ? `1-Year ${product.brand?.name || "Brand"} Official Warranty`
                  : product.condition === "OPEN_BOX"
                  ? "6 Months GTC Warranty Included"
                  : "3 Months GTC Comprehensive Warranty"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 stroke-[1.5]" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

