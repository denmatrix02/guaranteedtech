import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | GuaranteedTech Nigeria",
  description: "Read GuaranteedTech's terms of service, payment on delivery conditions, and order policies.",
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            Customer Agreement
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800">
            Terms of Service &amp; Fulfillment
          </h1>
          <p className="text-xs font-extralight text-slate-400">
            Effective January 2026 &bull; GuaranteedTech Computers &amp; IT Hardware
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm font-extralight text-slate-600 leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">1. Orders and Nationwide Fulfillment</h2>
            <p>
              By placing an order on GuaranteedTech, you authorize our dispatch desk to fulfill and ship your selected hardware via GIG Logistics across Nigeria. Standard delivery times are 24–48 hours for Lagos, Abuja, and South-East hubs, and 48–72 hours for other states.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">2. Inspection and Payment on Delivery</h2>
            <p>
              Under our Payment on Delivery model, customers are entitled to unbox and power on the computer hardware upon receipt to confirm physical integrity and matching specifications before completing payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">3. Standard Warranty Terms</h2>
            <p>
              Hardware sold by GuaranteedTech is protected under our transparent tiered warranty: 3 Months for Refurbished units, 6 Months for Open Box units, and 1-Year Official Brand Warranty for Brand New factory-sealed devices. Please review our full <Link href="/warranty" className="text-amber-600 hover:underline">Warranty Policy</Link> for detailed coverage criteria.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">4. Physical Showrooms &amp; Jurisdiction</h2>
            <p>
              GuaranteedTech operates commercial showrooms in Aba, Abia State, Nigeria at 111/113 Azikiwe Road and No. 2 Asa Road beside Aba Town Hall. All transactions are governed by the laws of the Federal Republic of Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
