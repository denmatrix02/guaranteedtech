import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  HelpCircle,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Official Warranty Policy | GuaranteedTech Nigeria",
  description: "Learn about GuaranteedTech's 3-tier warranty policy: 3-month comprehensive warranty on refurbished PCs, 6-month on open-box, and 1-year brand warranty on new machines.",
};

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            GuaranteedTech Protection Standard
          </span>
          <h1 className="text-2xl sm:text-4xl font-light text-slate-800 tracking-tight">
            Official Warranty &amp; Quality Guarantee
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-500 leading-relaxed">
            Every machine delivered by GuaranteedTech is backed by transparent, hardware-level warranty protection. We test rigorously so you buy with total confidence.
          </p>
        </div>

        {/* 3 Warranty Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Refurbished */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium uppercase tracking-wider">
                Refurbished (Grade A+)
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                3 Months GTC Comprehensive Warranty
              </h2>
              <p className="text-xs font-extralight text-slate-500 leading-relaxed">
                Applies to all certified pre-owned business laptops (ThinkPad, HP EliteBook, Dell Latitude, MacBook Pro).
              </p>

              <ul className="space-y-2 text-xs font-light text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Motherboard &amp; internal logic board coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Display panel &amp; backlight diagnostics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Verified battery health (&gt;85% capacity)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Free technician diagnostics at Aba hubs</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] font-light text-slate-400">
              Coverage: Free repairs or equivalent unit replacement.
            </div>
          </div>

          {/* Tier 2: Open Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-medium uppercase tracking-wider">
                Open Box (Like-New)
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                6 Months GTC Comprehensive Warranty
              </h2>
              <p className="text-xs font-extralight text-slate-500 leading-relaxed">
                Applies to verified store returns, shelf-pull models, and pristine like-new hardware with original packaging.
              </p>

              <ul className="space-y-2 text-xs font-light text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Full hardware &amp; component protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Original charger and battery pack guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>7-Day Return &amp; Exchange eligibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Priority technician servicing</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 text-[11px] font-light text-slate-400">
              Coverage: 180 days of hardware diagnostic warranty.
            </div>
          </div>

          {/* Tier 3: Brand New */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-medium uppercase tracking-wider">
                Brand New (Factory Sealed)
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                1-Year Brand Manufacturer Warranty
              </h2>
              <p className="text-xs font-extralight text-slate-500 leading-relaxed">
                Applies to 100% factory-sealed laptops and workstations directly from Dell, HP, Lenovo, ASUS, and Apple.
              </p>

              <ul className="space-y-2 text-xs font-light text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Official manufacturer warranty registration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Global service center support (Dell, HP, Apple)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Guaranteed original seals &amp; accessories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>GuaranteedTech facilitation assistance</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-emerald-200 text-[11px] font-light text-slate-400">
              Coverage: 365 days official brand warranty.
            </div>
          </div>
        </div>

        {/* 7-Day Return Policy & How to Claim */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="p-6 rounded border border-slate-200 bg-[#FAFBFD] space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <RotateCcw className="w-4 h-4 text-[#FFB200]" />
              <span>7-Day Return &amp; Exchange Window</span>
            </div>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              If your delivered computing hardware exhibits any verified diagnostic hardware defect within 7 days of delivery, we offer an immediate replacement or full resolution. Physical liquid spills, severe drops, and unauthorized third-party tampering are excluded.
            </p>
          </div>

          <div className="p-6 rounded border border-slate-200 bg-[#FAFBFD] space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>How to Claim Warranty</span>
            </div>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              Simply message our Support Desk on WhatsApp at <strong className="font-mono text-slate-800">+234 806 715 0130</strong> with your Order Reference Number (e.g. GT-2026-XXXX). Our technicians will evaluate the issue and arrange pickup or showroom drop-off.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
