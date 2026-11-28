"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Menu, ExternalLink } from "lucide-react";

export function MenusClient({ initialMenus }: { initialMenus: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menus, setMenus] = useState(initialMenus);
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [location, setLocation] = useState("HEADER");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("/");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isPublished, setIsPublished] = useState(true);
  const [openInNewTab, setOpenInNewTab] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setLocation(selectedLocation === "ALL" ? "HEADER" : selectedLocation);
    setLabel("");
    setUrl("/");
    setDisplayOrder(String(menus.length + 1));
    setIsPublished(true);
    setOpenInNewTab(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingId(m.id);
    setLocation(m.location || "HEADER");
    setLabel(m.label);
    setUrl(m.url);
    setDisplayOrder(String(m.displayOrder || 1));
    setIsPublished(Boolean(m.isPublished));
    setOpenInNewTab(Boolean(m.openInNewTab));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        location,
        label,
        url,
        displayOrder: parseInt(displayOrder, 10) || 1,
        isPublished,
        openInNewTab,
      };

      const reqUrl = editingId ? `/api/admin/menus/${editingId}` : "/api/admin/menus";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(reqUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save menu");

      if (editingId) {
        setMenus((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...data.menu } : item))
        );
        showToast("success", `Navigation item "${label}" updated.`);
      } else {
        setMenus((prev) => [...prev, data.menu]);
        showToast("success", `Navigation item "${label}" created.`);
      }

      setIsModalOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to submit navigation item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemLabel: string) => {
    if (!confirm(`Are you sure you want to delete navigation link "${itemLabel}"?`)) return;

    try {
      const res = await fetch(`/api/admin/menus/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete menu");

      setMenus((prev) => prev.filter((item) => item.id !== id));
      showToast("success", `Navigation link removed.`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete navigation item.");
    }
  };

  const filteredMenus = menus.filter((m) => {
    if (selectedLocation !== "ALL" && m.location !== selectedLocation) return false;
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

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
          >
            <option value="ALL">All Menu Locations ({menus.length})</option>
            <option value="HEADER">Top Header Navigation</option>
            <option value="FOOTER_QUICK_LINKS">Footer: Quick Links</option>
            <option value="FOOTER_CUSTOMER_CARE">Footer: Customer Care</option>
            <option value="MOBILE">Mobile Navigation Drawer</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Add Menu Link
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Menu Location</th>
                <th className="py-3 px-4">Display Label</th>
                <th className="py-3 px-4">Target URL</th>
                <th className="py-3 px-4">Target Tab</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {filteredMenus.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    #{m.displayOrder}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {m.location}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-slate-800">
                    {m.label}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600">
                    <Link href={m.url} target="_blank" className="hover:underline flex items-center gap-1">
                      {m.url} <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {m.openInNewTab ? "New Tab (_blank)" : "Same Window"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light ${
                        m.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {m.isPublished ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.label)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-800">
                {editingId ? "Edit Navigation Link" : "Add Navigation Link"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Menu Location *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                >
                  <option value="HEADER">Top Header Navigation</option>
                  <option value="FOOTER_QUICK_LINKS">Footer: Quick Links</option>
                  <option value="FOOTER_CUSTOMER_CARE">Footer: Customer Care</option>
                  <option value="MOBILE">Mobile Navigation Drawer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Navigation Label *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Laptops &amp; Ultrabooks"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/shop?category=laptops"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Display Sequence Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Published on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Open in New Tab</span>
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
                  {isSubmitting ? "Saving..." : editingId ? "Update Link" : "Create Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
