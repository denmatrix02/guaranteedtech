"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

export function AddProductClient({
  brands,
  categories,
}: {
  brands: any[];
  categories: any[];
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brandId, setBrandId] = useState(brands[0]?.id || "");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [series, setSeries] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [condition, setCondition] = useState("REFURBISHED");
  const [conditionDetails, setConditionDetails] = useState("Grade A+ Certified — 100% GTC Quality Inspected");
  const [basePrice, setBasePrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [warrantyMonths, setWarrantyMonths] = useState("3");
  const [warrantyDetails, setWarrantyDetails] = useState("3 Months GTC Comprehensive Diagnostic & Hardware Warranty");

  const handleConditionChange = (newCond: string) => {
    setCondition(newCond);
    if (newCond === "BRAND_NEW") {
      setWarrantyMonths("12");
      setWarrantyDetails("1-Year Official Brand Manufacturer Warranty");
      setConditionDetails("Brand New Factory Sealed");
    } else if (newCond === "OPEN_BOX") {
      setWarrantyMonths("6");
      setWarrantyDetails("6 Months GTC Comprehensive Warranty");
      setConditionDetails("Open Box Like-New Condition");
    } else {
      setWarrantyMonths("3");
      setWarrantyDetails("3 Months GTC Comprehensive Diagnostic & Hardware Warranty");
      setConditionDetails("Grade A+ Certified — 100% GTC Quality Inspected");
    }
  };
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80");
  const [intendedUsage, setIntendedUsage] = useState(["PROGRAMMING", "BUSINESS"]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsageToggle = (tag: string) => {
    if (intendedUsage.includes(tag)) {
      setIntendedUsage(intendedUsage.filter((t) => t !== tag));
    } else {
      setIntendedUsage([...intendedUsage, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku,
          brandId,
          categoryId,
          series,
          modelNumber,
          condition,
          conditionDetails,
          basePrice,
          comparePrice: comparePrice || null,
          stockQuantity,
          warrantyMonths,
          warrantyDetails,
          shortDescription,
          fullDescription,
          imageUrl,
          intendedUsage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-light">{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Product Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lenovo ThinkPad T14 Gen 2 (Core i7, 16GB RAM, 512GB SSD)"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            SKU Code *
          </label>
          <input
            type="text"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="GT-LEN-T14G2-01"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Brand, Category, Series, Model */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Brand *</label>
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Series</label>
          <input
            type="text"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            placeholder="e.g. ThinkPad, EliteBook"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Model Number</label>
          <input
            type="text"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            placeholder="e.g. T14 Gen 2"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Pricing & Inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Selling Price (₦) *
          </label>
          <input
            type="number"
            required
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="550000"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Compare Price (₦)
          </label>
          <input
            type="number"
            value={comparePrice}
            onChange={(e) => setComparePrice(e.target.value)}
            placeholder="620000"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Stock Quantity *
          </label>
          <input
            type="number"
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            placeholder="10"
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Condition *
          </label>
          <select
            value={condition}
            onChange={(e) => handleConditionChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          >
            <option value="REFURBISHED">Refurbished Grade A+</option>
            <option value="BRAND_NEW">Brand New (Sealed)</option>
            <option value="OPEN_BOX">Open Box</option>
            <option value="USED">Pre-Owned</option>
          </select>
        </div>
      </div>

      {/* Row 4: Warranty & Image URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Warranty Period (Months)
          </label>
          <input
            type="number"
            value={warrantyMonths}
            onChange={(e) => setWarrantyMonths(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Primary Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>
      </div>

      {/* Usage Tags */}
      <div>
        <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-2">
          Intended Usage Tags (Smart Finder &amp; Sourcing Engine)
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            "PROGRAMMING",
            "BUSINESS",
            "STUDENT",
            "GRAPHIC_DESIGN",
            "GAMING",
            "WORKSTATION",
            "OFFICE",
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleUsageToggle(tag)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-colors ${
                intendedUsage.includes(tag)
                  ? "bg-[#FFB200] text-slate-950 font-medium border border-[#FFB200]"
                  : "bg-white border border-[#EBEBEB] text-slate-600 font-light hover:border-slate-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Short & Full Description */}
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Short Highlight Pitch
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Core i7, 16GB RAM, 512GB SSD, 14-inch IPS display running Windows 11 Pro."
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            Full Description &amp; Technical Notes
          </label>
          <textarea
            rows={4}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Detailed specifications, battery condition, port layout, and GTC inspection report..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-900 placeholder-slate-400 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
          ></textarea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-[#EBEBEB]">
        <Link
          href="/admin/products"
          className="text-[11px] font-light uppercase tracking-[0.14em] text-slate-500 hover:text-slate-900 transition-colors"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-medium text-[11px] uppercase tracking-[0.14em] rounded-full shadow-none transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isSubmitting ? "Saving Product..." : "Save & Publish Product"}
        </button>
      </div>
    </form>
  );
}

