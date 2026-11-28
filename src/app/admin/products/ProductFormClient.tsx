"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  Sliders,
  Sparkles,
  Shield,
  Layers,
  DollarSign,
  Package,
  Globe,
  Video,
  Upload,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  X,
} from "lucide-react";

interface ProductFormClientProps {
  initialProduct?: any;
  brands: any[];
  categories: any[];
  isEdit?: boolean;
}

export function ProductFormClient({
  initialProduct,
  brands,
  categories,
  isEdit = false,
}: ProductFormClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Basic Info
  const [name, setName] = useState(initialProduct?.name || "");
  const [subtitle, setSubtitle] = useState(initialProduct?.subtitle || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [brandId, setBrandId] = useState(initialProduct?.brandId || brands[0]?.id || "");
  const [customBrandName, setCustomBrandName] = useState("");
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || categories[0]?.id || "");
  const [series, setSeries] = useState(initialProduct?.series || "");
  const [modelNumber, setModelNumber] = useState(initialProduct?.modelNumber || "");
  const [condition, setCondition] = useState(initialProduct?.condition || "REFURBISHED");
  const [conditionDetails, setConditionDetails] = useState(
    initialProduct?.conditionDetails || "Grade A+ Certified — 100% GTC Quality Inspected"
  );
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(initialProduct?.fullDescription || "");
  const [intendedUsage, setIntendedUsage] = useState<string[]>(
    initialProduct?.intendedUsage ? initialProduct.intendedUsage.split(",") : ["PROGRAMMING", "BUSINESS"]
  );

  // Pricing
  const [basePrice, setBasePrice] = useState(initialProduct?.basePrice ? String(initialProduct.basePrice) : "");
  const [comparePrice, setComparePrice] = useState(initialProduct?.comparePrice ? String(initialProduct.comparePrice) : "");
  const [costPrice, setCostPrice] = useState(initialProduct?.costPrice ? String(initialProduct.costPrice) : "");

  // Auto-calculated discount percent
  const calculatedDiscount = React.useMemo(() => {
    const regular = parseFloat(basePrice);
    const compare = parseFloat(comparePrice);
    if (compare && regular && compare > regular) {
      return Math.round(((compare - regular) / compare) * 100);
    }
    return 0;
  }, [basePrice, comparePrice]);

  // Inventory & Multi-Branch
  const [stockQuantity, setStockQuantity] = useState(initialProduct?.stockQuantity ? String(initialProduct.stockQuantity) : "5");
  const [lowStockThreshold, setLowStockThreshold] = useState(initialProduct?.lowStockThreshold ? String(initialProduct.lowStockThreshold) : "3");
  const [availabilityStatus, setAvailabilityStatus] = useState(initialProduct?.availabilityStatus || "IN_STOCK");

  // Showrooms
  const azikiweStockInitial = initialProduct?.branchStock?.find((b: any) => b.branch === "AZIKIWE_ROAD")?.quantity || 0;
  const asaRoadStockInitial = initialProduct?.branchStock?.find((b: any) => b.branch === "ASA_ROAD")?.quantity || 0;
  const [azikiweStock, setAzikiweStock] = useState(String(azikiweStockInitial));
  const [asaRoadStock, setAsaRoadStock] = useState(String(asaRoadStockInitial));

  // Media & Images
  const initialImages =
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images.map((img: any) => ({
          url: img.url,
          altText: img.altText || "",
          isPrimary: Boolean(img.isPrimary),
        }))
      : [];
  const [images, setImages] = useState<{ url: string; altText: string; isPrimary: boolean }[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(initialProduct?.videoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  // Specifications
  const initialSpecs = initialProduct?.specifications?.map((s: any) => ({
    category: s.category || "GENERAL",
    name: s.specKey || s.name || "",
    value: s.specValue || s.value || "",
  })) || [];
  const [specifications, setSpecifications] = useState<{ category: string; name: string; value: string }[]>(initialSpecs);

  // Warranty
  const [warrantyMonths, setWarrantyMonths] = useState(initialProduct?.warrantyMonths ? String(initialProduct.warrantyMonths) : "3");
  const [warrantyProvider, setWarrantyProvider] = useState(initialProduct?.warrantyProvider || "GuaranteedTech");
  const [warrantyType, setWarrantyType] = useState(
    initialProduct?.warrantyType || "Comprehensive Hardware Replacement & Repair"
  );
  const [warrantyDetails, setWarrantyDetails] = useState(
    initialProduct?.warrantyDetails || "3 Months GTC Comprehensive Diagnostic & Hardware Warranty"
  );
  const [warrantyTerms, setWarrantyTerms] = useState(
    initialProduct?.warrantyTerms || "Covers internal motherboard, memory, storage controller, and hardware diagnostic defects."
  );

  // Merchandising Toggles
  const [isPublished, setIsPublished] = useState(initialProduct?.isPublished !== undefined ? initialProduct.isPublished : true);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller || false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival || false);
  const [onSale, setOnSale] = useState(initialProduct?.onSale || false);
  const [bestReviewed, setBestReviewed] = useState(initialProduct?.bestReviewed || false);
  const [enableAddToCart, setEnableAddToCart] = useState(initialProduct?.enableAddToCart !== undefined ? initialProduct.enableAddToCart : true);
  const [enableBuyNow, setEnableBuyNow] = useState(initialProduct?.enableBuyNow !== undefined ? initialProduct.enableBuyNow : true);
  const [enableEnquiries, setEnableEnquiries] = useState(initialProduct?.enableEnquiries !== undefined ? initialProduct.enableEnquiries : true);

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || "");
  const [focusKeywords, setFocusKeywords] = useState(initialProduct?.focusKeywords || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialProduct?.canonicalUrl || "");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Condition preset handler
  const handleConditionChange = (newCond: string) => {
    setCondition(newCond);
    if (newCond === "BRAND_NEW") {
      setWarrantyMonths("12");
      setWarrantyProvider("Official Brand Manufacturer");
      setWarrantyType("1-Year Manufacturer Authorized Service Center");
      setWarrantyDetails("1-Year Official Manufacturer Warranty");
      setConditionDetails("Brand New Factory Sealed");
    } else if (newCond === "OPEN_BOX") {
      setWarrantyMonths("6");
      setWarrantyProvider("GuaranteedTech");
      setWarrantyType("6-Month GTC Certified Replacement & Repair");
      setWarrantyDetails("6 Months GTC Comprehensive Warranty with direct replacement coverage");
      setConditionDetails("Open Box Like-New Condition with complete original accessories");
    } else {
      setWarrantyMonths("3");
      setWarrantyProvider("GuaranteedTech");
      setWarrantyType("Comprehensive Hardware Replacement & Repair");
      setWarrantyDetails("3 Months GTC Comprehensive Diagnostic & Hardware Warranty");
      setConditionDetails("Grade A+ Certified — 100% GTC Quality Inspected");
    }
  };

  // Auto-fill preset specifications by hardware department
  const loadSpecPreset = (type: string) => {
    if (type === "LAPTOP") {
      setSpecifications([
        { category: "PROCESSOR", name: "Processor", value: "Intel Core i7-1365U vPro (10-Core, up to 5.20GHz)" },
        { category: "MEMORY", name: "RAM", value: "16GB LPDDR5 6400MHz Dual-Channel" },
        { category: "STORAGE", name: "Storage", value: "512GB PCIe Gen4 NVMe M.2 SSD" },
        { category: "DISPLAY", name: "Display", value: "14.0-inch WUXGA (1920x1200) IPS Anti-Glare 400 nits" },
        { category: "GRAPHICS", name: "Graphics", value: "Intel Iris Xe Graphics" },
        { category: "BATTERY", name: "Battery", value: "57Wh with 65W Rapid Charge (80% in 60 mins)" },
        { category: "PORTS", name: "Ports", value: "2x Thunderbolt 4 / USB4, 2x USB 3.2 Gen 1, 1x HDMI 2.1" },
        { category: "OPERATING_SYSTEM", name: "OS", value: "Windows 11 Pro 64-bit Genuine" },
      ]);
    } else if (type === "DESKTOP") {
      setSpecifications([
        { category: "PROCESSOR", name: "Processor", value: "Intel Core i7-13700 (16-Core, up to 5.2GHz)" },
        { category: "MEMORY", name: "RAM", value: "32GB DDR5 4800MHz" },
        { category: "STORAGE", name: "Storage", value: "1TB PCIe NVMe SSD + 2TB SATA HDD" },
        { category: "GRAPHICS", name: "Graphics", value: "NVIDIA RTX 3060 12GB GDDR6" },
        { category: "POWER", name: "Power Supply", value: "500W 92% Efficient 80 Plus Platinum" },
        { category: "FORM_FACTOR", name: "Form Factor", value: "Tower Workstation" },
      ]);
    } else if (type === "PRINTER") {
      setSpecifications([
        { category: "PRINTING", name: "Print Speed", value: "Up to 38 pages per minute (ppm) Black" },
        { category: "TECHNOLOGY", name: "Printing Tech", value: "Monochrome Laser / PrecisionCore" },
        { category: "DUPLEX", name: "Duplex Printing", value: "Automatic Two-Sided Printing" },
        { category: "CONNECTIVITY", name: "Connectivity", value: "High-Speed USB 2.0, Gigabit Ethernet, Wi-Fi 802.11b/g/n" },
        { category: "PAPER", name: "Paper Sizes", value: "A4, Letter, Legal, Executive, Envelopes" },
      ]);
    } else if (type === "UPS") {
      setSpecifications([
        { category: "CAPACITY", name: "Output Capacity", value: "1500VA / 900 Watts" },
        { category: "VOLTAGE", name: "Nominal Output", value: "230V Pure Sine Wave" },
        { category: "BATTERY", name: "Battery Type", value: "Maintenance-free sealed Lead-Acid with suspended electrolyte" },
        { category: "BACKUP", name: "Typical Backup", value: "45-60 minutes on business workstation load" },
      ]);
    } else if (type === "NETWORK") {
      setSpecifications([
        { category: "DEVICE_TYPE", name: "Device Type", value: "Dual-Band Wi-Fi 6 Enterprise Access Point" },
        { category: "SPEED", name: "Throughput", value: "Up to 3.0 Gbps (2402 Mbps on 5GHz + 574 Mbps on 2.4GHz)" },
        { category: "PORTS", name: "Ethernet Ports", value: "1x 2.5 Gigabit PoE+ Port" },
        { category: "COVERAGE", name: "Coverage", value: "Up to 160 sq. meters with 100+ concurrent clients" },
      ]);
    }
  };

  const handleAddSpecRow = () => {
    setSpecifications([...specifications, { category: "GENERAL", name: "", value: "" }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: "category" | "name" | "value", val: string) => {
    setSpecifications((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    setUploadFeedback(null);

    try {
      const formData = new FormData();
      const filesArray = Array.from(files);
      for (const file of filesArray) {
        formData.append("files", file);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload images");
      }

      const newUrls: string[] = data.urls || [];
      const newEntries = newUrls.map((url, i) => ({
        url,
        altText: name ? `${name} - Image ${images.length + i + 1}` : "Product photograph",
        isPrimary: images.length === 0 && i === 0,
      }));

      setImages((prev) => {
        const hasPrimary = prev.some((img) => img.isPrimary);
        const updated = [...prev, ...newEntries];
        if (!hasPrimary && updated.length > 0) {
          updated[0].isPrimary = true;
        }
        return updated;
      });

      setUploadFeedback(`Successfully uploaded ${newUrls.length} image(s)!`);
      setTimeout(() => setUploadFeedback(null), 4000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadFeedback(`Upload error: ${err.message || "Failed to upload images"}`);
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) {
      // If URL field is empty, clicking "Add Image" triggers the file selector so the admin can pick multiple files directly from their device!
      fileInputRef.current?.click();
      return;
    }

    // Support single or multiple URLs separated by newline or comma
    const rawUrls = trimmed.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
    if (rawUrls.length === 0) {
      fileInputRef.current?.click();
      return;
    }

    const newEntries = rawUrls.map((url, idx) => ({
      url,
      altText: name ? `${name} - Image ${images.length + idx + 1}` : "Product image",
      isPrimary: images.length === 0 && idx === 0,
    }));

    setImages((prev) => {
      const hasPrimary = prev.some((img) => img.isPrimary);
      const combined = [...prev, ...newEntries];
      if (!hasPrimary && combined.length > 0) {
        combined[0].isPrimary = true;
      }
      return combined;
    });

    setNewImageUrl("");
    setUploadFeedback(`Added ${newEntries.length} image URL(s) to gallery.`);
    setTimeout(() => setUploadFeedback(null), 3000);
  };

  const handleSetPrimaryImage = (idx: number) => {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === idx })));
    setPreviewImageIndex(idx);
  };

  const handleRemoveImage = (idx: number) => {
    const wasPrimary = images[idx]?.isPrimary;
    const remaining = images.filter((_, i) => i !== idx);
    if (wasPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }
    setImages(remaining);
    if (previewImageIndex >= remaining.length) {
      setPreviewImageIndex(Math.max(0, remaining.length - 1));
    }
  };

  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setImages(reordered);
    if (previewImageIndex === fromIdx) {
      setPreviewImageIndex(toIdx);
    } else if (previewImageIndex === toIdx) {
      setPreviewImageIndex(fromIdx);
    }
  };

  const handleAltTextChange = (idx: number, altText: string) => {
    setImages(images.map((img, i) => (i === idx ? { ...img, altText } : img)));
  };

  const handleUsageToggle = (tag: string) => {
    if (intendedUsage.includes(tag)) {
      setIntendedUsage(intendedUsage.filter((t) => t !== tag));
    } else {
      setIntendedUsage([...intendedUsage, tag]);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const hasBrand = isCustomBrand ? Boolean(customBrandName.trim()) : Boolean(brandId);
      if (!name || !sku || !hasBrand || !categoryId || !basePrice) {
        throw new Error("Please complete the required basic details, Brand (select or custom), and selling price.");
      }

      const totalBranch = (parseInt(azikiweStock, 10) || 0) + (parseInt(asaRoadStock, 10) || 0);
      const finalStock = totalBranch > 0 ? totalBranch : (parseInt(stockQuantity, 10) || 0);

      const payload = {
        name,
        subtitle,
        slug: slug || undefined,
        sku,
        brandId: isCustomBrand ? "CUSTOM" : brandId,
        customBrandName: isCustomBrand ? customBrandName.trim() : undefined,
        categoryId,
        series,
        modelNumber,
        condition,
        conditionDetails,
        basePrice: parseFloat(basePrice),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        discountPercent: calculatedDiscount,
        stockQuantity: finalStock,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 3,
        availabilityStatus: finalStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
        warrantyMonths: parseInt(warrantyMonths, 10) || 3,
        warrantyProvider,
        warrantyType,
        warrantyDetails,
        warrantyTerms,
        shortDescription,
        fullDescription,
        intendedUsage,
        videoUrl,
        isPublished,
        isFeatured,
        isBestSeller,
        isNewArrival,
        onSale: onSale || calculatedDiscount > 0,
        bestReviewed,
        enableAddToCart,
        enableBuyNow,
        enableEnquiries,
        seoTitle: seoTitle || `${name} | GuaranteedTech Nigeria`,
        seoDescription: seoDescription || shortDescription,
        focusKeywords,
        canonicalUrl,
        images: images.filter((img) => img.url.trim().length > 0),
        specifications: specifications.filter((s) => s.name.trim().length > 0),
        branchStock: [
          { branch: "AZIKIWE_ROAD", quantity: parseInt(azikiweStock, 10) || 0, lowStockThreshold: 2 },
          { branch: "ASA_ROAD", quantity: parseInt(asaRoadStock, 10) || 0, lowStockThreshold: 2 },
        ],
      };

      const url = isEdit ? `/api/admin/products/${initialProduct.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "1. Basic Info", icon: <Package className="w-3.5 h-3.5" /> },
    { id: "pricing", label: "2. Pricing", icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: "stock", label: "3. Showrooms & Stock", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "media", label: `4. Images & Media${images.length > 0 ? ` (${images.length})` : ""}`, icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: "specs", label: "5. Tech Specs Builder", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "warranty", label: "6. Warranty & Condition", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "merchandising", label: "7. Merchandising", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "seo", label: "8. SEO & Social", icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded border border-[#EBEBEB]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-sm font-normal text-slate-800 uppercase tracking-wide">
              {isEdit ? `Edit: ${initialProduct?.name}` : "Create New Product"}
            </h2>
            <span className="text-[11px] font-extralight text-slate-400">
              {isEdit ? `SKU: ${initialProduct?.sku}` : "Add certified computing system to catalog"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full text-xs font-light tracking-wider uppercase transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving System..." : isEdit ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-light">{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs (Smooth Touch Horizontal Scrolling on Mobile) */}
      <div
        className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 pt-2 rounded-t scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs uppercase tracking-wider font-light whitespace-nowrap border-b-2 transition-colors cursor-pointer flex-shrink-0 ${
              activeTab === tab.id
                ? "border-[#FFB200] text-slate-900 font-normal bg-amber-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <span className={activeTab === tab.id ? "text-[#FFB200]" : "text-slate-400"}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Basic Information */}
      {activeTab === "basic" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Product Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                  }
                }}
                placeholder="e.g. Lenovo ThinkPad T14 Gen 4 Intel Core i7 16GB 512GB SSD"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                SKU / Hardware Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. LNV-T14-G4-01"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Product Subtitle (Optional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. High-Performance Executive Ultrabook with Rapid Charging"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Custom URL Slug (Auto-generated)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="lenovo-thinkpad-t14-gen-4"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
            {/* 1. Brand Selection with Custom / Others Input Option */}
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5 flex items-center justify-between">
                <span>Brand *</span>
                <span className="text-[9px] font-normal text-amber-600 lowercase tracking-normal">
                  {isCustomBrand ? "custom mode" : "standard list"}
                </span>
              </label>
              <select
                value={isCustomBrand ? "CUSTOM" : brandId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "CUSTOM") {
                    setIsCustomBrand(true);
                    setBrandId("CUSTOM");
                  } else {
                    setIsCustomBrand(false);
                    setBrandId(val);
                    setCustomBrandName("");
                  }
                }}
                className={`w-full px-3.5 py-2.5 border rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200] transition-colors ${
                  isCustomBrand
                    ? "bg-amber-50 border-amber-300 font-medium text-amber-900"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <optgroup label="Catalog Brands (Select One)">
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Custom / Other Brand">
                  <option value="CUSTOM">
                    ✨ + Other / Custom Brand (Write Custom Name)...
                  </option>
                </optgroup>
              </select>

              {/* Custom Brand Name Input & Quick Hardware Chips */}
              {isCustomBrand && (
                <div className="mt-2 p-2.5 bg-amber-50/90 border border-amber-300 rounded space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <label className="block text-[9px] font-semibold uppercase tracking-wider text-amber-900">
                      Write Brand Name *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomBrand(false);
                        setBrandId(brands[0]?.id || "");
                        setCustomBrandName("");
                      }}
                      className="text-[9px] text-slate-500 hover:text-slate-800 underline"
                    >
                      Use preset list
                    </button>
                  </div>
                  <input
                    type="text"
                    required={isCustomBrand}
                    value={customBrandName}
                    onChange={(e) => setCustomBrandName(e.target.value)}
                    placeholder="e.g. Starlink, Cisco, MikroTik, Ubiquiti, Epson..."
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    autoFocus
                  />
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-amber-800 font-medium">Quick:</span>
                    {["Starlink", "Cisco", "MikroTik", "Ubiquiti", "TP-Link", "D-Link", "Epson", "Mercury", "Schneider", "Anker", "APC"].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setCustomBrandName(quick)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-light bg-white border border-amber-200 text-slate-700 hover:bg-amber-100 transition-colors"
                      >
                        {quick}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Category / Department */}
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Department / Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Sub-Category / Hardware Series (e.g. Starlink Standard Kit, ThinkPad T-Series) */}
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Sub-Category / Series
              </label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="e.g. Starlink Kit, ThinkPad, EliteBook"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            {/* 4. Hardware Condition */}
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Hardware Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => handleConditionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              >
                <option value="REFURBISHED">Refurbished (GTC Certified)</option>
                <option value="OPEN_BOX">Open Box (Like New)</option>
                <option value="BRAND_NEW">Brand New (Factory Sealed)</option>
              </select>
            </div>

            {/* 5. Model Number */}
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Model Number
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. UTA-231, 21HD001QUS"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Short Summary Description (For Cards &amp; SEO)
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Enterprise 14-inch business workstation with 13th Gen Intel Core i7, 16GB RAM, and 512GB SSD."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Full Product Description &amp; Engineering Overview
            </label>
            <textarea
              rows={5}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Enter comprehensive hardware details, diagnostic inspection results, thermal characteristics, and target workflows..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>

          {/* Intended Usage Tags */}
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-2">
              Recommended Workflows &amp; Target Applications
            </label>
            <div className="flex flex-wrap gap-2">
              {["PROGRAMMING", "BUSINESS", "STUDENT", "GRAPHIC_DESIGN", "DATA_SCIENCE", "OFFICE_ADMIN", "CAD_3D"].map((tag) => {
                const active = intendedUsage.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleUsageToggle(tag)}
                    className={`px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-light transition-all cursor-pointer ${
                      active
                        ? "bg-[#FFB200] text-slate-950 font-normal shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tag.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pricing & Economics */}
      {activeTab === "pricing" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Current Selling Price (₦ NGN) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-normal">₦</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="550000"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-normal text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>
              <span className="text-[10px] font-extralight text-slate-400 mt-1 block">
                The actual price charged to customers at checkout.
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Previous / Strikethrough Price (₦ NGN)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-normal">₦</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="650000"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>
              <span className="text-[10px] font-extralight text-slate-400 mt-1 block">
                Will be crossed out to show buyer savings.
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Unit Cost Price (Admin Only) (₦ NGN)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-normal">₦</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="450000"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>
              <span className="text-[10px] font-extralight text-slate-400 mt-1 block">
                Private internal cost for profit calculations.
              </span>
            </div>
          </div>

          {/* Computed Economics Card */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-light block">Calculated Discount:</span>
              <span className="text-lg font-normal text-emerald-600">
                {calculatedDiscount > 0 ? `${calculatedDiscount}% OFF` : "No discount badge"}
              </span>
            </div>

            {costPrice && basePrice && (
              <div>
                <span className="text-slate-500 font-light block">Gross Profit Margin:</span>
                <span className="text-lg font-normal text-slate-800">
                  ₦{(parseFloat(basePrice) - parseFloat(costPrice)).toLocaleString()} (
                  {Math.round(((parseFloat(basePrice) - parseFloat(costPrice)) / parseFloat(basePrice)) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Showrooms & Stock */}
      {activeTab === "stock" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Global Stock Status
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="PRE_ORDER">Pre-Order</option>
                <option value="SOURCING_AVAILABLE">Sourcing Available</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Total Available Units
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Low Stock Warning Threshold
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>

          {/* Showroom Branch Stock Allocation */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-800 mb-1">
              Physical Showroom Stock Allocation
            </h3>
            <p className="text-[11px] font-extralight text-slate-400 mb-4">
              Allocate real physical units present in each Aba commercial showroom.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="text-xs font-normal text-slate-800 block">
                  111/113 Azikiwe Road (Flagship Showroom)
                </span>
                <label className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Allocated Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={azikiweStock}
                  onChange={(e) => setAzikiweStock(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="text-xs font-normal text-slate-800 block">
                  No. 2 Asa Road, Beside Aba Town Hall (Hub)
                </span>
                <label className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Allocated Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={asaRoadStock}
                  onChange={(e) => setAsaRoadStock(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Images & Media */}
      {activeTab === "media" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          {/* Hidden multiple file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files);
              }
            }}
          />

          {/* Feedback banner */}
          {uploadFeedback && (
            <div
              className={`p-3.5 rounded text-xs flex items-center justify-between transition-all ${
                uploadFeedback.includes("error") || uploadFeedback.includes("failed")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {uploadFeedback.includes("error") || uploadFeedback.includes("failed") ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                ) : (
                  <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                )}
                <span className="font-light">{uploadFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadFeedback(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files);
              }
            }}
            className={`relative p-6 sm:p-8 rounded-lg border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 ${
              isDragOver
                ? "border-[#FFB200] bg-amber-50/70 ring-2 ring-amber-200"
                : "border-slate-300 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-400"
            }`}
          >
            {isUploadingImages ? (
              <div className="flex flex-col items-center gap-2.5 py-4">
                <Loader2 className="w-8 h-8 text-[#FFB200] animate-spin" />
                <span className="text-xs font-medium text-slate-800">
                  Uploading and optimizing product images...
                </span>
                <span className="text-[11px] font-light text-slate-500">
                  Preserving original resolution, aspect ratio, and photo quality.
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-2xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="max-w-md">
                  <p className="text-xs font-medium text-slate-800">
                    Drag &amp; drop multiple product photos here, or click to browse
                  </p>
                  <p className="text-[11px] font-light text-slate-500 mt-1">
                    Select 1, 2, 5 or more photos at once from your PC or mobile device. JPG, PNG, WebP, and AVIF supported.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Browse / Upload Multiple Images
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Web URL input with smart click fallback */}
          <div className="space-y-2 pt-1">
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Or Add Image via Web URL(s)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                placeholder="Paste URL or multiple URLs separated by commas/newlines (leave empty to browse files)"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs uppercase tracking-wider font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Image
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-light">
              Tip: Clicking &quot;Add Image&quot; with an empty input will immediately open your file browser to pick multiple photos from your device.
            </p>
          </div>

          {/* Live Storefront Gallery Preview & Ordering (Matching storefront screenshot) */}
          {images.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-800 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#FFB200]" />
                    Live Storefront Gallery Preview &amp; Ordering
                  </span>
                  <p className="text-[11px] text-slate-500 font-light">
                    This is how your product image appears on the public website. Click any thumbnail to preview or set as Primary Cover.
                  </p>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono">
                  {images.length} {images.length === 1 ? "Image" : "Images"}
                </span>
              </div>

              {/* Big Main Image Preview matching storefront layout */}
              {(() => {
                const activeImg = images[previewImageIndex] || images.find((i) => i.isPrimary) || images[0];
                return (
                  <div className="space-y-3">
                    <div className="relative w-full h-72 sm:h-96 bg-white rounded border border-slate-200 overflow-hidden flex items-center justify-center p-6 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeImg.url}
                        alt={activeImg.altText || name || "Product preview"}
                        className="w-full h-full object-contain p-2 transition-all duration-200"
                      />

                      {/* Storefront Badges matching live site screenshot */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                        <span
                          className={`text-[10px] font-light uppercase tracking-wider px-2.5 py-1 rounded shadow-xs ${
                            condition === "BRAND_NEW"
                              ? "bg-emerald-600 text-white"
                              : condition === "OPEN_BOX"
                              ? "bg-blue-700 text-white"
                              : "bg-slate-900 text-amber-300"
                          }`}
                        >
                          {condition === "BRAND_NEW"
                            ? "Brand New (Factory Sealed)"
                            : condition === "OPEN_BOX"
                            ? "Open Box (Like New)"
                            : "Refurbished (Certified Grade A+)"}
                        </span>
                        {calculatedDiscount > 0 && (
                          <span className="bg-red-500 text-white font-light text-[10px] px-2 py-0.5 rounded shadow-xs w-max">
                            -{calculatedDiscount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Cover Badge / Set Cover Button */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                        {activeImg.isPrimary ? (
                          <span className="bg-[#FFB200] text-slate-950 text-[10px] font-medium px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Primary Storefront Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const targetIdx = images.findIndex((img) => img.url === activeImg.url);
                              if (targetIdx !== -1) handleSetPrimaryImage(targetIdx);
                            }}
                            className="bg-slate-900/85 hover:bg-slate-900 text-white text-[10px] font-medium px-2.5 py-1 rounded shadow-xs transition-colors cursor-pointer"
                          >
                            Set as Primary Cover
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Thumbnails Row below the main image (Mirroring storefront thumbnail slider) */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block">
                        Thumbnails Row (Yellow border = active view. Click thumbnail to inspect):
                      </span>
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1">
                        {images.map((img, idx) => {
                          const isActive = activeImg.url === img.url;
                          return (
                            <div
                              key={idx}
                              className="relative flex-shrink-0 flex flex-col items-center gap-1"
                            >
                              <button
                                type="button"
                                onClick={() => setPreviewImageIndex(idx)}
                                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded border bg-white overflow-hidden p-1 transition-all cursor-pointer ${
                                  isActive
                                    ? "border-[#FFB200] ring-2 ring-[#FFB200] shadow-sm"
                                    : "border-slate-200 hover:border-slate-400"
                                }`}
                                title={`View image #${idx + 1}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt={img.altText || `Thumbnail ${idx + 1}`}
                                  className="w-full h-full object-contain"
                                />
                                {img.isPrimary && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-[#FFB200] text-slate-950 text-[7px] font-bold px-1 py-0.2 rounded">
                                    COVER
                                  </span>
                                )}
                              </button>

                              {/* Action controls on thumbnail */}
                              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveImage(idx, idx - 1)}
                                  className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-20 transition-colors"
                                  title="Move Left"
                                >
                                  <ChevronLeft className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className={`p-1 transition-colors ${
                                    img.isPrimary
                                      ? "text-amber-500"
                                      : "text-slate-400 hover:text-amber-500"
                                  }`}
                                  title={img.isPrimary ? "Primary Cover" : "Make Primary Cover"}
                                >
                                  <Star className={`w-2.5 h-2.5 ${img.isPrimary ? "fill-current" : ""}`} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === images.length - 1}
                                  onClick={() => handleMoveImage(idx, idx + 1)}
                                  className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-20 transition-colors"
                                  title="Move Right"
                                >
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add More Thumbnail Tile */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded border-2 border-dashed border-slate-300 hover:border-[#FFB200] hover:bg-amber-50/40 text-slate-400 hover:text-amber-700 flex flex-col items-center justify-center gap-1 text-[9px] font-medium uppercase tracking-wider flex-shrink-0 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-amber-500" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* SEO & Image Alt Text Details */}
                    <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2 mt-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600 block">
                        Image Alt Descriptions (SEO &amp; Search Engine Indexing)
                      </span>
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-white p-1.5 rounded border border-slate-200"
                          >
                            <span className="text-[10px] font-mono font-semibold text-slate-500 w-5 text-center">
                              #{idx + 1}
                            </span>
                            <div className="w-7 h-7 rounded bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.url} alt="" className="w-full h-full object-contain" />
                            </div>
                            <input
                              type="text"
                              value={img.altText}
                              onChange={(e) => handleAltTextChange(idx, e.target.value)}
                              placeholder="Describe image for Google search & accessibility..."
                              className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-800 focus:outline-none focus:border-[#FFB200]"
                            />
                            {img.isPrimary && (
                              <span className="text-[8px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.5 rounded whitespace-nowrap">
                                Primary Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="p-8 rounded border border-dashed border-slate-200 text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-normal text-slate-700">No images configured yet for this product</p>
              <p className="text-[11px] text-slate-400 font-light max-w-sm mx-auto">
                Use the multi-file upload button above to choose photographs from your device, or paste image URLs.
              </p>
            </div>
          )}

          {/* Product Video URL */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#FFB200]" /> Product Demonstration Video (YouTube / Vimeo / MP4)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>
        </div>
      )}

      {/* Tab 5: Specifications Builder */}
      {activeTab === "specs" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mr-2">
              Load Category Template:
            </span>
            <button
              type="button"
              onClick={() => loadSpecPreset("LAPTOP")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-light"
            >
              Laptop Template
            </button>
            <button
              type="button"
              onClick={() => loadSpecPreset("DESKTOP")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-light"
            >
              Desktop / Tower Template
            </button>
            <button
              type="button"
              onClick={() => loadSpecPreset("PRINTER")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-light"
            >
              Printer Template
            </button>
            <button
              type="button"
              onClick={() => loadSpecPreset("UPS")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-light"
            >
              UPS Power Template
            </button>
            <button
              type="button"
              onClick={() => loadSpecPreset("NETWORK")}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-light"
            >
              Networking Template
            </button>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                Technical Specifications ({specifications.length} fields)
              </span>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="px-3 py-1.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs rounded-full flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Spec Field
              </button>
            </div>

            <div className="space-y-2.5">
              {specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 sm:p-0 bg-slate-50/70 sm:bg-transparent rounded sm:rounded-none border sm:border-0 border-slate-200"
                >
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={spec.category}
                      onChange={(e) => handleSpecChange(idx, "category", e.target.value)}
                      placeholder="Group (e.g. DISPLAY)"
                      className="w-full sm:w-32 px-3 py-1.5 bg-white sm:bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 uppercase"
                    />
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) => handleSpecChange(idx, "name", e.target.value)}
                      placeholder="Spec Name (e.g. RAM)"
                      className="w-full sm:w-48 px-3 py-1.5 bg-white sm:bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1 w-full">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                      placeholder="Value (e.g. 16GB DDR5 4800MHz)"
                      className="flex-1 w-full px-3 py-1.5 bg-white sm:bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors flex-shrink-0"
                      title="Remove spec row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Warranty & Condition */}
      {activeTab === "warranty" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Warranty Provider
              </label>
              <input
                type="text"
                value={warrantyProvider}
                onChange={(e) => setWarrantyProvider(e.target.value)}
                placeholder="GuaranteedTech / Apple / HP"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Warranty Duration (Months)
              </label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Warranty Type
              </label>
              <input
                type="text"
                value={warrantyType}
                onChange={(e) => setWarrantyType(e.target.value)}
                placeholder="Comprehensive Hardware Replacement & Repair"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Warranty Details Badge
            </label>
            <input
              type="text"
              value={warrantyDetails}
              onChange={(e) => setWarrantyDetails(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Specific Warranty Terms &amp; Exclusions
            </label>
            <textarea
              rows={3}
              value={warrantyTerms}
              onChange={(e) => setWarrantyTerms(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>
        </div>
      )}

      {/* Tab 7: Merchandising */}
      {activeTab === "merchandising" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">Published on Storefront</span>
                <span className="text-[10px] font-extralight text-slate-400">Visible to online buyers</span>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>

            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">Featured on Homepage</span>
                <span className="text-[10px] font-extralight text-slate-400">Hero &amp; curated showcase</span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>

            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">Best Seller Carousel</span>
                <span className="text-[10px] font-extralight text-slate-400">High velocity systems</span>
              </div>
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>

            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">Latest Arrival</span>
                <span className="text-[10px] font-extralight text-slate-400">Newly unboxed hardware badge</span>
              </div>
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>

            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">On Sale Badge</span>
                <span className="text-[10px] font-extralight text-slate-400">Highlights promotional price</span>
              </div>
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>

            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">Enable Add to Cart</span>
                <span className="text-[10px] font-extralight text-slate-400">Allows instant cart additions</span>
              </div>
              <input
                type="checkbox"
                checked={enableAddToCart}
                onChange={(e) => setEnableAddToCart(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>

            <label className="p-4 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="text-xs font-normal text-slate-800 block">Enable WhatsApp Inquiry</span>
                <span className="text-[10px] font-extralight text-slate-400">Shows live chat button</span>
              </div>
              <input
                type="checkbox"
                checked={enableEnquiries}
                onChange={(e) => setEnableEnquiries(e.target.checked)}
                className="w-4 h-4 text-[#FFB200] rounded focus:ring-[#FFB200]"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 8: SEO & Social */}
      {activeTab === "seo" && (
        <div className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Meta SEO Title (Max 60 characters)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Buy Lenovo ThinkPad T14 Gen 4 in Nigeria | GuaranteedTech"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Meta SEO Description (Max 160 characters)
            </label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="e.g. Certified Lenovo ThinkPad T14 Gen 4 with Intel Core i7, 16GB RAM, 512GB SSD. 100% GTC tested with official warranty and free delivery."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Focus Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="laptops in aba, business laptops nigeria, thinkpad t14"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Canonical URL
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder={`https://www.guaranteedtech.org/products/${slug || "item"}`}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
