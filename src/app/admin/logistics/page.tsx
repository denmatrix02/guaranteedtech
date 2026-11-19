import React from "react";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import {
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLogisticsPage() {
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { items: true },
      },
    },
  });

  const bookedCount = shipments.filter((s: any) => s.status === "BOOKED").length;
  const inTransitCount = shipments.filter((s: any) => s.status === "IN_TRANSIT").length;
  const deliveredCount = shipments.filter((s: any) => s.status === "DELIVERED").length;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[10px] font-light uppercase tracking-wider mb-2 border border-blue-200">
          <Truck className="w-3.5 h-3.5 text-blue-600 stroke-[1.5]" />
          <span>Carrier Partner Operations</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          GIG Logistics Fulfilment &amp; Manifest Center
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Automated rate computation, waybill generation, real-time tracking synchronization, and Cash on Delivery reconciliation.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">Awaiting Dispatch</span>
            <span className="p-1.5 rounded-full bg-amber-50 text-amber-600">
              <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">{bookedCount} Parcels</div>
          <span className="text-[11px] text-amber-600 font-light block">
            Pickup scheduled at Aba central hub
          </span>
        </div>

        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">In Transit</span>
            <span className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <Truck className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">{inTransitCount} Parcels</div>
          <span className="text-[11px] text-blue-600 font-light block">
            Interstate &amp; intra-Lagos deliveries
          </span>
        </div>

        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">Delivered Successfully</span>
            <span className="p-1.5 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">{deliveredCount} Parcels</div>
          <span className="text-[11px] text-emerald-600 font-light block">
            99.2% on-time fulfilment rate
          </span>
        </div>
      </div>

      {/* Shipments Manifest Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-normal text-xs text-slate-800 uppercase tracking-[0.16em]">
            Active Waybills &amp; Shipments
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">GIG Merchant Code: GIGM_GT_1001</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Waybill / Tracking No</th>
                <th className="py-3 px-4">Customer Order</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">COD Amount</th>
                <th className="py-3 px-4">Carrier Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {shipments.map((ship: any) => (
                <tr key={ship.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-normal text-slate-800 block">
                      {ship.trackingNumber}
                    </span>
                    <span className="text-[10px] font-extralight text-slate-400">Carrier: {ship.carrier}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-normal text-slate-800 block">{ship.order.orderNumber}</span>
                    <span className="text-[11px] font-extralight text-slate-400">{ship.order.customerName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-normal text-slate-800 block">
                      {ship.order.deliveryCity}, {ship.order.deliveryState}
                    </span>
                    <span className="text-[11px] font-extralight text-slate-400 line-clamp-1">
                      {ship.order.deliveryAddress}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-normal text-slate-800">
                    {ship.codAmount && ship.codAmount > 0 ? formatNaira(ship.codAmount) : "Prepaid"}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-light text-[9px] uppercase tracking-wider">
                      {ship.status}
                    </span>
                    <span className="text-[10px] font-extralight text-slate-400 block mt-0.5">
                      {ship.statusDescription}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/orders/${ship.order.orderNumber}`}
                      target="_blank"
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition-colors inline-block"
                      title="View Invoice"
                    >
                      <ExternalLink className="w-4 h-4 stroke-[1.4]" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
