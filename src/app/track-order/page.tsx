"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/currency";
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [orderData, setOrderData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsLoading(true);
    setErrorMessage("");
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setOrderData(null);
        setErrorMessage(data.error || "Order not found. Please check your order reference number.");
      } else {
        setOrderData(data.order);
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to search order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-light uppercase tracking-wider mb-2 border border-blue-200/50">
            <Truck className="w-3.5 h-3.5 text-blue-600 stroke-[1.5]" />
            <span>GIG Logistics Manifest Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide uppercase">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-400 mt-2">
            Enter your Order Number (e.g. <strong>GT-2026-XXXX</strong>) or GIG Waybill Reference to see real-time dispatch progress.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 max-w-2xl mx-auto">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order Number (e.g. GT-2026-1001) or GIG Waybill"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light font-mono text-slate-800 focus:outline-none focus:border-[#FFB200] uppercase placeholder:normal-case placeholder:font-sans"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 stroke-[1.5]" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? "Looking up..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Error Notice */}
        {hasSearched && errorMessage && (
          <div className="mt-6 p-6 bg-white rounded border border-red-200 text-center space-y-3 max-w-2xl mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto stroke-[1.5]" />
            <h3 className="font-normal text-sm text-slate-800">{errorMessage}</h3>
            <p className="text-xs font-extralight text-slate-400">
              Need help locating your order? Contact customer care directly on WhatsApp:
            </p>
            <a
              href="https://wa.me/2348067150130?text=Hello%20GuaranteedTech%2C%20I%20need%20help%20tracking%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white font-light text-xs uppercase tracking-wider rounded shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat with Delivery Support
            </a>
          </div>
        )}

        {/* Order Details Found */}
        {orderData && (
          <div className="mt-8 bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-mono font-light text-[#FFB200] block">
                  {orderData.orderNumber}
                </span>
                <h3 className="text-lg font-light text-slate-800">
                  {orderData.customerName}
                </h3>
                <span className="text-xs font-extralight text-slate-400">
                  Destination: {orderData.deliveryCity}, {orderData.deliveryState} State
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-extralight text-slate-400 block">Order Status:</span>
                <span className="inline-block px-3 py-0.5 rounded bg-blue-50 text-blue-900 font-light text-xs border border-blue-200">
                  {orderData.status}
                </span>
              </div>
            </div>

            {/* Shipment Tracking Details */}
            {orderData.shipment ? (
              <div className="p-4 rounded bg-blue-50/40 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 stroke-[1.5]" />
                    <span className="font-normal text-xs text-slate-800">
                      GIG Logistics Waybill: {orderData.shipment.trackingNumber}
                    </span>
                  </div>
                  <span className="text-[10px] font-light text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {orderData.shipment.status}
                  </span>
                </div>
                <p className="text-xs font-extralight text-slate-600">
                  Current Note: {orderData.shipment.statusDescription || "In transit via GIG Logistics network."}
                </p>
              </div>
            ) : (
              <p className="text-xs font-extralight text-slate-400 italic">
                Shipment manifest is being processed by fulfillment staff.
              </p>
            )}

            {/* Items Summary */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-normal uppercase tracking-wider text-slate-700 block">
                Ordered Hardware:
              </span>
              <div className="divide-y divide-slate-100 text-xs">
                {orderData.items?.map((it: any) => (
                  <div key={it.id} className="py-2 flex justify-between">
                    <span className="text-slate-700 font-light">
                      {it.quantity}x {it.productName} {it.variantName ? `(${it.variantName})` : ""}
                    </span>
                    <span className="font-normal text-slate-800">{formatNaira(it.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-light">
                Total Paid: <strong className="text-[#FFB200] font-normal">{formatNaira(orderData.totalAmount)}</strong>
              </span>
              <Link
                href={`/orders/${orderData.orderNumber}`}
                className="font-light text-amber-600 hover:underline flex items-center gap-1"
              >
                View Full Printable Invoice <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
