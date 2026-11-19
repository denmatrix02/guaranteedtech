"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/currency";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryState, setDeliveryState] = useState("Lagos");
  const [deliveryCity, setDeliveryCity] = useState("Ikeja");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PAYSTACK");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const estimatedDelivery = subtotal >= 1000000 ? 0 : 5000;
  const grandTotal = subtotal + estimatedDelivery;

  const nigerianStates = [
    "Abia", "Abuja FCT", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
    "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryState,
          deliveryCity,
          deliveryAddress,
          deliveryInstructions,
          paymentMethod,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process order.");
      }

      // Order created successfully
      clearCart();
      router.push(`/orders/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen py-16 text-center border-t border-slate-100">
        <h2 className="text-xl font-light text-slate-800 uppercase tracking-wide mb-2">No items to checkout</h2>
        <p className="text-xs font-extralight text-slate-400 mb-6">Please add hardware to your cart before proceeding.</p>
        <Link href="/shop" className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs font-light text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-slate-800 transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-slate-800 font-normal">Checkout</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Secure Checkout
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Complete your delivery details. All payments and personal data are strictly encrypted.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-light">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery & Contact & Payment Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Contact Information */}
            <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>1. Contact &amp; Identification</span>
                <span className="text-[11px] font-extralight text-slate-400">Guest Checkout Supported</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Babatunde Adebayo"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Phone Number (WhatsApp Preferred) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0806 715 0130"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Email Address (For receipt &amp; GIG Tracking link) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="babatunde@example.com"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>2. Delivery Address (GIG Logistics)</span>
                <span className="text-[11px] font-light text-blue-600 flex items-center gap-1">
                  <Truck className="w-3 h-3 stroke-[1.5]" /> Nationwide Shipping
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Destination State *
                  </label>
                  <select
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  >
                    {nigerianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    City / Town / LGA *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="e.g. Ikeja, Lekki, Wuse 2, Port Harcourt"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Street Address &amp; House Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 14 Otigba Street, Opposite Tech Plaza"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-light text-slate-600 mb-1">
                    Delivery Instructions / Closest Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Call my number on arrival at the security gate"
                    className="w-full p-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>3. Payment Method</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-light">
                  All Transactions in ₦ Naira
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "PAYSTACK",
                    title: "Paystack Online Payment",
                    desc: "Pay securely with Debit Card, USSD, or Bank Transfer via Paystack",
                    icon: <CreditCard className="w-4 h-4 text-[#FFB200] stroke-[1.5]" />,
                  },
                  {
                    id: "BANK_TRANSFER",
                    title: "Direct Corporate Bank Transfer",
                    desc: "Transfer directly to GuaranteedTech Zenith Bank account",
                    icon: <Building2 className="w-4 h-4 text-blue-500 stroke-[1.5]" />,
                  },
                  {
                    id: "FLUTTERWAVE",
                    title: "Flutterwave Online",
                    desc: "Pay with Mastercard, Visa, Verve, or Barter",
                    icon: <CreditCard className="w-4 h-4 text-purple-500 stroke-[1.5]" />,
                  },
                  {
                    id: "CASH_ON_DELIVERY",
                    title: "Pay on Delivery (GIG Logistics)",
                    desc: "Available for verified locations in Lagos, Abuja & PH",
                    icon: <Truck className="w-4 h-4 text-emerald-500 stroke-[1.5]" />,
                  },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3.5 rounded border text-left transition-all flex items-start gap-3 ${
                      paymentMethod === pm.id
                        ? "border-[#FFB200] bg-amber-50/40"
                        : "border-[#EBEBEB] hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="p-2 rounded bg-slate-50 border border-slate-100 flex-shrink-0">
                      {pm.icon}
                    </div>
                    <div>
                      <h4 className="font-normal text-xs text-slate-800">{pm.title}</h4>
                      <p className="text-[11px] font-extralight text-slate-400 mt-0.5 leading-snug">{pm.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded border border-[#EBEBEB] p-6 space-y-5 sticky top-28">
            <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 pb-3 border-b border-slate-100">
              Review &amp; Place Order
            </h2>

            {/* Items Mini List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={`${it.productId}-${it.variantId || "def"}`} className="flex justify-between text-xs py-1">
                  <span className="text-slate-600 font-light line-clamp-1 pr-2">
                    {it.quantity}x {it.product.name}
                  </span>
                  <span className="font-normal text-slate-800 whitespace-nowrap">
                    {formatNaira(it.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Subtotal:</span>
                <span className="font-normal text-slate-800">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">GIG Logistics Delivery:</span>
                <span className="font-normal text-slate-800">
                  {estimatedDelivery === 0 ? "FREE" : formatNaira(estimatedDelivery)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                <span className="font-light text-slate-800">Total Payable:</span>
                <span className="font-normal text-lg text-[#FFB200]">{formatNaira(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              {isSubmitting ? "Placing Order..." : `Confirm & Place Order (${formatNaira(grandTotal)})`}
            </button>

            <div className="text-[10px] font-extralight text-slate-400 text-center leading-relaxed">
              By placing your order, you agree to GuaranteedTech Terms of Service, 6-Month Warranty coverage, and GIG Logistics fulfillment policies.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
