import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
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

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await prisma.cmsPage.findUnique({ where: { slug: "warranty" } });
  return {
    title: page?.seoTitle || "Official Warranty Policy | GuaranteedTech Nigeria",
    description: page?.seoDescription || "Learn about GuaranteedTech's 3-tier warranty policy: 3-month comprehensive warranty on refurbished PCs, 6-month on open-box, and 1-year brand warranty on new machines.",
  };
}

export default async function WarrantyPolicyPage() {
  const [cmsPage, warrantySetting] = await Promise.all([
    prisma.cmsPage.findUnique({ where: { slug: "warranty" } }),
    prisma.businessSetting.findUnique({ where: { key: "warranty_defaults" } }),
  ]);

  let warDefaults = {
    refurbishedMonths: 3,
    refurbishedTerms: "3-Month Comprehensive GTC Hardware Warranty with free parts & labor",
    openBoxMonths: 6,
    openBoxTerms: "6-Month Comprehensive GTC Hardware Warranty with direct replacement coverage",
    brandNewMonths: 12,
    brandNewTerms: "1-Year Official Manufacturer Warranty with authorized service center support",
  };

  if (warrantySetting?.valueJson) {
    try {
      warDefaults = { ...warDefaults, ...JSON.parse(warrantySetting.valueJson) };
    } catch {}
  }

  const title = cmsPage?.title || "Official Warranty & Quality Guarantee";
  const subtitle = cmsPage?.subtitle || "Every machine delivered by GuaranteedTech is backed by transparent, hardware-level warranty protection. We test rigorously so you buy with total confidence.";

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            GuaranteedTech Protection Standard
          </span>
          <h1 className="text-2xl sm:text-4xl font-light text-slate-800 tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-500 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Live CMS Content if updated by admin */}
        {cmsPage?.contentHtml && (
          <div
            className="prose prose-sm max-w-3xl mx-auto text-slate-600 font-light leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: cmsPage.contentHtml }}
          />
        )}

        {/* 3 Warranty Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Refurbished */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium uppercase tracking-wider">
                Refurbished (Grade A+)
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                {warDefaults.refurbishedMonths} Months GTC Warranty
              </h2>
              <p className="text-xs font-extralight text-slate-500 leading-relaxed">
                {warDefaults.refurbishedTerms}
              </p>

              <ul className="space-y-2.5 text-xs font-light text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Free motherboard, charging port, and controller repairs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Verified battery health replacement if below 80%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Free OS reinstallation &amp; thermal repasting</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 2: Open Box */}
          <div className="rounded-lg border-2 border-amber-300 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-medium uppercase tracking-wider">
                Open Box (Like New)
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                {warDefaults.openBoxMonths} Months GTC Warranty
              </h2>
              <p className="text-xs font-extralight text-slate-500 leading-relaxed">
                {warDefaults.openBoxTerms}
              </p>

              <ul className="space-y-2.5 text-xs font-light text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Direct hardware replacement for internal failures</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Original manufacturer accessories coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Priority showroom diagnostic queue in Aba</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 3: Brand New */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium uppercase tracking-wider">
                Brand New Sealed
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                {warDefaults.brandNewMonths} Months Brand Warranty
              </h2>
              <p className="text-xs font-extralight text-slate-500 leading-relaxed">
                {warDefaults.brandNewTerms}
              </p>

              <ul className="space-y-2.5 text-xs font-light text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Official Apple, HP, Lenovo or Dell authorized service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Full factory component replacement guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>GuaranteedTech handles logistics to service center</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
