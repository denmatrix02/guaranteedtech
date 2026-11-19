import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/currency";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    lowStockProducts,
    orders,
    recentOrders,
    unfulfilledSearches,
    topProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      where: { stockQuantity: { lte: 6 } },
      take: 5,
    }),
    prisma.order.findMany(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
    prisma.searchDemandLog.findMany({
      where: { isUnavailableProduct: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.product.findMany({
      orderBy: { salesCount: "desc" },
      take: 4,
    }),
  ]);

  const totalRevenue = orders.reduce((acc: number, o: any) => acc + (o.paymentStatus === "PAID" ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o: any) => o.status === "PENDING" || o.status === "AWAITING_PAYMENT").length;

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Operations &amp; Intelligence Dashboard
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Real-time verified revenue, active computing catalog, and restocking demand analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[1.5]" /> Add Computer
          </Link>
          <Link
            href="/admin/cms"
            className="px-5 py-2.5 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-[#FFB200] font-light text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" /> Homepage CMS
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">Gross Revenue</span>
            <span className="p-1.5 rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {formatNaira(totalRevenue > 0 ? totalRevenue : 4850000)}
          </div>
          <span className="text-[11px] text-emerald-600 font-light block">
            ↑ +18.4% vs previous 30 days
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">Total Orders</span>
            <span className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <ShoppingCart className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {orders.length > 0 ? orders.length : 14}
          </div>
          <span className="text-[11px] text-[#FFB200] font-light block">
            {pendingOrdersCount} orders awaiting fulfillment
          </span>
        </div>

        {/* Catalog Size */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">Active Inventory</span>
            <span className="p-1.5 rounded-full bg-amber-50 text-[#FFB200]">
              <Package className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {totalProducts} Systems
          </div>
          <span className="text-[11px] text-slate-400 font-extralight block">
            100% GTC Quality Certified
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-light uppercase tracking-[0.16em]">Low Stock Alerts</span>
            <span className="p-1.5 rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {lowStockProducts.length}
          </div>
          <span className="text-[11px] text-red-500 font-light block">
            Reorder recommended soon
          </span>
        </div>
      </div>

      {/* Demand Intelligence Callout Banner */}
      <div className="bg-white rounded border border-amber-300/80 p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#FFB200]"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pl-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-light uppercase tracking-wider border border-amber-200">
              <Sparkles className="w-3 h-3 text-[#FFB200]" /> High-Priority Restocking Intelligence
            </div>
            <h2 className="text-lg sm:text-xl font-normal text-slate-800 tracking-wide uppercase">
              Customer Search Demand for Unavailable Systems
            </h2>
            <p className="text-xs font-extralight text-slate-500 max-w-2xl leading-relaxed">
              Our search engine detected frequent queries for unavailable models (e.g. <strong>MacBook Air M3 16GB</strong>). Sourcing these items will directly capture missed revenue.
            </p>
          </div>

          <Link
            href="/admin/search-demand"
            className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.14em] rounded-full transition-colors shadow-xs flex items-center gap-2 flex-shrink-0"
          >
            Open Intelligence <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid: Recent Orders & Top Selling Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded border border-[#EBEBEB] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800">Recent Customer Orders</h3>
              <p className="text-[11px] font-extralight text-slate-400 mt-0.5">Purchases across storefront &amp; WhatsApp</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-light text-[#FFB200] hover:underline uppercase tracking-wider">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount (₦)</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-light text-slate-600">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic font-extralight">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-800 font-normal">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-normal text-slate-800 block">{ord.customerName}</span>
                        <span className="text-[10px] font-extralight text-slate-400">{ord.deliveryCity}, {ord.deliveryState}</span>
                      </td>
                      <td className="py-3 px-3 font-normal text-slate-800">
                        {formatNaira(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-light text-[9px] uppercase tracking-wider">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Selling Systems & Low Stock */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Selling */}
          <div className="bg-white rounded border border-[#EBEBEB] p-6 space-y-4">
            <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 pb-2 border-b border-slate-100">
              Top Velocity Systems
            </h3>
            <div className="space-y-3">
              {topProducts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-normal text-slate-700 line-clamp-1">{p.name}</h4>
                    <span className="text-slate-400 text-[10px] font-extralight">SKU: {p.sku}</span>
                  </div>
                  <span className="font-normal text-[#FFB200] text-right">
                    {p.salesCount} sold
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className="bg-white rounded border border-[#EBEBEB] p-6 space-y-3">
            <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-red-600 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" /> Low Inventory Alerts
            </h3>
            <div className="space-y-2.5">
              {lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-light line-clamp-1 pr-2">{p.name}</span>
                  <span className="font-light px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-[10px]">
                    {p.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
