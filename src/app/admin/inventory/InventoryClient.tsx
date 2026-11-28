"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");

  // Track modified row values: { [productId]: { azikiweStock, asaRoadStock, lowStockThreshold } }
  const [editedRows, setEditedRows] = useState<Record<string, any>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFieldChange = (productId: string, field: string, val: string) => {
    setEditedRows((prev) => {
      const current = prev[productId] || {};
      return {
        ...prev,
        [productId]: {
          ...current,
          [field]: val,
        },
      };
    });
  };

  const handleSaveRow = async (p: any) => {
    const edits = editedRows[p.id];
    if (!edits) return;

    setSavingId(p.id);
    try {
      const azikiweCurrent = p.branchStock?.find((b: any) => b.branch === "AZIKIWE_ROAD")?.quantity || 0;
      const asaRoadCurrent = p.branchStock?.find((b: any) => b.branch === "ASA_ROAD")?.quantity || 0;

      const azikiweStock = edits.azikiweStock !== undefined ? parseInt(edits.azikiweStock, 10) || 0 : azikiweCurrent;
      const asaRoadStock = edits.asaRoadStock !== undefined ? parseInt(edits.asaRoadStock, 10) || 0 : asaRoadCurrent;
      const lowStockThreshold = edits.lowStockThreshold !== undefined ? parseInt(edits.lowStockThreshold, 10) || 3 : p.lowStockThreshold;

      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: p.id,
          azikiweStock,
          asaRoadStock,
          lowStockThreshold,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update stock");

      const newTotal = azikiweStock + asaRoadStock;
      setProducts((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? {
                ...item,
                stockQuantity: newTotal,
                lowStockThreshold,
                availabilityStatus: newTotal > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
                branchStock: [
                  { branch: "AZIKIWE_ROAD", quantity: azikiweStock },
                  { branch: "ASA_ROAD", quantity: asaRoadStock },
                ],
              }
            : item
        )
      );

      // Clear from editedRows
      setEditedRows((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });

      showToast("success", `Stock updated for ${p.name}`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save stock.");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }

    if (stockFilter === "LOW_STOCK") {
      return p.stockQuantity > 0 && p.stockQuantity <= 4;
    }
    if (stockFilter === "OUT_OF_STOCK") {
      return p.stockQuantity === 0;
    }
    if (stockFilter === "IN_STOCK") {
      return p.stockQuantity > 4;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {toast && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span className="font-light">{toast.text}</span>
          <button onClick={() => setToast(null)} className="font-bold text-slate-400">&times;</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded border border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.6]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search systems to manage showroom units..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
          />
        </div>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
        >
          <option value="ALL">All Stock Levels ({products.length})</option>
          <option value="LOW_STOCK">Low Stock Alert (&le; 4)</option>
          <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          <option value="IN_STOCK">Adequately Stocked (&gt; 4)</option>
        </select>
      </div>

      {/* Fast Inventory Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Hardware System</th>
                <th className="py-3 px-4 whitespace-nowrap">Azikiwe Rd Showroom</th>
                <th className="py-3 px-4 whitespace-nowrap">Asa Rd Showroom</th>
                <th className="py-3 px-4 whitespace-nowrap">Total Available</th>
                <th className="py-3 px-4 whitespace-nowrap">Low-Stock Alert</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Quick Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {filtered.map((p) => {
                const edits = editedRows[p.id] || {};
                const azikiweCurrent = p.branchStock?.find((b: any) => b.branch === "AZIKIWE_ROAD")?.quantity || 0;
                const asaRoadCurrent = p.branchStock?.find((b: any) => b.branch === "ASA_ROAD")?.quantity || 0;

                const azikiweVal = edits.azikiweStock !== undefined ? edits.azikiweStock : String(azikiweCurrent);
                const asaRoadVal = edits.asaRoadStock !== undefined ? edits.asaRoadStock : String(asaRoadCurrent);
                const thresholdVal = edits.lowStockThreshold !== undefined ? edits.lowStockThreshold : String(p.lowStockThreshold || 3);

                const currentSum = (parseInt(azikiweVal, 10) || 0) + (parseInt(asaRoadVal, 10) || 0);
                const hasChanges = Boolean(editedRows[p.id]);

                return (
                  <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${hasChanges ? "bg-amber-50/30" : ""}`}>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="font-normal text-slate-800 hover:text-blue-600 block line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        SKU: {p.sku} • {p.category?.name || "General"}
                      </span>
                    </td>

                    {/* Azikiwe branch */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={azikiweVal}
                        onChange={(e) => handleFieldChange(p.id, "azikiweStock", e.target.value)}
                        className="w-20 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-normal focus:border-[#FFB200]"
                      />
                    </td>

                    {/* Asa road branch */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={asaRoadVal}
                        onChange={(e) => handleFieldChange(p.id, "asaRoadStock", e.target.value)}
                        className="w-20 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-normal focus:border-[#FFB200]"
                      />
                    </td>

                    {/* Total Stock */}
                    <td className="py-3 px-4">
                      <span className={`font-normal text-sm ${currentSum === 0 ? "text-red-600 font-medium" : "text-slate-800"}`}>
                        {currentSum} units
                      </span>
                    </td>

                    {/* Low stock threshold */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="1"
                        value={thresholdVal}
                        onChange={(e) => handleFieldChange(p.id, "lowStockThreshold", e.target.value)}
                        className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-700"
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider ${
                          currentSum === 0
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : currentSum <= 4
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {currentSum === 0 ? "Out of Stock" : currentSum <= 4 ? "Low Stock" : "In Stock"}
                      </span>
                    </td>

                    {/* Quick Save */}
                    <td className="py-3 px-4 text-right">
                      {hasChanges ? (
                        <button
                          type="button"
                          disabled={savingId === p.id}
                          onClick={() => handleSaveRow(p)}
                          className="px-3 py-1 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 rounded text-xs font-normal shadow-xs transition-colors cursor-pointer"
                        >
                          {savingId === p.id ? "Saving..." : "Save"}
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[10px]">Saved</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
