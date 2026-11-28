"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/currency";
import {
  Search,
  Filter,
  Plus,
  ExternalLink,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  MoreVertical,
  Check,
  RefreshCw,
} from "lucide-react";

interface ProductsTableClientProps {
  initialProducts: any[];
  categories: any[];
  brands: any[];
}

export function ProductsTableClient({
  initialProducts,
  categories,
  brands,
}: ProductsTableClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedCondition, setSelectedCondition] = useState("ALL");
  const [selectedStock, setSelectedStock] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt_desc");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter & sort logic
  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchModel = p.modelNumber?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchModel) return false;
    }

    if (selectedCategory !== "ALL" && p.categoryId !== selectedCategory) return false;
    if (selectedBrand !== "ALL" && p.brandId !== selectedBrand) return false;
    if (selectedCondition !== "ALL" && p.condition !== selectedCondition) return false;

    if (selectedStock !== "ALL") {
      if (selectedStock === "OUT_OF_STOCK" && p.stockQuantity > 0) return false;
      if (selectedStock === "LOW_STOCK" && (p.stockQuantity === 0 || p.stockQuantity > 4)) return false;
      if (selectedStock === "IN_STOCK" && p.stockQuantity <= 4) return false;
    }

    if (selectedStatus !== "ALL") {
      if (selectedStatus === "PUBLISHED" && !p.isPublished) return false;
      if (selectedStatus === "DRAFT" && p.isPublished) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.basePrice - b.basePrice;
    if (sortBy === "price_desc") return b.basePrice - a.basePrice;
    if (sortBy === "stock_asc") return a.stockQuantity - b.stockQuantity;
    if (sortBy === "stock_desc") return b.stockQuantity - a.stockQuantity;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const showToast = (type: "success" | "error", text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Quick toggle publication status
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: !currentStatus } : p))
      );
      showToast("success", `Product ${!currentStatus ? "published" : "moved to draft"}.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to toggle status.");
    }
  };

  // Duplicate a product
  const handleDuplicate = async (id: string) => {
    if (!confirm("Are you sure you want to duplicate this product?")) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/products/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Duplication failed");

      setProducts([data.product, ...products]);
      showToast("success", `Duplicated product created as draft: ${data.product.name}`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to duplicate product.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete single product
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast("success", `Product deleted successfully.`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete product.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk action handler
  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;

    if (action === "delete") {
      if (!confirm(`Permanently delete ${selectedIds.length} selected products?`)) return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, productIds: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Bulk action failed");

      if (action === "publish") {
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, isPublished: true } : p))
        );
      } else if (action === "unpublish") {
        setProducts((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, isPublished: false } : p))
        );
      } else if (action === "archive" || action === "delete") {
        setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      }

      showToast("success", data.message || "Bulk action completed.");
      setSelectedIds([]);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to execute bulk action.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span className="font-light">{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded border border-[#EBEBEB] space-y-3">
        {/* Top search & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.6]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name, SKU, or model..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FFB200] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
            >
              <option value="createdAt_desc">Date: Newest First</option>
              <option value="createdAt_asc">Date: Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_desc">Stock: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
          >
            <option value="ALL">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Condition */}
          <select
            value={selectedCondition}
            onChange={(e) => {
              setSelectedCondition(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
          >
            <option value="ALL">All Conditions</option>
            <option value="BRAND_NEW">Brand New</option>
            <option value="REFURBISHED">Refurbished</option>
            <option value="OPEN_BOX">Open Box</option>
          </select>

          {/* Stock */}
          <select
            value={selectedStock}
            onChange={(e) => {
              setSelectedStock(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock (&gt; 4)</option>
            <option value="LOW_STOCK">Low Stock (&le; 4)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
          >
            <option value="ALL">All Publishing</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-3 rounded flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-normal">
            <span className="w-5 h-5 rounded-full bg-[#FFB200] text-slate-950 flex items-center justify-center font-bold text-[10px]">
              {selectedIds.length}
            </span>
            <span>products selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleBulkAction("publish")}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-emerald-700 rounded font-normal transition-colors text-center"
            >
              Publish
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleBulkAction("unpublish")}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 rounded font-normal transition-colors text-center"
            >
              Unpublish
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleBulkAction("archive")}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-500 text-amber-700 rounded font-normal transition-colors text-center"
            >
              Archive
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleBulkAction("delete")}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-normal transition-colors text-center"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-3 w-8 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProducts.length > 0 &&
                      selectedIds.length === paginatedProducts.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-[#FFB200] focus:ring-[#FFB200]"
                  />
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Product Details</th>
                <th className="py-3 px-3 whitespace-nowrap">Brand &amp; Category</th>
                <th className="py-3 px-3 whitespace-nowrap">Condition</th>
                <th className="py-3 px-3 whitespace-nowrap">Selling Price (₦)</th>
                <th className="py-3 px-3 whitespace-nowrap">Stock Level</th>
                <th className="py-3 px-3 whitespace-nowrap">Visibility</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    No products match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const img =
                    p.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&q=80";
                  const isSelected = selectedIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isSelected ? "bg-amber-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(p.id)}
                          className="rounded border-slate-300 text-[#FFB200] focus:ring-[#FFB200]"
                        />
                      </td>

                      {/* Product details */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="max-w-xs">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="font-normal text-slate-800 hover:text-[#FFB200] line-clamp-1 flex items-center gap-1 transition-colors"
                            >
                              {p.name}
                              <ExternalLink className="w-3 h-3 text-slate-400 inline" />
                            </Link>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              SKU: {p.sku} {p.modelNumber ? `• ${p.modelNumber}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Category */}
                      <td className="py-3.5 px-3">
                        <span className="font-normal text-slate-800 block">
                          {p.brand?.name || "Unassigned"}
                        </span>
                        <span className="text-[11px] font-extralight text-slate-400 block">
                          {p.category?.name || "Unassigned"}
                        </span>
                      </td>

                      {/* Condition */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider ${
                            p.condition === "BRAND_NEW"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.condition === "OPEN_BOX"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {p.condition.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3">
                        <span className="font-normal text-slate-800 block">
                          {formatNaira(p.basePrice)}
                        </span>
                        {p.comparePrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatNaira(p.comparePrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-normal ${
                            p.stockQuantity === 0
                              ? "text-red-600 font-medium"
                              : p.stockQuantity <= 4
                              ? "text-amber-600 font-medium"
                              : "text-slate-700"
                          }`}
                        >
                          {p.stockQuantity === 0 ? "Out of Stock" : `${p.stockQuantity} units`}
                        </span>
                      </td>

                      {/* Visibility Toggle Button */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p.id, p.isPublished)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider transition-colors inline-flex items-center gap-1 ${
                            p.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {p.isPublished ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Published
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Draft
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5 stroke-[1.6]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5 stroke-[1.6]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.6]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-light">
          <span>
            Showing {sortedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} filtered products
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 text-slate-700 font-normal">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
