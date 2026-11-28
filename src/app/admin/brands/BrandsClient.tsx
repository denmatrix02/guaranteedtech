"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Award, ExternalLink } from "lucide-react";

export function BrandsClient({ initialBrands }: { initialBrands: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [brands, setBrands] = useState(initialBrands);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setLogoUrl("");
    setDescription("");
    setWebsiteUrl("");
    setDisplayOrder(String(brands.length + 1));
    setIsFeatured(false);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: any) => {
    setEditingId(brand.id);
    setName(brand.name);
    setSlug(brand.slug);
    setLogoUrl(brand.logoUrl || "");
    setDescription(brand.description || "");
    setWebsiteUrl(brand.websiteUrl || "");
    setDisplayOrder(String(brand.displayOrder || 0));
    setIsFeatured(Boolean(brand.isFeatured));
    setIsPublished(Boolean(brand.isPublished));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        slug,
        logoUrl,
        description,
        websiteUrl,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isFeatured,
        isPublished,
      };

      const url = editingId ? `/api/admin/brands/${editingId}` : "/api/admin/brands";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save brand");

      if (editingId) {
        setBrands((prev) =>
          prev.map((b) => (b.id === editingId ? { ...b, ...data.brand } : b))
        );
        showToast("success", `Brand "${name}" updated successfully.`);
      } else {
        setBrands((prev) => [...prev, { ...data.brand, _count: { products: 0 } }]);
        showToast("success", `Brand "${name}" added successfully.`);
      }

      setIsModalOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to submit brand.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete brand");

      setBrands((prev) => prev.filter((b) => b.id !== id));
      showToast("success", `Brand "${name}" deleted.`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete brand.");
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
            Hardware Brands &amp; Manufacturers ({brands.length} Total)
          </h2>
          <p className="text-[11px] font-extralight text-slate-400 mt-0.5">
            Manage enterprise hardware partners (Lenovo, HP, Apple, Dell, APC, TP-Link, Cisco).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Add Brand
        </button>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Brand / Manufacturer</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Official Website</th>
                <th className="py-3 px-4">Linked Products</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    #{b.displayOrder}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-normal text-slate-800 block">{b.name}</span>
                    {b.description && (
                      <span className="text-[10px] font-extralight text-slate-400 block line-clamp-1">
                        {b.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {b.slug}
                  </td>
                  <td className="py-3.5 px-4">
                    {b.websiteUrl ? (
                      <a
                        href={b.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">&mdash;</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-normal text-slate-800">
                    {b._count?.products || 0} systems
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light ${
                        b.isFeatured
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {b.isFeatured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                        title="Edit Brand"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.name)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 transition-colors"
                        title="Delete Brand"
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-800">
                {editingId ? "Edit Brand" : "Add Hardware Brand"}
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
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  placeholder="e.g. Cisco"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cisco"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/images/brands/cisco.png"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.cisco.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Worldwide leader in networking hardware and enterprise routing..."
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
                  <span>Active Brand</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Feature on Homepage Bar</span>
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
                  {isSubmitting ? "Saving..." : editingId ? "Update Brand" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
