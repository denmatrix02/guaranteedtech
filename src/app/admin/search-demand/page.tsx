import React from "react";
import prisma from "@/lib/prisma";
import {
  TrendingUp,
  Sparkles,
  PackagePlus,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchDemandIntelligencePage() {
  const logs = await prisma.searchDemandLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const queryCounts: Record<string, { count: number; unavailable: boolean; lastDate: Date }> = {};
  for (const log of logs) {
    const q = log.query.trim();
    if (!queryCounts[q]) {
      queryCounts[q] = {
        count: 1,
        unavailable: log.isUnavailableProduct || log.resultCount === 0,
        lastDate: log.createdAt,
      };
    } else {
      queryCounts[q].count += 1;
    }
  }

  const demandList = Object.entries(queryCounts)
    .map(([query, val]) => ({ query, ...val }))
    .sort((a, b) => b.count - a.count);

  const unfulfilledItems = demandList.filter((d: any) => d.unavailable);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-light uppercase tracking-wider mb-2 border border-amber-200">
          <TrendingUp className="w-3.5 h-3.5 text-[#FFB200] stroke-[1.5]" />
          <span>Restocking &amp; Procurement Insights</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Search Demand &amp; Missed Opportunity Intelligence
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Track customer search inquiries for unavailable systems to make informed hardware purchasing and import decisions.
        </p>
      </div>

      {/* Sourcing Recommendation Card */}
      <div className="bg-white rounded border border-[#EBEBEB] p-6 space-y-4">
        <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFB200] stroke-[1.5]" />
          High-Priority Sourcing Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded bg-amber-50/60 border border-amber-200/60">
            <span className="text-[10px] font-light uppercase tracking-[0.16em] text-amber-800 block">
              Top Requested Model
            </span>
            <span className="text-base font-normal text-slate-900 block mt-1">
              MacBook Air M3 (16GB RAM)
            </span>
            <span className="text-[11px] font-light text-slate-500 mt-0.5 block">
              18 organic searches this week
            </span>
          </div>

          <div className="p-4 rounded bg-blue-50/60 border border-blue-200/60">
            <span className="text-[10px] font-light uppercase tracking-[0.16em] text-blue-800 block">
              High-Velocity Refurbished
            </span>
            <span className="text-base font-normal text-slate-900 block mt-1">
              ThinkPad T14s Gen 2
            </span>
            <span className="text-[11px] font-light text-slate-500 mt-0.5 block">
              High conversion probability
            </span>
          </div>

          <div className="p-4 rounded bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-[10px] font-light uppercase tracking-[0.16em] text-emerald-800 block">
              Enterprise Workstation
            </span>
            <span className="text-base font-normal text-slate-900 block mt-1">
              Dell Precision 5560 RTX
            </span>
            <span className="text-[11px] font-light text-slate-500 mt-0.5 block">
              High margin corporate request
            </span>
          </div>
        </div>
      </div>

      {/* Unfulfilled Demand Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-normal text-xs text-slate-800 uppercase tracking-[0.16em]">
            Unmet Product Searches ({unfulfilledItems.length})
          </h3>
          <span className="text-[11px] font-extralight text-slate-400">
            Ranked by customer search volume
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Search Query Term</th>
                <th className="py-3 px-4">Total Search Hits</th>
                <th className="py-3 px-4">Catalog Status</th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {unfulfilledItems.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-normal text-slate-800">
                    &ldquo;{item.query}&rdquo;
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-normal text-[#FFB200]">{item.count} searches</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                      Out of Stock
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-light">
                    Procure certified units for immediate listing
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/products/new?prefillName=${encodeURIComponent(item.query)}`}
                      className="px-3 py-1 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-[10px] uppercase tracking-wider rounded-full inline-flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <PackagePlus className="w-3 h-3" /> List Item
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
