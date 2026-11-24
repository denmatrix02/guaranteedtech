import React from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Truck,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Phone,
  Lock,
} from "lucide-react";
import { OrderLookupClient } from "./OrderLookupClient";

export const metadata = {
  title: "Customer Support & Order Lookup | GuaranteedTech Nigeria",
  description: "Track your orders, check GIG Logistics delivery status, verify GTC warranty coverage, or reach customer support.",
};

export default function CustomerAccountPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Profile / Support Card */}
        <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-[#FFB200] font-light text-xl flex items-center justify-center border border-slate-800">
              <User className="w-7 h-7 stroke-[1.4]" />
            </div>
            <div>
              <span className="text-[11px] font-light uppercase tracking-[0.16em] text-[#FFB200] block">
                Customer Care &amp; Service Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-light text-slate-800">
                Welcome to GuaranteedTech
              </h1>
              <p className="text-xs font-extralight text-slate-400 mt-0.5">
                Manage your orders, track shipments, and request certified technical support.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/track-order"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-light uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Truck className="w-3.5 h-3.5 text-blue-600 stroke-[1.5]" />
              <span>Track GIG Parcel</span>
            </Link>

            <a
              href="https://wa.me/2348067150130"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-light uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors border border-emerald-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 stroke-[1.5]" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>

        {/* Content Grid: Order Lookup & Service Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Order Lookup & Self-Service */}
          <div className="lg:col-span-8 space-y-6">
            <OrderLookupClient />

            {/* Quick Service Links */}
            <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FFB200] stroke-[1.5]" />
                Customer Support Services
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Link
                  href="/track-order"
                  className="p-4 rounded border border-slate-100 hover:border-blue-400 hover:bg-blue-50/20 transition-all space-y-1 block"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>GIG Logistics Waybill Tracking</span>
                  </div>
                  <p className="text-[11px] font-extralight text-slate-500">
                    Track delivery status for all orders dispatched across Lagos, Abuja, Port Harcourt, and nationwide.
                  </p>
                </Link>

                <Link
                  href="/warranty"
                  className="p-4 rounded border border-slate-100 hover:border-amber-400 hover:bg-amber-50/20 transition-all space-y-1 block"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-[#FFB200]" />
                    <span>GTC Warranty Protection</span>
                  </div>
                  <p className="text-[11px] font-extralight text-slate-500">
                    Learn about our 3-tier warranty: 3M Refurbished, 6M Open Box, and 1-Year Brand Manufacturer Warranty.
                  </p>
                </Link>

                <Link
                  href="/enquiries"
                  className="p-4 rounded border border-slate-100 hover:border-purple-400 hover:bg-purple-50/20 transition-all space-y-1 block"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span>Corporate Procurement &amp; RFQ</span>
                  </div>
                  <p className="text-[11px] font-extralight text-slate-500">
                    Request custom quotations or bulk laptop sourcing for developer teams, businesses, and schools.
                  </p>
                </Link>

                <Link
                  href="/contact"
                  className="p-4 rounded border border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all space-y-1 block"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Physical Experience Showrooms</span>
                  </div>
                  <p className="text-[11px] font-extralight text-slate-500">
                    Visit our physical hubs in Aba at 111/113 Azikiwe Road and No. 2 Asa Road beside Aba Town Hall.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Side Column: Staff Portal & Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Showroom Contacts */}
            <div className="bg-white rounded border border-[#EBEBEB] p-6 space-y-4">
              <h3 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800">
                Direct Showroom Contacts
              </h3>

              <div className="space-y-3 text-xs font-light text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block text-[11px] uppercase tracking-wider">
                      Flagship Aba Showroom
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      111/113 Azikiwe Road, Aba, Abia State
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FFB200] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                  <div>
                    <span className="font-normal text-slate-800 block text-[11px] uppercase tracking-wider">
                      Executive Enterprise Hub
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      No. 2 Asa Road (Beside Aba Town Hall), Aba
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 stroke-[1.5]" />
                  <a
                    href="https://wa.me/2348067150130"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 font-light text-xs"
                  >
                    +234 806 715 0130
                  </a>
                </div>
              </div>
            </div>

            {/* Staff / Operator Login Link */}
            <div className="bg-slate-50 rounded border border-slate-200 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-normal text-slate-700">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Authorized Staff Portal</span>
              </div>
              <p className="text-[11px] font-extralight text-slate-500 leading-relaxed">
                Store operators and inventory managers can sign in to manage products, Facebook posts, and order dispatches.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <span>Operator Login &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
