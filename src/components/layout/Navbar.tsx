"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "SERVICES", href: "/enquiries" },
    { name: "SMART FINDER", href: "/smart-finder" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      {/* 1. TOP UTILITY BAR (Exact 3-Column Match with Vertical Dividers and Unified Grid Alignment) */}
      <div className="bg-white border-b border-slate-100 text-[11px] font-extralight text-slate-500 tracking-wide">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center py-2.5">
            {/* Col 1: Need Help */}
            <div className="font-light text-slate-500 text-left md:pr-6 md:border-r md:border-slate-100 hidden md:block">
              Need help? Call us{" "}
              <a
                href="https://wa.me/2348067150130"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 font-light hover:text-amber-600 transition-colors"
              >
                +234 806715 0130
              </a>
            </div>

            {/* Col 2: Summer Sale Banner */}
            <div className="text-center font-extralight text-slate-500 md:px-6 md:border-r md:border-slate-100">
              Summer sale discount off 60% off!{" "}
              <Link
                href="/shop?sort=discount"
                className="text-[#FFB200] font-normal underline hover:text-[#FFA500] transition-colors ml-1"
              >
                Shop Now
              </Link>
            </div>

            {/* Col 3: Delivery Promise */}
            <div className="text-right font-extralight text-slate-500 md:pl-6 hidden md:block">
              2-3 business days delivery &amp; free returns
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Strictly Dead-Centered Navigation & Unified Left/Right Grid Bounds) */}
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
          isScrolled ? "shadow-xs border-b border-slate-200" : "border-b border-slate-100"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="relative flex items-center justify-between h-20">
            {/* Logo from Reference Mockup (Flush with Left Container Grid) */}
            <Link href="/" className="flex items-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ui/guaranteed_brand_logo.png"
                alt="GuaranteedTech"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>

            {/* Navigation Links (Dead-Centered 1:1 on Screen via absolute translation) */}
            <nav className="hidden lg:flex items-center gap-8 text-[12px] font-light tracking-[0.16em] absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors py-1 ${
                      isActive
                        ? "text-[#FFB200] font-normal"
                        : "text-slate-800 hover:text-[#FFB200]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search, User, Wishlist, Cart (Flush with Right Container Grid) */}
            <div className="flex items-center gap-5 text-slate-700 flex-shrink-0">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search Catalog"
                className="hover:text-amber-600 transition-colors"
              >
                <Search className="w-4 h-4 stroke-[1.4]" />
              </button>

              {/* Account Icon */}
              <Link
                href="/account"
                aria-label="Account"
                className="hover:text-amber-600 transition-colors"
              >
                <User className="w-4 h-4 stroke-[1.4]" />
              </Link>

              {/* Wishlist Heart Icon */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hover:text-amber-600 transition-colors relative"
              >
                <Heart className="w-4 h-4 stroke-[1.4]" />
              </Link>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
                className="hover:text-amber-600 transition-colors relative"
              >
                <ShoppingCart className="w-4 h-4 stroke-[1.4]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFB200] text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1 text-slate-700 hover:text-slate-900"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
              </button>
            </div>
          </div>

          {/* Expandable Search Input */}
          {isSearchOpen && (
            <div className="py-3 px-2 border-t border-slate-100 bg-slate-50/70 transition-all">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search HP EliteBook, Lenovo ThinkPad, MacBook, Gaming..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white border border-slate-300 rounded-full pl-10 pr-24 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 stroke-[1.4]" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1 bottom-1 px-4 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-light tracking-wider text-xs rounded-full transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-xs font-light tracking-[0.16em] text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-xs font-light text-amber-700 bg-amber-50 block text-center tracking-wider"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
}
