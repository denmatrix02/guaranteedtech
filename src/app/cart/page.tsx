"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/currency";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  // Estimate delivery based on standard Lagos or Nationwide rate
  const estimatedDelivery = subtotal > 1000000 ? 0 : 5000;
  const grandTotal = subtotal + estimatedDelivery;

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen py-16 border-t border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8 text-[#FFB200]" />
          </div>
          <h1 className="text-2xl font-light text-slate-800 uppercase tracking-wide">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-400 max-w-md mx-auto">
            You have not added any computers or accessories to your cart yet. Explore our verified in-stock catalog.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors shadow-xs"
            >
              Start Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Shopping Cart ({totalItems} {totalItems === 1 ? "Item" : "Items"})
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Review your selected machines, configurations, and delivery details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-white rounded border border-[#EBEBEB] p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-normal uppercase tracking-wider text-slate-700">
                Product Details
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-light text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded bg-white border border-[#EBEBEB]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-white rounded border border-[#EBEBEB] overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-light text-xs sm:text-sm text-slate-800 hover:text-blue-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400">{item.product.sku}</span>
                        {item.variant && (
                          <span className="text-[10px] font-light text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            {item.variant.name}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-normal text-[#FFB200] mt-1">
                        {formatNaira(item.unitPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:ml-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#EBEBEB] rounded bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="p-1 hover:bg-slate-50 text-slate-500"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-light text-slate-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="p-1 hover:bg-slate-50 text-slate-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="font-normal text-xs sm:text-sm text-slate-800 min-w-[90px] text-right">
                      {formatNaira(item.totalPrice)}
                    </span>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
              <Link href="/shop" className="hover:text-amber-600 font-light">
                &larr; Continue Shopping
              </Link>
              <span className="font-light">Subtotal: <strong className="text-slate-800 font-normal">{formatNaira(subtotal)}</strong></span>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 bg-white rounded border border-[#EBEBEB] p-6 space-y-5">
            <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Items Subtotal:</span>
                <span className="font-normal text-slate-800">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Estimated GIG Delivery:</span>
                <span className="font-normal text-slate-800">
                  {estimatedDelivery === 0 ? "FREE" : formatNaira(estimatedDelivery)}
                </span>
              </div>
              {subtotal > 1000000 && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] font-light rounded border border-emerald-200">
                  🎉 Free Nationwide Delivery applied on orders over ₦1,000,000!
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                <span className="font-light text-slate-800">Total Payable:</span>
                <span className="font-normal text-lg text-[#FFB200]">{formatNaira(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="space-y-1.5 pt-2 text-[11px] font-extralight text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 stroke-[1.5]" />
                <span>Tracked dispatch with GIG Logistics partner network</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFB200] flex-shrink-0 stroke-[1.5]" />
                <span>GuaranteedTech Certified Hardware Warranty (3M / 6M / 1Y)</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 stroke-[1.5]" />
                <span>7-Day Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
