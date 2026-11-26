"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Laptop,
  Monitor,
  Printer,
  Receipt,
  Projector,
  Wifi,
  Radio,
  Cable,
  BatteryCharging,
  Zap,
  ScanBarcode,
  Layers,
} from "lucide-react";
import { OFFICIAL_CATEGORIES, CategoryItem } from "@/lib/categories";

const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-4 h-4 stroke-[1.6]" />,
  Monitor: <Monitor className="w-4 h-4 stroke-[1.6]" />,
  Printer: <Printer className="w-4 h-4 stroke-[1.6]" />,
  Receipt: <Receipt className="w-4 h-4 stroke-[1.6]" />,
  Projector: <Projector className="w-4 h-4 stroke-[1.6]" />,
  Wifi: <Wifi className="w-4 h-4 stroke-[1.6]" />,
  Radio: <Radio className="w-4 h-4 stroke-[1.6]" />,
  Cable: <Cable className="w-4 h-4 stroke-[1.6]" />,
  BatteryCharging: <BatteryCharging className="w-4 h-4 stroke-[1.6]" />,
  Zap: <Zap className="w-4 h-4 stroke-[1.6]" />,
  ScanBarcode: <ScanBarcode className="w-4 h-4 stroke-[1.6]" />,
  Layers: <Layers className="w-4 h-4 stroke-[1.6]" />,
};

export function CategoryCarousel({
  categories = OFFICIAL_CATEGORIES,
}: {
  categories?: CategoryItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* =========================================================================
          HATCHED SECTION HEADER WITH INTERACTIVE SIDE-TO-SIDE SCROLL CONTROLS
          Matches the reference UI with "SEE ALL" link and [<] [>] buttons
         ========================================================================= */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-8">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
            CATEGORIES
          </h2>
          {/* Hatched Line /////////////////////////////////////////// */}
          <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
        </div>

        {/* Action Controls: SEE ALL + Side-to-Side Chevron Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <Link
            href="/shop"
            prefetch={true}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all shadow-2xs"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3 text-[#FFB200]" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Scroll categories left"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Scroll categories right"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL SCROLLABLE CAROUSEL CONTAINER (TOUCH + BUTTONS)
          Hybrid Visual: Relatable Hardware Photo + Floating Accent Icon Badge
         ========================================================================= */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 -mx-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const icon = iconMap[cat.iconName] || <Laptop className="w-4 h-4" />;
          return (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              prefetch={true}
              className="group flex-shrink-0 w-[190px] sm:w-[210px] p-4 bg-white border border-[#EBEBEB] hover:border-[#FFB200] rounded hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center relative overflow-hidden"
            >
              {/* Top Row: Floating Icon Badge (Left) + Quality Tag (Right) */}
              <div className="flex items-center justify-between w-full mb-1 z-10">
                {/* Floating Category Icon Badge */}
                <div
                  title={cat.name}
                  className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs border border-amber-200/80 shadow-2xs text-[#FFB200] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFB200] group-hover:text-slate-950 transition-all duration-300"
                >
                  {icon}
                </div>

                {/* Category Tag */}
                {cat.badge && (
                  <span className="text-[9px] font-extralight tracking-wider text-slate-500 bg-slate-50/90 px-2 py-0.5 rounded border border-slate-100">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Center: Real Relatable Product Photo Visual */}
              <div className="w-full h-28 sm:h-32 flex items-center justify-center my-1 relative">
                <div className="absolute inset-0 bg-radial from-slate-50/70 to-transparent rounded-lg pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-24 sm:max-h-28 max-w-[85%] object-contain group-hover:scale-108 transition-transform duration-300 select-none drop-shadow-2xs"
                />
              </div>

              {/* Bottom: Category Name & Shop Action (1:1 matching Best Selling Items typography: text-xs font-light text-slate-700) */}
              <div className="w-full pt-2 border-t border-slate-100/80">
                <h3 className="text-xs font-light text-slate-700 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-light text-slate-400 group-hover:text-slate-600 mt-0.5 inline-flex items-center gap-1 transition-colors">
                  Shop Collection &rarr;
                </span>
              </div>
            </Link>
          );
        })}

        {/* Final Card: Direct Link to Main Shop */}
        <Link
          href="/shop"
          prefetch={true}
          className="group flex-shrink-0 w-[190px] sm:w-[210px] p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFB200] mb-3 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-xs font-light tracking-wide uppercase text-slate-200">
            View All Shop
          </h3>
          <p className="text-[10px] font-extralight text-slate-300 mt-1">
            Browse all 11+ departments
          </p>
        </Link>
      </div>

      {/* Mobile-Only "Browse All In Stock" pill below carousel */}
      <div className="sm:hidden text-center mt-3">
        <Link
          href="/shop"
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.16em] text-slate-700 bg-slate-50 border border-slate-200"
        >
          <span>Browse All In Stock ({categories.length} Departments)</span>
          <ArrowRight className="w-3 h-3 text-[#FFB200]" />
        </Link>
      </div>
    </div>
  );
}
