"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  Send,
  CheckCircle,
  Shield,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#FAFBFD] border-t border-slate-200 text-slate-700 pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Column 1: Brand Info & Showroom Details */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ui/guaranteed_brand_logo.png"
                alt="GuaranteedTech"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              Nigeria&apos;s verified enterprise computing technology provider. Authentic, tested, and certified
              business laptops, desktop workstations, and computer hardware.
            </p>

            <div className="space-y-2.5 text-xs font-light text-slate-600">
              {/* Branch 1: Flagship Retail & Experience Showroom */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="font-normal text-slate-800 block text-[11px] uppercase tracking-wider">Branch 1 &bull; Flagship Retail &amp; Experience Showroom</span>
                  <span className="font-extralight text-slate-500 text-[11px]">111/113 Azikiwe Road, Aba, Abia State</span>
                </div>
              </div>

              {/* Branch 2: Executive Showroom & Enterprise Hub */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="font-normal text-slate-800 block text-[11px] uppercase tracking-wider">Branch 2 &bull; Executive Showroom &amp; Enterprise Hub</span>
                  <span className="font-extralight text-slate-500 text-[11px]">No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0 stroke-[1.5]" />
                <a
                  href="https://wa.me/2348067150130"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 font-light"
                >
                  +234 806 715 0130
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 stroke-[1.5]" />
                <a href="mailto:guarateedtech17@gmail.com" className="hover:text-blue-600 font-light">
                  guarateedtech17@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 text-amber-400 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="text-[11px] font-extralight text-slate-500 ml-1.5">
                4.9 / 5.0 (2,400+ Verified Buyers)
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-light text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-blue-600 transition-colors">
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link href="/smart-finder" className="hover:text-amber-600 transition-colors">
                  Smart Finder
                </Link>
              </li>
              <li>
                <Link href="/enquiries" className="hover:text-blue-600 transition-colors">
                  Corporate Procurement &amp; RFQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact &amp; Showrooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs font-light text-slate-600">
              <li>
                <Link href="/track-order" className="hover:text-blue-600 transition-colors">
                  Track GIG Waybill / Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  6-Month GTC Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Nationwide Shipping Rates
                </Link>
              </li>
              <li>
                <Link href="/enquiries" className="hover:text-blue-600 transition-colors">
                  Corporate Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  7-Day Return &amp; Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Help Center &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800">
              Newsletter
            </h4>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              Subscribe to get exclusive price drops, new arrivals, and corporate discounts on certified computing equipment.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-light flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[1.5]" />
                <span>Thank you! You are now subscribed to GuaranteedTech deals.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-light text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.16em] py-2.5 rounded transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 stroke-[1.5]" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-extralight text-slate-400 gap-3">
          <div>
            Copyright &copy; {new Date().getFullYear()} GuaranteedTech Nigeria. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-slate-600 transition-colors">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <span>Designed for GuaranteedTech</span>
            <span>&bull;</span>
            <Link
              href="/admin"
              title="Authorized Operator Access"
              aria-label="Staff Access"
              className="text-slate-300 hover:text-slate-600 transition-colors inline-flex items-center"
            >
              <Shield className="w-3 h-3 stroke-[1.2]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
