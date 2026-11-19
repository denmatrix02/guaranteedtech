import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import {
  User,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Truck,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerAccountPage() {
  // Query customer details or sample active account
  const customer = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true, shipment: true },
      },
    },
  });

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Profile Card */}
        <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded bg-slate-900 text-[#FFB200] font-light text-xl flex items-center justify-center">
              {customer?.name ? customer.name[0] : "C"}
            </div>
            <div>
              <span className="text-[11px] font-light uppercase tracking-[0.16em] text-[#FFB200] block">
                Customer Account
              </span>
              <h1 className="text-xl sm:text-2xl font-light text-slate-800">
                {customer?.name || "Valued Customer"}
              </h1>
              <p className="text-xs font-extralight text-slate-400">{customer?.email} • {customer?.phone || "+234 809 988 7766"}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/track-order"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-light uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Truck className="w-3.5 h-3.5 text-blue-600 stroke-[1.5]" /> Track Parcels
            </Link>
          </div>
        </div>

        {/* Content Grid: Order History & Saved Address */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order History */}
          <div className="lg:col-span-8 bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FFB200] stroke-[1.5]" /> Purchase History
              </h2>
              <span className="text-[11px] font-extralight text-slate-400">6-Month Warranty Included</span>
            </div>

            {(!customer?.orders || customer.orders.length === 0) ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs font-extralight text-slate-400">You have no recent online orders.</p>
                <Link href="/shop" className="text-xs font-light text-amber-600 hover:underline">
                  Browse Computing Hardware &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((ord: any) => (
                  <div key={ord.id} className="p-4 rounded bg-white border border-[#EBEBEB] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-normal text-slate-800">{ord.orderNumber}</span>
                      <span className="font-normal text-[#FFB200]">{formatNaira(ord.totalAmount)}</span>
                    </div>

                    <div className="text-[11px] font-extralight text-slate-500">
                      {ord.items.map((it: any) => it.productName).join(", ")}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[10px] font-light px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                        {ord.status}
                      </span>
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="font-light text-amber-600 hover:underline flex items-center gap-1"
                      >
                        View Invoice <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Addresses & Direct Support */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded border border-[#EBEBEB] p-6 space-y-3">
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FFB200] stroke-[1.5]" /> Saved Delivery Address
              </h3>
              <p className="text-xs font-extralight text-slate-600 leading-relaxed">
                <strong className="font-normal text-slate-800">Chukwudi Okafor</strong><br />
                111/113 Azikiwe Road<br />
                Aba, Abia State, Nigeria<br />
                Phone: +234 809 988 7766
              </p>
            </div>

            <div className="bg-emerald-50/40 rounded border border-emerald-500/20 p-6 space-y-3">
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-emerald-950 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 stroke-[1.5]" /> Dedicated WhatsApp Desk
              </h3>
              <p className="text-xs font-extralight text-emerald-900 leading-relaxed">
                Need urgent technical assistance, warranty diagnostic support, or a customized quote?
              </p>
              <a
                href="https://wa.me/2348067150130"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                Chat on WhatsApp (+234 806 715 0130)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
