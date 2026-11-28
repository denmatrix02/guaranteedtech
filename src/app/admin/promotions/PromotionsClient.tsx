"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function PromotionsClient({ initialPromotions }: { initialPromotions: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [promotions, setPromotions] = useState(initialPromotions);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("30");
  const [bannerUrl, setBannerUrl] = useState("/images/ui/promo_laptop.jpg");
  const [ctaLabel, setCtaLabel] = useState("Shop Collection");
  const [ctaUrl, setCtaUrl] = useState("/shop");
  const [countdownEnabled, setCountdownEnabled] = useState(true);
  const [endAt, setEndAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("15");
    setBannerUrl("/images/ui/promo_laptop.jpg");
    setCtaLabel("Shop Offers");
    setCtaUrl("/shop");
    setCountdownEnabled(true);
    // default 14 days ahead
    const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    setEndAt(d.toISOString().slice(0, 16));
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setDescription(p.description || "");
    setDiscountType(p.discountType || "PERCENTAGE");
    setDiscountValue(String(p.discountValue || 10));
    setBannerUrl(p.bannerUrl || "");
    setCtaLabel(p.ctaLabel || "Shop Collection");
    setCtaUrl(p.ctaUrl || "/shop");
    setCountdownEnabled(Boolean(p.countdownEnabled));
    setEndAt(p.endAt ? new Date(p.endAt).toISOString().slice(0, 16) : "");
    setIsActive(Boolean(p.isActive));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        slug,
        description,
        discountType,
        discountValue: parseFloat(discountValue) || 10,
        bannerUrl,
        ctaLabel,
        ctaUrl,
        countdownEnabled,
        endAt: new Date(endAt).toISOString(),
        isActive,
      };

      const url = editingId ? `/api/admin/promotions/${editingId}` : "/api/admin/promotions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save promotion");

      if (editingId) {
        setPromotions((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...data.promotion } : item))
        );
        showToast("success", `Promotion "${title}" updated.`);
      } else {
        setPromotions((prev) => [data.promotion, ...prev]);
        showToast("success", `Promotion "${title}" launched.`);
      }

      setIsModalOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to submit promotion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (p: any) => {
    try {
      const res = await fetch(`/api/admin/promotions/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update");

      setPromotions((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: !p.isActive } : item))
      );
      showToast("success", `Promotion ${!p.isActive ? "activated" : "deactivated"}.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to toggle status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setPromotions((prev) => prev.filter((item) => item.id !== id));
      showToast("success", `Promotion deleted.`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete promotion.");
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-normal uppercase tracking-wider text-slate-800">
            Active Storefront Campaigns ({promotions.length} Total)
          </h2>
          <p className="text-[11px] font-extralight text-slate-400 mt-0.5">
            Configure countdown discounts, middle banners, flash sales, and marketing incentives.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Create Promotion
        </button>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Campaign Title</th>
                <th className="py-3 px-4 whitespace-nowrap">Discount Value</th>
                <th className="py-3 px-4 whitespace-nowrap">End Date / Countdown</th>
                <th className="py-3 px-4 whitespace-nowrap">Action Button</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-normal text-slate-800 block">{p.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{p.slug}</span>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-emerald-600">
                    {p.discountType === "PERCENTAGE" ? `${p.discountValue}% OFF` : `₦${p.discountValue} OFF`}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 block">
                      {new Date(p.endAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-extralight text-slate-400">
                      {p.countdownEnabled ? "Active Clock" : "No Countdown"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 block font-normal">{p.ctaLabel}</span>
                    <span className="text-[10px] font-mono text-slate-400">{p.ctaUrl}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium ${
                        p.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {p.isActive ? "Live on Storefront" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-3 sm:p-4">
          <div className="bg-white rounded-lg border border-slate-200 w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[92vh] flex flex-col">
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-800">
                {editingId ? "Edit Promotion" : "Create Storefront Promotion"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  placeholder="e.g. 30% Discount on Apple Collection"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Expiration Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    placeholder="Shop Collection"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Target Link URL
                  </label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="/shop?brand=apple"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Promotional Banner Image URL
                </label>
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="/images/ui/promo_laptop.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Publish on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={countdownEnabled}
                    onChange={(e) => setCountdownEnabled(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Show Animated Countdown Timer</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal rounded-full transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Campaign" : "Launch Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
