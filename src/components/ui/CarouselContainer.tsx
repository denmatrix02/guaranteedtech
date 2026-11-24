"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselContainerProps {
  title: string;
  children: React.ReactNode;
}

export function CarouselContainer({ title, children }: CarouselContainerProps) {
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
    <div>
      {/* Hatched Header with Functional Interactive Arrows */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
            {title}
          </h2>
          <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label={`Scroll ${title} previous`}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label={`Scroll ${title} next`}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable container with hidden scrollbar and responsive grid fallback */}
      <div
        ref={scrollRef}
        className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
