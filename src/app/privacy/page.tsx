import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | GuaranteedTech Nigeria",
  description: "Read GuaranteedTech's privacy policy regarding customer data, order details, and privacy protection in Nigeria.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            Legal &amp; Privacy
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800">
            GuaranteedTech Privacy Policy
          </h1>
          <p className="text-xs font-extralight text-slate-400">
            Last Updated: January 2026 &bull; GuaranteedTech Enterprise Solutions Nigeria
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm font-extralight text-slate-600 leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">1. Customer Privacy Commitment</h2>
            <p>
              GuaranteedTech respects your personal privacy. We collect customer contact details (such as recipient name, delivery address, phone number, and email address) strictly to facilitate order verification, GIG Logistics nationwide shipping, waybill updates, and warranty service records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">2. No Public Data Sharing</h2>
            <p>
              We do not sell, rent, or publicly display customer purchasing history, phone numbers, or delivery locations. Your purchase records and invoices are strictly confidential and accessible solely by you via your unique order reference or by authorized GuaranteedTech logistics personnel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">3. Payment on Delivery Security</h2>
            <p>
              Because our primary fulfillment model is nationwide Payment on Delivery, GuaranteedTech does not store your credit card or sensitive banking credentials on our web servers. Payments are completed safely upon doorstep or GIG station inspection via POS terminal or direct bank transfer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-normal text-slate-800">4. Contact &amp; Enquiries</h2>
            <p>
              If you have any questions regarding your data or wish to update your records, please contact our support team at <strong className="font-mono text-slate-800">guarateedtech17@gmail.com</strong> or WhatsApp <strong className="font-mono text-slate-800">+234 806 715 0130</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
