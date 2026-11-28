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
  Layers,
  Award,
  Briefcase,
  MessageSquare,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  Boxes,
  Eye,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    outOfStockProducts,
    lowStockProductsCount,
    lowStockProductsList,
    totalCategories,
    totalBrands,
    activePromotions,
    totalOrders,
    pendingOrdersCount,
    completedOrdersCount,
    orders,
    recentOrders,
    newEnquiriesCount,
    recentEnquiries,
    pendingRfqsCount,
    recentRfqs,
    newsletterCount,
    topProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { isArchived: false } }),
    prisma.product.count({ where: { isPublished: true, isArchived: false } }),
    prisma.product.count({ where: { isPublished: false, isArchived: false } }),
    prisma.product.count({ where: { stockQuantity: 0, isArchived: false } }),
    prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 4 }, isArchived: false } }),
    prisma.product.findMany({
      where: { stockQuantity: { lte: 4 }, isArchived: false },
      take: 5,
      orderBy: { stockQuantity: "asc" },
      include: { category: true },
    }),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.promotion.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "AWAITING_PAYMENT", "PROCESSING"] } } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.findMany(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
    prisma.productEnquiry.count({ where: { status: "PENDING" } }),
    prisma.productEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.corporateRfq.count({ where: { status: { in: ["NEW", "REVIEWING"] } } }),
    prisma.corporateRfq.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.newsletterSubscriber.count(),
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { salesCount: "desc" },
      take: 5,
      include: { category: true },
    }),
  ]);

  const totalRevenue = orders.reduce(
    (acc: number, o: any) => acc + (o.paymentStatus === "PAID" ? o.totalAmount : 0),
    0
  );

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Page Header & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
              Operational Command Center
            </h1>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live DB Synced
            </span>
          </div>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Real-time catalog control, verified order fulfillment, corporate RFQs, and live storefront CMS.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.12em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" /> Add Product
          </Link>
          <Link
            href="/admin/categories"
            className="px-4 py-2 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-slate-900 font-light text-xs uppercase tracking-[0.12em] rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#FFB200]" /> Categories
          </Link>
          <Link
            href="/admin/promotions"
            className="px-4 py-2 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-slate-900 font-light text-xs uppercase tracking-[0.12em] rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB200]" /> Promotions
          </Link>
          <Link
            href="/admin/cms"
            className="px-4 py-2 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-slate-900 font-light text-xs uppercase tracking-[0.12em] rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFB200]" /> Homepage CMS
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-slate-900 font-light text-xs uppercase tracking-[0.12em] rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFB200]" /> Edit Pages
          </Link>
        </div>
      </div>

      {/* 2. Top Metric KPI Row (4 Key Financial & Volume Drivers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em]">Gross Paid Revenue</span>
            <span className="p-1.5 rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {formatNaira(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-400 font-extralight block">
            {totalOrders} total recorded orders
          </span>
        </div>

        {/* Orders Pipeline */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em]">Orders In Pipeline</span>
            <span className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <ShoppingCart className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {pendingOrdersCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-light block">
            {completedOrdersCount} completed / delivered
          </span>
        </div>

        {/* Active Products in Catalog */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em]">Hardware Catalog</span>
            <span className="p-1.5 rounded-full bg-amber-50 text-[#FFB200]">
              <Package className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {publishedProducts} Published
          </div>
          <span className="text-[11px] text-slate-400 font-extralight block">
            {draftProducts} drafts • {totalProducts} total
          </span>
        </div>

        {/* Corporate RFQs & Enquiries */}
        <div className="bg-white p-5 rounded border border-[#EBEBEB] hover:border-amber-400 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em]">Corporate &amp; Leads</span>
            <span className="p-1.5 rounded-full bg-purple-50 text-purple-600">
              <Briefcase className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          </div>
          <div className="text-2xl font-normal text-slate-800 tracking-tight">
            {pendingRfqsCount} Pending RFQ
          </div>
          <span className="text-[11px] text-[#FFB200] font-light block">
            {newEnquiriesCount} new customer enquiries
          </span>
        </div>
      </div>

      {/* 3. Secondary Operational Stats Bar (100% Real Database Records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded border border-slate-100 text-center">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Out of Stock</span>
          <span className="text-lg font-normal text-red-600 mt-0.5 block">{outOfStockProducts}</span>
          <span className="text-[10px] font-extralight text-slate-400">Needs Sourcing</span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-100 text-center">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Low Stock</span>
          <span className="text-lg font-normal text-amber-600 mt-0.5 block">{lowStockProductsCount}</span>
          <span className="text-[10px] font-extralight text-slate-400">&le; 4 units left</span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-100 text-center">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Categories</span>
          <span className="text-lg font-normal text-slate-800 mt-0.5 block">{totalCategories}</span>
          <span className="text-[10px] font-extralight text-slate-400">Departments</span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-100 text-center">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Brands</span>
          <span className="text-lg font-normal text-slate-800 mt-0.5 block">{totalBrands}</span>
          <span className="text-[10px] font-extralight text-slate-400">Manufacturers</span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-100 text-center">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Active Promos</span>
          <span className="text-lg font-normal text-emerald-600 mt-0.5 block">{activePromotions}</span>
          <span className="text-[10px] font-extralight text-slate-400">Storefront Offers</span>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-100 text-center">
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Subscribers</span>
          <span className="text-lg font-normal text-blue-600 mt-0.5 block">{newsletterCount}</span>
          <span className="text-[10px] font-extralight text-slate-400">Newsletter</span>
        </div>
      </div>

      {/* 4. Main Workspace: Recent Orders + Low Inventory & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded border border-[#EBEBEB] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-[#FFB200]" /> Recent Customer Orders
              </h3>
              <p className="text-[11px] font-extralight text-slate-400 mt-0.5">
                Online orders across storefront and WhatsApp checkout
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-light text-[#FFB200] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount (₦)</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-light text-slate-600">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic font-extralight">
                      No customer orders recorded yet.
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
                        <span className="text-[10px] font-extralight text-slate-400">
                          {ord.deliveryCity ? `${ord.deliveryCity}, ${ord.deliveryState}` : ord.phone}
                        </span>
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

        {/* Low Stock Alerts & Best Selling (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Notifications */}
          <div className="bg-white rounded border border-[#EBEBEB] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" /> Low Stock Alerts
              </h3>
              <Link href="/admin/inventory" className="text-[10px] font-light text-slate-400 hover:text-slate-600">
                Manage Stock &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {lowStockProductsList.length === 0 ? (
                <p className="text-xs text-slate-400 font-extralight py-3 text-center">
                  All active catalog items are adequately stocked.
                </p>
              ) : (
                lowStockProductsList.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-slate-700 hover:text-blue-600 font-light truncate block"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[10px] font-extralight text-slate-400 block">
                        {p.category?.name || "Hardware"}
                      </span>
                    </div>
                    <span
                      className={`font-light px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 ${
                        p.stockQuantity === 0
                          ? "bg-red-50 text-red-600 border border-red-200 font-normal"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.stockQuantity === 0 ? "Out of Stock" : `${p.stockQuantity} left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Best-Selling Hardware */}
          <div className="bg-white rounded border border-[#EBEBEB] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB200]" /> Top-Selling Systems
              </h3>
              <Link href="/admin/products" className="text-[10px] font-light text-slate-400 hover:text-slate-600">
                All Products &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {topProducts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-light text-slate-800 truncate">{p.name}</h4>
                    <span className="text-slate-400 text-[10px] font-extralight">
                      SKU: {p.sku} • {formatNaira(p.basePrice)}
                    </span>
                  </div>
                  <span className="font-normal text-[#FFB200] text-right flex-shrink-0">
                    {p.salesCount} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Pipeline Feed: Recent Corporate RFQs & Customer Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Corporate RFQs */}
        <div className="bg-white rounded border border-[#EBEBEB] p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#FFB200]" /> Corporate RFQs &amp; Bulk Procurement
              </h3>
              <p className="text-[11px] font-extralight text-slate-400 mt-0.5">
                B2B institutional quotations, universities, banks &amp; fleets
              </p>
            </div>
            <Link href="/admin/rfq" className="text-xs font-light text-[#FFB200] hover:underline uppercase tracking-wider">
              Manage RFQs &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRfqs.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400 italic font-extralight">
                No corporate RFQs submitted yet.
              </p>
            ) : (
              recentRfqs.map((rfq: any) => (
                <div key={rfq.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-normal text-slate-800 block">
                      {rfq.companyName || rfq.customerName}
                    </span>
                    <span className="text-[11px] font-light text-slate-600 block mt-0.5">
                      {rfq.requestType.replace(/_/g, " ")} • Qty: {rfq.quantity}
                    </span>
                    <span className="text-[10px] font-extralight text-slate-400">
                      {rfq.email} • {rfq.phone}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    {rfq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Enquiries */}
        <div className="bg-white rounded border border-[#EBEBEB] p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-xs uppercase tracking-[0.16em] text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#FFB200]" /> Product Inquiries &amp; Support
              </h3>
              <p className="text-[11px] font-extralight text-slate-400 mt-0.5">
                Direct customer leads from storefront product cards
              </p>
            </div>
            <Link href="/admin/enquiries" className="text-xs font-light text-[#FFB200] hover:underline uppercase tracking-wider">
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEnquiries.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400 italic font-extralight">
                No customer inquiries logged yet.
              </p>
            ) : (
              recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-normal text-slate-800 block">
                      {enq.name}
                    </span>
                    <span className="text-[11px] font-light text-slate-600 block mt-0.5 line-clamp-1">
                      {enq.message}
                    </span>
                    <span className="text-[10px] font-extralight text-slate-400">
                      {enq.phone} {enq.email ? `• ${enq.email}` : ""}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    {enq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
