"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, XCircle, Trash2, Edit2, Plus, Sparkles } from "lucide-react";

export function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggleApprove = async (r: any) => {
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !r.isApproved }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setReviews((prev) =>
        prev.map((item) => (item.id === r.id ? { ...item, isApproved: !r.isApproved } : item))
      );
      showToast("success", `Review ${!r.isApproved ? "approved" : "hidden"}.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to update review.");
    }
  };

  const handleToggleFeature = async (r: any) => {
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !r.isFeatured }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setReviews((prev) =>
        prev.map((item) => (item.id === r.id ? { ...item, isFeatured: !r.isFeatured } : item))
      );
      showToast("success", `Review ${!r.isFeatured ? "featured on homepage" : "unfeatured"}.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to feature review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setReviews((prev) => prev.filter((item) => item.id !== id));
      showToast("success", "Review deleted.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete review.");
    }
  };

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

      {/* Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Hardware Item</th>
                <th className="py-3 px-4">Review Comment</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 italic">
                    No customer reviews logged yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-normal text-slate-800 block">{r.reviewerName}</span>
                      <span className="text-[10px] text-slate-400">{r.reviewerLocation}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < r.rating ? "fill-current" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-normal text-slate-700 block line-clamp-1">
                        {r.product?.name || "General Feedback"}
                      </span>
                      {r.product?.sku && (
                        <span className="text-[10px] font-mono text-slate-400">{r.product.sku}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      {r.title && <span className="font-normal text-slate-800 block">{r.title}</span>}
                      <span className="text-[11px] text-slate-500 line-clamp-2">{r.comment}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleApprove(r)}
                        className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light ${
                          r.isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {r.isApproved ? "Approved" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(r)}
                        className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light ${
                          r.isFeatured
                            ? "bg-amber-50 text-amber-700 border border-amber-200 font-normal"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {r.isFeatured ? "Featured" : "No"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
