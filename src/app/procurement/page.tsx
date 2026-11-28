"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Send, CheckCircle2, ShieldCheck, Phone, Mail, Building, Truck } from "lucide-react";

export default function ProcurementPage() {
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState("BULK_LAPTOPS");
  const [quantity, setQuantity] = useState("5");
  const [targetBudget, setTargetBudget] = useState("");
  const [timeline, setTimeline] = useState("Immediate (Within 7 Days)");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [requestedItems, setRequestedItems] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          companyName,
          email,
          phone,
          requestType,
          quantity: parseInt(quantity, 10) || 1,
          targetBudget: targetBudget ? parseFloat(targetBudget) : null,
          timeline,
          deliveryAddress,
          requestedItems,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to submit RFQ");

      setSubmittedRfq(data.rfq.rfqNumber);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-light uppercase tracking-[0.2em] text-[#FFB200] block">
            Enterprise &amp; Institutional Sales
          </span>
          <h1 className="text-2xl sm:text-4xl font-light text-slate-800 tracking-tight">
            Corporate Procurement &amp; Bulk Hardware RFQ
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-500 leading-relaxed">
            Equip your software engineering team, banking branch, university lab, or corporate office with tested enterprise hardware. Receive official proforma invoices with tax compliance within 24 hours.
          </p>
        </div>

        {/* Form Container or Success State */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-slate-200 p-6 sm:p-10 shadow-xs">
          {submittedRfq ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 stroke-[1.6]" />
              </div>
              <h2 className="text-xl font-normal text-slate-800">
                Procurement Request Submitted Successfully
              </h2>
              <p className="text-xs font-light text-slate-500 max-w-md mx-auto">
                Your RFQ Reference Number is <strong className="font-mono text-slate-800">{submittedRfq}</strong>. Our senior hardware operations team in Aba has received your specification and will dispatch a formal proforma invoice to <strong>{email}</strong> shortly.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-wider rounded-full transition-colors"
                >
                  Return to Storefront
                </Link>
                <a
                  href={`https://wa.me/2348067150130?text=${encodeURIComponent(`Hello GuaranteedTech, following up on our corporate RFQ: ${submittedRfq}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-full text-xs font-light transition-colors"
                >
                  Expedite via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Engr. Obinna Nwosu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Organization / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Fintech Solutions Ltd"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@apexfintech.ng"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Procurement Scope
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  >
                    <option value="BULK_LAPTOPS">Developer &amp; Office Laptops</option>
                    <option value="OFFICE_IT_INFRASTRUCTURE">Office Desktops &amp; Monitors</option>
                    <option value="PRINTERS_PRINTING">LaserJet Printers &amp; Scanners</option>
                    <option value="POWER_UPS_INFRASTRUCTURE">Clean Power &amp; Enterprise UPS</option>
                    <option value="CUSTOM_SOURCING">Custom Sourcing / Importation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Required Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                    Estimated Budget (Optional ₦)
                  </label>
                  <input
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    placeholder="e.g. 5000000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                  Detailed Hardware Specifications &amp; Preferred Models *
                </label>
                <textarea
                  rows={4}
                  required
                  value={requestedItems}
                  onChange={(e) => setRequestedItems(e.target.value)}
                  placeholder="e.g. 10 units Lenovo ThinkPad T14 Core i7 16GB RAM 512GB SSD, 2 units HP LaserJet Pro MFP M428fdw, 2 units APC Smart-UPS 1500VA LCD."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                  Delivery Destination &amp; State
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Plot 14, Victoria Island, Lagos State"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal uppercase tracking-[0.16em] rounded-full flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Generating Proforma Request..." : "Submit Formal RFQ"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
