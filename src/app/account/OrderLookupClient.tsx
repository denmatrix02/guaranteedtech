"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export function OrderLookupClient() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderQuery.trim().toUpperCase();
    if (!clean) {
      setError("Please enter your order reference number (e.g. GT-2026-XXXX).");
      return;
    }

    setLoading(true);
    setError("");

    // Route to the invoice page for this order number
    router.push(`/orders/${clean}`);
  };

  return (
    <div className="bg-slate-50/70 rounded-lg p-6 sm:p-8 border border-slate-200 space-y-4">
      <div>
        <h3 className="text-sm sm:text-base font-normal text-slate-800">
          Instant Order &amp; Invoice Lookup
        </h3>
        <p className="text-xs font-extralight text-slate-500 mt-1">
          Enter your official order reference (e.g. <span className="font-mono text-slate-700">GT-2026-1001</span>) received via SMS or WhatsApp upon checkout.
        </p>
      </div>

      <form onSubmit={handleLookup} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            required
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order Reference (e.g. GT-2026-1001)..."
            className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-xs sm:text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 flex items-center gap-1.5 font-light">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white rounded text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking Records...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Lookup Order &amp; Invoice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
