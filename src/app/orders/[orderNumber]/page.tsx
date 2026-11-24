import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import {
  CheckCircle2,
  Truck,
  Printer,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Package,
} from "lucide-react";

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      shipment: true,
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hello GuaranteedTech, I just placed order ${order.orderNumber} for ${formatNaira(order.totalAmount)}. Please confirm receipt and shipment status.`
  );
  const whatsappUrl = `https://wa.me/2348067150130?text=${whatsappMessage}`;

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Success Banner */}
        <div className="bg-white rounded border border-[#EBEBEB] p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <span className="text-xs font-light text-[#FFB200] uppercase tracking-[0.16em]">
              Order Confirmed &amp; Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide uppercase mt-1">
              Thank you, {order.customerName.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm font-extralight text-slate-400 mt-2 max-w-md mx-auto">
              Your order <strong className="text-slate-800 font-mono font-normal">{order.orderNumber}</strong> has been logged into our fulfillment queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Confirm on WhatsApp
            </a>

            <Link
              href="/shop"
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-light text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors border border-slate-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* GIG Logistics Tracking Card */}
        {order.shipment && (
          <div className="bg-white rounded border border-blue-100 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-blue-600 stroke-[1.5]" />
                <div>
                  <h3 className="font-normal text-xs uppercase tracking-wider text-slate-800">
                    GIG Logistics Shipment Manifest
                  </h3>
                  <span className="text-[11px] font-extralight text-blue-700">
                    Carrier: {order.shipment.carrier}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extralight text-slate-400 block">Waybill / Tracking No.</span>
                <span className="font-mono font-normal text-xs text-slate-800">
                  {order.shipment.trackingNumber || "Pending Booking"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 font-extralight block mb-0.5">Shipment Status:</span>
                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-light text-[10px] border border-blue-200">
                  {order.shipment.status}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 font-extralight block mb-0.5">Status Description:</span>
                <span className="font-light text-slate-700">
                  {order.shipment.statusDescription || "Awaiting dispatch from Aba showroom central hub"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment on Delivery Instructions */}
        <div className="bg-emerald-50/60 rounded border border-emerald-200 p-6 sm:p-8 space-y-3.5">
          <div className="flex items-center gap-2 text-emerald-900">
            <Truck className="w-4 h-4 text-emerald-700 stroke-[1.5]" />
            <h3 className="font-normal text-xs uppercase tracking-wider">
              Payment on Delivery (Cash, POS or Mobile Transfer Upon Receipt)
            </h3>
          </div>
          <p className="text-xs font-extralight text-emerald-950 leading-relaxed">
            Your order has been booked with <strong className="font-normal text-emerald-900">Payment on Delivery</strong>. No upfront payment is required. You will only pay <strong className="font-normal text-slate-900">{formatNaira(order.totalAmount)}</strong> directly to the delivery courier after you inspect and verify your package.
          </p>
          <div className="pt-2 text-[11px] font-light text-emerald-800 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>&bull; Verified GIG Logistics Delivery</span>
            <span>&bull; Free Hardware Inspection Before Payment</span>
            <span>&bull; Official GTC Warranty Protection</span>
          </div>
        </div>

        {/* Order Details & Receipt */}
        <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800">Itemized Order Receipt</h3>
            <span className="text-[11px] font-mono font-extralight text-slate-400">
              Placed {new Date(order.createdAt).toLocaleDateString("en-NG")}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-light text-slate-800">{item.productName}</h4>
                  {item.variantName && (
                    <span className="text-[10px] font-light text-amber-700">{item.variantName}</span>
                  )}
                  <span className="text-slate-400 font-extralight block mt-0.5">
                    Qty: {item.quantity} × {formatNaira(item.unitPrice)}
                  </span>
                </div>
                <span className="font-normal text-slate-800 text-xs sm:text-sm">
                  {formatNaira(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-light">Subtotal:</span>
              <span className="font-normal text-slate-800">{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-light">GIG Delivery Fee:</span>
              <span className="font-normal text-slate-800">{formatNaira(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm">
              <span className="font-light text-slate-800">Total Amount:</span>
              <span className="font-normal text-lg text-[#FFB200]">
                {formatNaira(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-extralight block mb-1">Customer Delivery Address:</span>
              <p className="font-light text-slate-700 leading-relaxed">
                {order.customerName}<br />
                {order.deliveryAddress}<br />
                {order.deliveryCity}, {order.deliveryState} State<br />
                Phone: {order.customerPhone}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-extralight block mb-1">Payment Method &amp; Status:</span>
              <p className="font-light text-slate-700 leading-relaxed">
                Method: <strong>{order.paymentMethod === "CASH_ON_DELIVERY" ? "Payment on Delivery (COD)" : order.paymentMethod}</strong><br />
                Status: <span className="text-[#FFB200] font-normal">{order.paymentStatus}</span><br />
                Order Channel: {order.channel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
