import React from "react";
import Link from "next/link";
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

export const metadata = {
  title: "About Us | GuaranteedTech Nigeria",
  description: "Learn about GuaranteedTech — Nigeria's verified enterprise computing technology provider with physical showrooms in Aba, Abia State.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            About GuaranteedTech
          </span>
          <h1 className="text-2xl sm:text-4xl font-light text-slate-800 tracking-tight leading-tight">
            Certified Enterprise Computing Hardware for Nigeria
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-500 leading-relaxed">
            Headquartered in Aba, Abia State, GuaranteedTech is a premier distributor of certified business laptops, enterprise workstations, clean power backup systems, and computing accessories.
          </p>
        </div>

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
            <h3 className="text-sm font-medium text-slate-800">Nationwide Payment on Delivery</h3>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              We partner with GIG Logistics across all 36 states. Inspect, power on, and physically verify your laptop at your doorstep or GIG station before releasing payment.
            </p>
          </div>

          <div className="p-6 rounded border border-slate-200 bg-[#FAFBFD] space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-medium text-slate-800">Standardized Warranty Protection</h3>
            <p className="text-xs font-extralight text-slate-500 leading-relaxed">
              Total peace of mind with 3 Months GTC Comprehensive Warranty on Refurbished laptops, 6 Months on Open Box units, and 1-Year Official Manufacturer Warranty on Brand New PCs.
            </p>
          </div>
        </div>

        {/* Physical Showrooms Section */}
        <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-light tracking-[0.2em] text-[#FFB200] block">
              Physical Presence
            </span>
            <h2 className="text-xl sm:text-2xl font-light tracking-wide">
              Visit Our Commercial Showrooms in Aba
            </h2>
            <p className="text-xs font-extralight text-slate-400 leading-relaxed">
              Experience the hardware hands-on, speak directly with certified technicians, and receive immediate device setup and diagnostic support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Showroom 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-[#FFB200]">
                <MapPin className="w-4 h-4" />
                <span>Branch 1 &bull; Flagship Retail &amp; Experience Showroom</span>
              </div>
              <p className="text-xs font-extralight text-slate-300">
                111/113 Azikiwe Road, Aba, Abia State, Nigeria
              </p>
              <p className="text-[11px] font-extralight text-slate-400">
                Open Monday – Saturday: 8:30 AM – 6:00 PM
              </p>
            </div>

            {/* Showroom 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-[#FFB200]">
                <MapPin className="w-4 h-4" />
                <span>Branch 2 &bull; Executive Showroom &amp; Enterprise Hub</span>
              </div>
              <p className="text-xs font-extralight text-slate-300">
                No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State, Nigeria
              </p>
              <p className="text-[11px] font-extralight text-slate-400">
                Open Monday – Saturday: 9:00 AM – 6:30 PM
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="https://wa.me/2348067150130"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-900 font-medium text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Aba Showroom Desk</span>
            </a>

            <Link
              href="/shop"
              className="px-6 py-2.5 border border-slate-700 hover:border-slate-500 text-white font-light text-xs uppercase tracking-wider rounded transition-colors"
            >
              Browse Hardware Catalog &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
