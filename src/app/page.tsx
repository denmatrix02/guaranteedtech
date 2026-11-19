import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import {
  ShoppingCart,
  Award,
  Tag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Query DB to verify active products
  const [featuredDbProducts, bestSellerDbProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, availabilityStatus: "IN_STOCK" },
      take: 4,
      include: { brand: true, category: true, images: { orderBy: { displayOrder: "asc" } } },
    }),
    prisma.product.findMany({
      where: { isBestSeller: true, availabilityStatus: "IN_STOCK" },
      take: 5,
      include: { brand: true, category: true, images: { orderBy: { displayOrder: "asc" } } },
    }),
  ]);

  // 1. Categories exact 1:1 match from reference UI (01 Home.jpg)
  const uiCategories = [
    { name: "Printers", image: "/images/ui/category_1.jpg", href: "/shop?category=printers" },
    { name: "Projectors", image: "/images/ui/category_2.jpg", href: "/shop" },
    { name: "Equipment", image: "/images/ui/category_3.jpg", href: "/shop?category=networking-equipment" },
    { name: "Desktops", image: "/images/ui/category_4.jpg", href: "/shop?category=desktop-computers" },
    { name: "Inks & Toner", image: "/images/ui/category_5.jpg", href: "/shop?category=printing-supplies" },
    { name: "Laptops", image: "/images/ui/category_6.jpg", href: "/shop?category=laptops" },
  ];

  // 2. Best selling items exact 1:1 match from reference UI (Row of 5 cards)
  const bestSellers = [
    {
      id: "bs-1",
      name: "Apple MacBook Pro 16",
      price: 3450000,
      image: "/images/ui/bestseller_1.jpg",
      slug: "apple-macbook-pro-16-m3-pro-18gb-512gb-space-black",
      rating: 5,
    },
    {
      id: "bs-2",
      name: "HP Pavilion 15 Touchscreen",
      price: 585000,
      image: "/images/ui/bestseller_2.jpg",
      slug: "hp-elitebook-840-g8-core-i7-16gb-512gb-ssd",
      rating: 5,
    },
    {
      id: "bs-3",
      name: "Cisco Catalyst Gigabit Switch",
      price: 320000,
      image: "/images/ui/bestseller_3.jpg",
      slug: "samsung-980-pro-1tb-nvme-ssd",
      rating: 5,
    },
    {
      id: "bs-4",
      name: "Lenovo ThinkPad X1 Carbon",
      price: 720000,
      image: "/images/ui/bestseller_4.jpg",
      slug: "lenovo-thinkpad-t490s-core-i7-16gb-256gb-touchscreen",
      rating: 5,
    },
    {
      id: "bs-5",
      name: "Dell OptiPlex Tower Workstation",
      price: 450000,
      image: "/images/ui/bestseller_5.jpg",
      slug: "dell-latitude-7420-core-i5-16gb-256gb-ssd",
      rating: 5,
    },
  ];

  // 3. 4-Column Product Matrix Data (Featured, Latest, Best Reviewed, On Sale)
  const matrixColumns = [
    {
      title: "FEATURED",
      items: [
        { name: "ThinkPad T490s Touch", price: 485000, image: "/images/ui/bestseller_4.jpg", slug: "lenovo-thinkpad-t490s-core-i7-16gb-256gb-touchscreen" },
        { name: "HP EliteBook 840 G8", price: 620000, image: "/images/ui/bestseller_2.jpg", slug: "hp-elitebook-840-g8-core-i7-16gb-512gb-ssd" },
        { name: "Logitech MX Master 3S", price: 135000, image: "/images/ui/bestseller_3.jpg", slug: "logitech-mx-master-3s-wireless-mouse" },
      ],
    },
    {
      title: "LATEST ITEMS",
      items: [
        { name: "MacBook Pro 16 M3 Pro", price: 3450000, image: "/images/ui/bestseller_1.jpg", slug: "apple-macbook-pro-16-m3-pro-18gb-512gb-space-black" },
        { name: "ASUS ROG Zephyrus G14", price: 2100000, image: "/images/ui/bestseller_4.jpg", slug: "asus-rog-zephyrus-g14-ryzen-9-rtx-4060-1tb-ssd" },
        { name: "Samsung 980 PRO 1TB", price: 165000, image: "/images/ui/bestseller_5.jpg", slug: "samsung-980-pro-1tb-nvme-ssd" },
      ],
    },
    {
      title: "BEST REVIEWED",
      items: [
        { name: "Dell Latitude 7420", price: 540000, image: "/images/ui/bestseller_2.jpg", slug: "dell-latitude-7420-core-i5-16gb-256gb-ssd" },
        { name: "Dell UltraSharp 27 4K", price: 780000, image: "/images/ui/bestseller_5.jpg", slug: "dell-ultrasharp-27-4k-usb-c-hub-monitor" },
        { name: "APC Smart-UPS 1500VA", price: 650000, image: "/images/ui/bestseller_3.jpg", slug: "apc-smart-ups-1500va-lcd-230v" },
      ],
    },
    {
      title: "ON SALE",
      items: [
        { name: "HP EliteBook 840 G7", price: 470000, image: "/images/ui/bestseller_2.jpg", slug: "hp-elitebook-840-g7-core-i7-16gb-512gb-ssd" },
        { name: "HP LaserJet Pro MFP", price: 590000, image: "/images/ui/category_1.jpg", slug: "hp-laserjet-pro-mfp-m428fdw-wireless-printer" },
        { name: "Anker 555 8-in-1 Hub", price: 85000, image: "/images/ui/bestseller_3.jpg", slug: "anker-555-usb-c-hub-8-in-1" },
      ],
    },
  ];

  // 4. Customer Reviews exact 1:1 match
  const reviews = [
    {
      id: "r1",
      name: "Emeka Okonkwo",
      location: "Lekki, Lagos",
      comment: "Consectetur adipi elit lorem ipsum dolor sit amet, orem ipsum dolor sit amet. Best tech vendor in Lagos!",
      rating: 5,
    },
    {
      id: "r2",
      name: "Tunde Lawal",
      location: "Abuja, FCT",
      comment: "Dolor sit amet orem ipsu mcons ectetur adipi elit, delivered fast via GIG Logistics across Nigeria.",
      rating: 5,
    },
    {
      id: "r3",
      name: "Amina Bello",
      location: "Port Harcourt, Rivers",
      comment: "Amet consectetur adipi elit loreme ipsum dolor sit, legitimate machines with 6-month certified warranty.",
      rating: 5,
    },
  ];

  // 5. Latest Posts exact 1:1 match
  const posts = [
    {
      id: 1,
      tag: "LAPTOPS",
      title: "Best Business Laptops for Nigerian Developers in 2026",
      desc: "Detailed comparison of ThinkPad T-Series vs HP EliteBook 840 for long battery life and heavy Docker workloads.",
      image: "/images/ui/post_1.jpg",
    },
    {
      id: 2,
      tag: "ENTERPRISE",
      title: "How to Choose the Right Desktop Workstation",
      desc: "Factors to consider when selecting CAD, 3D animation, and deep learning workstation towers.",
      image: "/images/ui/post_2.jpg",
    },
    {
      id: 3,
      tag: "TIPS",
      title: "Extending Battery Longevity in Refurbished Laptops",
      desc: "Proven configuration tips, charging cycles, and power management settings for maximum daily endurance.",
      image: "/images/ui/post_3.jpg",
    },
    {
      id: 4,
      tag: "SECURITY",
      title: "Why Hardware TPM 2.0 Matters for Remote Work",
      desc: "Essential enterprise security protocols for protecting proprietary company data on portable workstations.",
      image: "/images/ui/post_4.jpg",
    },
  ];

  const brandLogos = ["ECHOTECH", "MiniStore", "ULTRAS", "SWANKY", "EMBL"];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* =========================================================================
          1. HERO SECTION (FILLED WITH NO EDGES, EXACT OUTFIT TYPOGRAPHY)
          - Left: "Premium Computing for a Smarter You", extra-light paragraph, yellow "SHOP COLLECTION" button
          - Right: Keyboard image completely flush with top, bottom, and right edges
         ========================================================================= */}
      <section className="bg-white border-b border-slate-100 overflow-hidden relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex items-center">
        {/* Right Keyboard Visual (FILLED WITH NO EDGES - Completely Flush) */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] h-full z-0 overflow-hidden pointer-events-none select-none">
          {/* Smooth left-edge gradient fade to pure white */}
          <div className="absolute inset-y-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ui/hero_keyboard_flush.jpg"
            alt="Premium Computing - Buy Now Keyboard"
            className="w-full h-full object-cover object-right select-none"
          />
        </div>

        {/* Left Content Container */}
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 relative z-10 py-12 lg:py-16">
          <div className="max-w-md">
            {/* Main Headline: Exact proportional hierarchy matching reference mockup */}
            <h1 className="leading-tight">
              <span className="font-bold text-2xl sm:text-3xl lg:text-[34px] text-[#222222] block tracking-tight">
                Premium Computing
              </span>
              <span className="font-light text-2xl sm:text-3xl lg:text-[34px] text-[#2D6DC5] block tracking-tight mt-0.5">
                for a Smarter You
              </span>
            </h1>

            {/* Subtext: Proportional, extra-light/light typography matching reference mockup */}
            <p className="font-light text-xs sm:text-[13px] text-slate-500 mt-2.5 leading-normal max-w-xs sm:max-w-sm">
              Get your computing products &mdash; all in one place.
            </p>

            <div className="pt-4 sm:pt-5">
              <Link
                href="/shop"
                className="inline-block bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-[10px] sm:text-[11px] uppercase tracking-[0.16em] px-6 sm:px-7 py-2 sm:py-2.5 rounded-full shadow-xs transition-colors"
              >
                SHOP COLLECTION
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FOUR FEATURE VALUE PROPOSITIONS (Intentional Extra-Light / Light Body)
          FREE DELIVERY | QUALITY GUARANTEE | DAILY OFFERS | PAYMENT ON DELIVERY
         ========================================================================= */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: FREE DELIVERY */}
            <div className="flex items-start gap-3.5">
              <ShoppingCart className="w-5 h-5 text-[#FFB200] flex-shrink-0 stroke-[1.5] mt-0.5" />
              <div>
                <h4 className="font-normal text-xs uppercase tracking-[0.14em] text-slate-800">
                  FREE DELIVERY
                </h4>
                <p className="text-[11px] font-extralight text-slate-500 mt-1 leading-snug">
                  Consectetur adipi elit lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>

            {/* Feature 2: QUALITY GUARANTEE */}
            <div className="flex items-start gap-3.5">
              <Award className="w-5 h-5 text-[#FFB200] flex-shrink-0 stroke-[1.5] mt-0.5" />
              <div>
                <h4 className="font-normal text-xs uppercase tracking-[0.14em] text-slate-800">
                  QUALITY GUARANTEE
                </h4>
                <p className="text-[11px] font-extralight text-slate-500 mt-1 leading-snug">
                  Dolor sit amet orem ipsu mcons ectetur adipi elit.
                </p>
              </div>
            </div>

            {/* Feature 3: DAILY OFFERS */}
            <div className="flex items-start gap-3.5">
              <Tag className="w-5 h-5 text-[#FFB200] flex-shrink-0 stroke-[1.5] mt-0.5" />
              <div>
                <h4 className="font-normal text-xs uppercase tracking-[0.14em] text-slate-800">
                  DAILY OFFERS
                </h4>
                <p className="text-[11px] font-extralight text-slate-500 mt-1 leading-snug">
                  Amet consectetur adipi elit loreme ipsum dolor sit.
                </p>
              </div>
            </div>

            {/* Feature 4: PAYMENT ON DELIVERY */}
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-[#FFB200] flex-shrink-0 stroke-[1.5] mt-0.5" />
              <div>
                <h4 className="font-normal text-xs uppercase tracking-[0.14em] text-slate-800">
                  PAYMENT ON DELIVERY
                </h4>
                <p className="text-[11px] font-extralight text-slate-500 mt-1 leading-snug">
                  Rem Lopsum dolor sit amet, consectetur adipi elit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CATEGORIES SECTION (Hatched Line Header //////////////////////////////)
          6 Cards: Printers, Projectors, Equipment, Desktops, Inks & Toner, Laptops
         ========================================================================= */}
      <section className="py-14 bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Hatched Section Header */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
              CATEGORIES
            </h2>
            <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {uiCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group p-5 bg-white border border-[#EBEBEB] rounded hover:border-amber-400 hover:shadow-xs transition-all flex flex-col items-center justify-between text-center min-h-[170px]"
              >
                <div className="w-full h-24 flex items-center justify-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-20 max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <span className="text-[11px] font-light tracking-wide text-slate-600 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. BEST SELLING ITEMS (Hatched Header with Carousel Arrows)
          5 Product Cards with Cutouts, 5 Gold Stars, and Yellow Prices
         ========================================================================= */}
      <section className="py-12 bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Hatched Header with Carousel Arrows */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
                BEST SELLING ITEMS
              </h2>
              <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                aria-label="Previous"
                className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Row of 5 Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#EBEBEB] rounded p-4 flex flex-col justify-between hover:shadow-xs hover:border-amber-400 transition-all text-center group"
              >
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="w-full h-32 flex items-center justify-center mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-28 max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="text-xs font-light text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>

                <div className="pt-2 flex flex-col items-center">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 my-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  {/* Price in Yellow/Gold */}
                  <span className="text-xs sm:text-sm font-normal text-[#FFB200]">
                    {formatNaira(item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. 30% DISCOUNT BANNER (Intentional Typography Hierarchy)
         ========================================================================= */}
      <section className="py-16 bg-[#F8F9FA] border-y border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Laptop Visual */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="w-full max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ui/promo_laptop.jpg"
                  alt="30% Discount Apple Collection"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right Campaign Headline, Countdown, Button */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-800 tracking-tight leading-tight uppercase">
                30% DISCOUNT ON
                <br />
                APPLE COLLECTION
              </h2>

              {/* Countdown Timer (21 : 22 : 19 : 30) */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-light text-slate-800">21</span>
                  <span className="text-[10px] uppercase font-extralight text-slate-400 mt-0.5 tracking-widest">Days</span>
                </div>
                <span className="text-xl font-extralight text-slate-300 -mt-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-light text-slate-800">22</span>
                  <span className="text-[10px] uppercase font-extralight text-slate-400 mt-0.5 tracking-widest">Hours</span>
                </div>
                <span className="text-xl font-extralight text-slate-300 -mt-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-light text-slate-800">19</span>
                  <span className="text-[10px] uppercase font-extralight text-slate-400 mt-0.5 tracking-widest">Mins</span>
                </div>
                <span className="text-xl font-extralight text-slate-300 -mt-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-light text-slate-800">30</span>
                  <span className="text-[10px] uppercase font-extralight text-slate-400 mt-0.5 tracking-widest">Secs</span>
                </div>
              </div>

              <div>
                <Link
                  href="/shop?sort=discount"
                  className="inline-block bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.16em] px-8 py-3 rounded-full shadow-xs transition-colors"
                >
                  DISCOVER NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOUR-COLUMN PRODUCT MATRIX (FEATURED, LATEST, BEST REVIEWED, ON SALE)
         ========================================================================= */}
      <section className="py-14 bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {matrixColumns.map((col, colIdx) => (
              <div key={colIdx} className="space-y-4">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-light uppercase tracking-[0.18em] text-slate-700">
                    {col.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  {col.items.map((prod, prodIdx) => (
                    <Link
                      key={prodIdx}
                      href={`/products/${prod.slug}`}
                      className="flex items-center gap-3 py-1.5 px-2 -mx-2 rounded hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-14 h-14 bg-white border border-[#EBEBEB] rounded p-1 flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-12 max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-light text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {prod.name}
                        </span>
                        <span className="text-xs font-normal text-[#FFB200] mt-0.5">
                          {formatNaira(prod.price)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CUSTOMERS REVIEWS (Extra-Light Testimonial Quotes)
         ========================================================================= */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Hatched Header with Arrows */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
                CUSTOMERS REVIEWS
              </h2>
              <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                aria-label="Previous"
                className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#EBEBEB] rounded p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-extralight text-slate-500 leading-relaxed italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-normal text-slate-700">{rev.name}</h4>
                    <span className="text-[10px] font-extralight text-slate-400">{rev.location}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. LATEST POSTS (Hatched Header & Extra-Light Snippet Text)
         ========================================================================= */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
              LATEST POSTS
            </h2>
            <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-[#EBEBEB] rounded overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#FFB200] text-white font-light text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                      {post.tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-xs font-normal text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[11px] font-extralight text-slate-400 line-clamp-3 leading-relaxed">
                      {post.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href="/shop"
                    className="text-[11px] font-light text-[#FFB200] hover:text-amber-600 uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    Read More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. BRAND LOGOS ROW (Extra-Light Brand Tracking, Evenly Distributed)
         ========================================================================= */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 opacity-40">
            {brandLogos.map((brand, i) => (
              <span
                key={i}
                className="text-base sm:text-lg font-extralight text-slate-400 tracking-[0.25em] uppercase hover:text-slate-700 transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. INSTAGRAM SHOWROOM GALLERY (Hatched Header)
         ========================================================================= */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-800 whitespace-nowrap">
              INSTAGRAM @GUARANTEEDTECH
            </h2>
            <div className="flex-1 h-3 bg-[repeating-linear-gradient(45deg,#E2E8F0,#E2E8F0_1px,transparent_1px,transparent_4px)] opacity-70"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded bg-slate-100 group border border-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/ui/insta_${idx}.jpg`}
                  alt={`GuaranteedTech Showroom ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
