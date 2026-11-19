"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/currency";
import {
  ShoppingCart,
  MessageSquare,
  Plus,
  ExternalLink,
  CheckCircle2,
  Truck,
  Printer,
  X,
} from "lucide-react";

export function OrdersClient({
  initialOrders,
  products,
}: {
  initialOrders: any[];
  products: any[];
}) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manual WhatsApp Order Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryState, setDeliveryState] = useState("Lagos");
  const [deliveryCity, setDeliveryCity] = useState("Ikeja");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [internalNotes, setInternalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Update Handler
  const handleStatusChange = async (orderId: string, newStatus: string, newPaymentStatus?: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          orderId,
          newStatus,
          newPaymentStatus: newPaymentStatus || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(
          orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  paymentStatus: newPaymentStatus || o.paymentStatus,
                }
              : o
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Manual WhatsApp Order
  const handleCreateWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_WHATSAPP_ORDER",
          customerName,
          customerPhone,
          deliveryState,
          deliveryCity,
          deliveryAddress,
          items: [{ productId: selectedProductId, quantity }],
          internalNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders([data.order, ...orders]);
        setIsModalOpen(false);
        setCustomerName("");
        setCustomerPhone("");
        setDeliveryAddress("");
        setInternalNotes("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-light text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-[#EBEBEB]">
            Total Orders: <strong className="font-normal text-slate-900">{orders.length}</strong>
          </span>
          <span className="text-xs font-light text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Active Fulfilments: <strong className="font-normal">{orders.filter((o) => o.status === "PROCESSING").length}</strong>
          </span>
        </div>

        {/* Create Manual WhatsApp Order Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors"
        >
          <MessageSquare className="w-4 h-4 stroke-[1.5]" /> Create Manual WhatsApp Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order / Channel</th>
                <th className="py-3 px-4">Customer &amp; Location</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total (₦)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-normal text-slate-800 block">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`text-[9px] font-light uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                        ord.channel === "WHATSAPP"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {ord.channel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-normal text-slate-800 block">{ord.customerName}</span>
                    <span className="text-[11px] font-extralight text-slate-400 block">{ord.customerPhone}</span>
                    <span className="text-[11px] font-light text-slate-500">
                      {ord.deliveryCity}, {ord.deliveryState}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-xs text-slate-600">
                      {ord.items?.map((it: any) => (
                        <div key={it.id} className="text-[11px] line-clamp-1">
                          • {it.quantity}x {it.productName}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-normal text-slate-800">
                    {formatNaira(ord.totalAmount)}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => handleStatusChange(ord.id, ord.status, e.target.value)}
                      className={`px-2.5 py-1 rounded text-[10px] font-light uppercase tracking-wider border ${
                        ord.paymentStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="UNPAID">UNPAID</option>
                      <option value="PENDING_VERIFICATION">VERIFYING</option>
                      <option value="PAID">PAID</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="px-2 py-1 rounded text-[11px] font-bold border border-slate-300 bg-white"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="AWAITING_PAYMENT">AWAITING PAYMENT</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      target="_blank"
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 inline-block"
                      title="View Customer Receipt"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual WhatsApp Order Creator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Create Manual WhatsApp Order
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWhatsAppOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Kolawole Davies"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="080XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Product *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatNaira(p.basePrice)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street and house number"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Internal Staff Notes (Optional)
                </label>
                <input
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Paid via Zenith bank transfer. Customer requested GTC sticker on outer box."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  {isSubmitting ? "Creating..." : "Generate GIG Waybill & Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

