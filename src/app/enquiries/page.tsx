"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function EnquiriesPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("PRODUCT_SOURCING");
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [targetBudget, setTargetBudget] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          enquiryType,
          requestedQuantity,
          targetBudget: targetBudget ? parseFloat(targetBudget) : null,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setIsSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E6] border border-[#FFE699] text-amber-900 text-xs font-light uppercase tracking-[0.16em] mb-3">
            <FileText className="w-3.5 h-3.5 text-[#FFB200]" />
            <span>Enterprise Procurement &amp; Special Sourcing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide uppercase">
            Product Sourcing &amp; Corporate RFQ
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-400 mt-2 max-w-xl mx-auto">
            Looking for a computer not currently listed in our stock, or procuring a fleet of laptops for your company? Submit your specifications below.
          </p>
        </div>

        <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-10 space-y-6 max-w-3xl mx-auto shadow-none">
          {isSuccess && (
            <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-medium">Request Logged Successfully!</strong>
                <span className="font-light">Our enterprise sourcing desk has received your requirements and will reply via WhatsApp or Phone within 2 business hours.</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-light">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adeola Johnson"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0806 715 0130"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Company / Personal Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adeola@company.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Request Type</label>
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                >
                  <option value="PRODUCT_SOURCING">Unlisted Hardware Sourcing</option>
                  <option value="BULK_PURCHASE">Corporate Supply &amp; Fleet RFQ</option>
                  <option value="SPECIAL_PRICING">Special Pricing Request</option>
                  <option value="TECHNICAL_SUPPORT">Custom Hardware Specification</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Quantity Required</label>
                <input
                  type="number"
                  min="1"
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Target Budget (₦ per unit)</label>
                <input
                  type="number"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  placeholder="e.g. 600000"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Required Model &amp; Technical Specifications *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify preferred brands, CPU generation (e.g. Core i7 or Ryzen 7), RAM (e.g. 16GB or 32GB), SSD size, screen size, and delivery city..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-medium text-xs uppercase tracking-[0.14em] rounded-full transition-colors flex items-center justify-center gap-2 shadow-none disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Submitting..." : "Submit Procurement Request"}
            </button>
          </form>

          <div className="pt-4 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-light">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[1.5]" /> All sourced machines come with GTC Warranty
            </span>
            <a
              href="https://wa.me/2348067150130"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-700 hover:underline"
            >
              Or chat directly on WhatsApp &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

