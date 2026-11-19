"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiryType, setEnquiryType] = useState("AVAILABILITY");
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
          email,
          phone,
          enquiryType,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-light text-[#FFB200] uppercase tracking-[0.16em]">
            Support &amp; Enquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide uppercase mt-1">
            Contact Showroom &amp; Support
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-400 mt-2">
            Visit our two strategic commercial showrooms in Aba, chat live on WhatsApp, or send a corporate procurement enquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Contact Information Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Card */}
            <div className="bg-emerald-50/40 rounded border border-emerald-500/20 p-6 sm:p-8 space-y-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded w-fit">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-normal text-base text-emerald-950 uppercase tracking-wide">
                Direct WhatsApp Hotline
              </h3>
              <p className="text-xs font-extralight text-emerald-900 leading-relaxed">
                Connect instantly with our sales and technical support representatives for availability confirmations and pictures of actual units.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/2348067150130"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Chat: +234 806 715 0130
                </a>
              </div>
            </div>

            {/* Showrooms & Hours Card */}
            <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-5">
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 pb-2 border-b border-slate-100">
                Aba Commercial Centers &amp; Hours
              </h3>
              <div className="space-y-4 text-xs text-slate-600">
                {/* Branch 1 */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block uppercase tracking-wide text-[11px]">
                      Branch 1 &bull; Flagship Retail &amp; Experience Showroom
                    </span>
                    <span className="font-extralight text-slate-600 block mt-0.5">
                      111/113 Azikiwe Road, Aba, Abia State, Nigeria
                    </span>
                    <span className="text-[10px] text-slate-400 font-extralight">
                      Retail laptop sales, direct diagnostics &amp; customer walk-in demonstrations.
                    </span>
                  </div>
                </div>

                {/* Branch 2 */}
                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <MapPin className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block uppercase tracking-wide text-[11px]">
                      Branch 2 &bull; Executive Showroom &amp; Enterprise Hub
                    </span>
                    <span className="font-extralight text-slate-600 block mt-0.5">
                      No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State, Nigeria
                    </span>
                    <span className="text-[10px] text-slate-400 font-extralight">
                      Corporate fleet procurement, enterprise workstations &amp; technical service center.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <Phone className="w-4 h-4 text-[#FFB200] flex-shrink-0 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block">Direct Lines:</span>
                    <span className="font-extralight text-slate-500">+234 806 715 0130</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#FFB200] flex-shrink-0 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block">Email Support:</span>
                    <a href="mailto:guarateedtech17@gmail.com" className="font-extralight text-slate-500 hover:text-blue-600 transition-colors">
                      guarateedtech17@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block">Operating Hours (Both Branches):</span>
                    <span className="font-extralight text-slate-500">
                      Monday – Saturday: 8:30 AM – 6:00 PM<br />
                      Sunday: Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 pb-3 border-b border-slate-100">
              Send an Enquiry or Quotation Request
            </h2>

            {isSuccess && (
              <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="block font-normal">Enquiry Received!</span>
                  <span className="font-extralight">Thank you! Our technical customer support desk will reach out to you via WhatsApp/Phone shortly.</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-light">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samuel Okon"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0806 715 0130"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel@company.com"
                  className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div>
                <label className="block text-xs font-light text-slate-600 mb-1">
                  Enquiry Type
                </label>
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                >
                  <option value="AVAILABILITY">Product Availability &amp; Pricing</option>
                  <option value="BULK_PURCHASE">Corporate Supply &amp; Bulk Procurement</option>
                  <option value="PRODUCT_SOURCING">Special Hardware Sourcing</option>
                  <option value="TECHNICAL_SUPPORT">Warranty &amp; Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-light text-slate-600 mb-1">
                  Message / Specifications Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us the system model, RAM/SSD requirements, quantity, or delivery city..."
                  className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
