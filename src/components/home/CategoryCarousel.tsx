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
  Laptop: <Laptop className="w-8 h-8 stroke-[1.4]" />,
  Monitor: <Monitor className="w-8 h-8 stroke-[1.4]" />,
  Printer: <Printer className="w-8 h-8 stroke-[1.4]" />,
  Receipt: <Receipt className="w-8 h-8 stroke-[1.4]" />,
  Projector: <Projector className="w-8 h-8 stroke-[1.4]" />,
  Wifi: <Wifi className="w-8 h-8 stroke-[1.4]" />,
  Radio: <Radio className="w-8 h-8 stroke-[1.4]" />,
  Cable: <Cable className="w-8 h-8 stroke-[1.4]" />,
  BatteryCharging: <BatteryCharging className="w-8 h-8 stroke-[1.4]" />,
  Zap: <Zap className="w-8 h-8 stroke-[1.4]" />,
  ScanBarcode: <ScanBarcode className="w-8 h-8 stroke-[1.4]" />,
  Layers: <Layers className="w-8 h-8 stroke-[1.4]" />,
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
          Renders all 11 major categories with smooth scroll and clean visual cards
         ========================================================================= */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 -mx-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const icon = iconMap[cat.iconName] || <Laptop className="w-8 h-8" />;
          return (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              prefetch={true}
              className="group flex-shrink-0 w-[180px] sm:w-[200px] p-4 sm:p-5 bg-white border border-[#EBEBEB] hover:border-[#FFB200] rounded hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between text-center relative"
            >
              {/* Optional Subtle Badge */}
              {cat.badge && (
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[9px] font-extralight tracking-wider text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {cat.badge}
                  </span>
                </div>
              )}

              {/* Visual Presentation: High Quality Illustrated Icon with Glow */}
              <div className="w-full h-24 sm:h-28 flex flex-col items-center justify-center mb-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-50/70 via-slate-50 to-white border border-amber-100/60 flex items-center justify-center text-[#FFB200] group-hover:scale-110 group-hover:bg-amber-100/50 group-hover:text-amber-600 transition-all duration-300 shadow-2xs">
                  {icon}
                </div>
              </div>

              {/* Category Name & Action Hint */}
              <div className="w-full">
                <h3 className="text-xs sm:text-[13px] font-medium text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-light text-slate-400 group-hover:text-slate-600 mt-1 inline-flex items-center gap-1 transition-colors">
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
          className="group flex-shrink-0 w-[180px] sm:w-[200px] p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFB200] mb-3 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase">
            View All Shop
          </h3>
          <p className="text-[10px] font-extralight text-slate-300 mt-1">
            Browse all 11+ departments
          </p>
        </Link>
      </div>

      {/* Mobile-Only "See All Categories" pill below carousel */}
      <div className="sm:hidden text-center mt-3">
        <Link
          href="/shop"
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.16em] text-slate-700 bg-slate-50 border border-slate-200"
        >
          <span>Browse All In Stock ({categories.length} Categories)</span>
          <ArrowRight className="w-3 h-3 text-[#FFB200]" />
        </Link>
      </div>
    </div>
  );
}
