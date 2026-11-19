"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/currency";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#FFB200]" />
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-light text-slate-800 text-sm uppercase tracking-wide">Your cart is empty</h3>
                  <p className="text-xs font-extralight text-slate-400 mt-1">
                    Discover enterprise laptops, workstations and accessories.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-3 p-3 bg-white rounded border border-[#EBEBEB]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 bg-white rounded border border-[#EBEBEB] overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-light text-xs text-slate-800 hover:text-blue-600 line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                      {item.variant && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block mt-0.5 font-light">
                          {item.variant.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#EBEBEB] rounded bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                          className="p-1 hover:bg-slate-50 text-slate-500"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2 text-xs font-light text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                          className="p-1 hover:bg-slate-50 text-slate-500"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="font-normal text-xs text-[#FFB200]">
                        {formatNaira(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-light text-slate-500">Subtotal:</span>
                <span className="font-normal text-sm text-[#FFB200]">
                  {formatNaira(subtotal)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-extralight text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 stroke-[1.5]" />
                <span>Nationwide delivery with GIG Logistics. Delivery calculated at checkout.</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs"
                >
                  Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-1.5 text-xs font-light text-slate-500 hover:text-slate-800"
                >
                  View Full Cart &amp; Summary
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
