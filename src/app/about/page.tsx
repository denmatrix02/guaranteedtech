import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  Award,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await prisma.cmsPage.findUnique({ where: { slug: "about" } });
  return {
    title: page?.seoTitle || "About Us | GuaranteedTech Nigeria",
    description: page?.seoDescription || "Learn about GuaranteedTech — Nigeria's verified enterprise computing technology provider with physical showrooms in Aba, Abia State.",
  };
}

export default async function AboutPage() {
  const [cmsPage, branchesSetting] = await Promise.all([
    prisma.cmsPage.findUnique({ where: { slug: "about" } }),
    prisma.businessSetting.findUnique({ where: { key: "branches" } }),
  ]);

  let branches = [
    {
      name: "Flagship Showroom (Azikiwe Road)",
      address: "111/113 Azikiwe Road, Aba, Abia State",
      phone: "+2348067150130",
      hours: "Mon - Sat: 8:00 AM - 6:00 PM",
    },
    {
      name: "Town Hall Tech Hub (Asa Road)",
      address: "No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State",
      phone: "+2348067150130",
      hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    },
  ];

  if (branchesSetting?.valueJson) {
    try {
      branches = JSON.parse(branchesSetting.valueJson);
    } catch {}
  }

  const title = cmsPage?.title || "Certified Enterprise Computing Hardware for Nigeria";
  const subtitle = cmsPage?.subtitle || "Headquartered in Aba, Abia State, GuaranteedTech is a premier distributor of certified business laptops, enterprise workstations, clean power backup systems, and computing accessories.";

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            About GuaranteedTech
          </span>
          <h1 className="text-2xl sm:text-4xl font-light text-slate-800 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-500 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Live Content from CMS if present */}
        {cmsPage?.contentHtml && (
          <div
            className="prose prose-sm max-w-3xl mx-auto text-slate-600 font-light leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: cmsPage.contentHtml }}
          />
        )}

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded border border-slate-200 bg-[#FAFBFD] space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-medium text-slate-800">30-Point Diagnostic Inspection</h3>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              Every refurbished and open-box machine undergoes multi-stage stress testing: battery cycle health (&gt;85%), thermal cooling paste replenishment, display color calibration, and TPM 2.0 hardware verification.
            </p>
          </div>

          <div className="p-6 rounded border border-slate-200 bg-[#FAFBFD] space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-medium text-slate-800">Nationwide Insured Delivery</h3>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              We partner with GIG Logistics to dispatch to all 36 Nigerian states. Every shipment is fully insured against transit damage with real-time tracking from our Aba fulfillment center.
            </p>
          </div>

          <div className="p-6 rounded border border-slate-200 bg-[#FAFBFD] space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-medium text-slate-800">Transparent Warranty</h3>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              Up to 12 months comprehensive hardware replacement guarantee. If a component fails within your warranty window, our dedicated engineers service or replace it promptly.
            </p>
          </div>
        </div>

        {/* Physical Showrooms Section */}
        <div className="pt-8 border-t border-slate-100 space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-lg sm:text-xl font-normal text-slate-800 uppercase tracking-wide">
              Visit Our Commercial Showrooms in Aba
            </h2>
            <p className="text-xs font-extralight text-slate-400 mt-1">
              Test and inspect any system in person before purchasing at our certified tech hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {branches.map((b: any, idx: number) => (
              <div key={idx} className="p-6 rounded border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <MapPin className="w-4 h-4 text-[#FFB200]" />
                  <h3 className="text-sm font-normal">{b.name}</h3>
                </div>
                <p className="text-xs font-light text-slate-600 pl-6">{b.address}</p>
                <div className="pl-6 text-[11px] font-extralight text-slate-400 space-y-1">
                  <p>Operating Hours: {b.hours}</p>
                  <p>Hotline: {b.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
