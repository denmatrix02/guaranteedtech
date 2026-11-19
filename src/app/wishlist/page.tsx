"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="bg-white min-h-screen py-16 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-[#FFB200]">
          <Heart className="w-8 h-8 fill-amber-50 text-[#FFB200] stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-light text-slate-800 uppercase tracking-wide">Your Wishlist</h1>
        <p className="text-xs sm:text-sm font-extralight text-slate-400 max-w-md mx-auto">
          Save computers, workstations, and components you want to review later or order when ready.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors shadow-xs"
          >
            Explore Laptops &amp; Hardware <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
