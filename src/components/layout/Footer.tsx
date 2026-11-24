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
  AlertCircle,
  Shield,
  Loader2,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setSubscribed(true);
      setStatusMessage(data.message || "Thank you! You are now subscribed to GuaranteedTech deals.");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "Could not complete subscription.");
    } finally {
      setIsSubmitting(false);
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

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-light tracking-[0.18em] text-slate-400 block mb-2">
                Follow GuaranteedTech
              </span>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GuaranteedTech Facebook Page"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/2348067150130"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GuaranteedTech WhatsApp Desk"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/guaranteedtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GuaranteedTech Instagram"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
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
                <Link href="/" prefetch={true} className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" prefetch={true} className="hover:text-blue-600 transition-colors">
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link href="/smart-finder" prefetch={true} className="hover:text-amber-600 transition-colors">
                  Smart Finder
                </Link>
              </li>
              <li>
                <Link href="/enquiries" prefetch={true} className="hover:text-blue-600 transition-colors">
                  Corporate Procurement &amp; RFQs
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-blue-600 transition-colors">
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
                <Link href="/track-order" prefetch={true} className="hover:text-blue-600 transition-colors">
                  Track GIG Waybill / Order
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-blue-600 transition-colors">
                  6-Month GTC Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-blue-600 transition-colors">
                  Nationwide Shipping Rates
                </Link>
              </li>
              <li>
                <Link href="/enquiries" prefetch={true} className="hover:text-blue-600 transition-colors">
                  Corporate Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-blue-600 transition-colors">
                  7-Day Return &amp; Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-blue-600 transition-colors">
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
                <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[1.5] flex-shrink-0" />
                <span>{statusMessage}</span>
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
                {errorMessage && (
                  <div className="text-[11px] text-red-600 flex items-center gap-1 font-light">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.16em] py-2.5 rounded transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 stroke-[1.5]" /> Subscribe
                    </>
                  )}
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

