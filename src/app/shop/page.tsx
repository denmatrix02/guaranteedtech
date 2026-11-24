import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getFilteredProducts } from "@/lib/search";
import { normalizeCategorySlug, getCategoryMetadata } from "@/lib/categories";
import { ProductCard } from "@/components/ui/ProductCard";
import { formatNaira } from "@/lib/currency";
import { Filter, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string | string[];
    condition?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    usage?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  // Normalize multi-select filter arrays
  const brandList = Array.isArray(params.brand)
    ? params.brand
    : params.brand
    ? [params.brand]
    : undefined;

  const conditionList = Array.isArray(params.condition)
    ? params.condition
    : params.condition
    ? [params.condition]
    : undefined;

  const usageList = Array.isArray(params.usage)
    ? params.usage
    : params.usage
    ? [params.usage]
    : undefined;

  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sort = (params.sort as any) || "featured";

  const canonicalCategory = normalizeCategorySlug(params.category);
  const categoryMeta = canonicalCategory ? getCategoryMetadata(canonicalCategory) : null;
  const pageTitle = categoryMeta ? categoryMeta.name : "Computing Catalog";

  // Execute database query using our filtered products helper
  const [products, allCategories, allBrands] = await Promise.all([
    getFilteredProducts({
      category: canonicalCategory || params.category,
      brand: brandList,
      condition: conditionList as any,
      minPrice,
      maxPrice,
      sort,
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: { subcategories: true },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const hasActiveFilters =
    Boolean(params.category) ||
    Boolean(brandList?.length) ||
    Boolean(conditionList?.length) ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  return (
    <div className="bg-white min-h-screen py-8 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs font-light text-slate-400 mb-2">
            <Link href="/" prefetch={true} className="hover:text-slate-800 transition-colors">Home</Link>
            <span>/</span>
            {categoryMeta ? (
              <>
                <Link href="/shop" prefetch={true} className="hover:text-slate-800 transition-colors">Shop</Link>
                <span>/</span>
                <span className="text-slate-800 font-normal">{categoryMeta.name}</span>
              </>
            ) : (
              <span className="text-slate-800 font-normal">Shop All Products</span>
            )}
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
                {pageTitle}
              </h1>
              <p className="text-xs font-extralight text-slate-400 mt-1">
                Showing {products.length} {products.length === 1 ? "system" : "systems"} available in stock
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3">
              <form method="GET" action="/shop" className="flex items-center gap-2">
                {/* Preserve existing filters in hidden fields */}
                {params.category && <input type="hidden" name="category" value={params.category} />}
                {brandList?.map((b) => (
                  <input key={b} type="hidden" name="brand" value={b} />
                ))}
                {conditionList?.map((c) => (
                  <input key={c} type="hidden" name="condition" value={c} />
                ))}

                <label htmlFor="sort" className="text-xs font-light text-slate-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 stroke-[1.5]" /> Sort:
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="bg-white border border-[#EBEBEB] rounded px-3 py-1.5 text-xs font-light text-slate-700 focus:outline-none focus:border-amber-400"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High (₦)</option>
                  <option value="price_desc">Price: High to Low (₦)</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Best Sellers</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#FFB200] hover:bg-[#FFA500] text-white rounded text-xs font-light uppercase tracking-wider transition-colors shadow-xs"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded border border-[#EBEBEB]">
            <span className="text-xs font-light text-slate-700">Active Filters:</span>
            {params.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 text-xs font-light border border-amber-200">
                Category: {categoryMeta?.name || params.category}
              </span>
            )}
            {brandList?.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-50 text-slate-700 text-xs font-light border border-slate-200">
                Brand: {b.toUpperCase()}
              </span>
            ))}
            {conditionList?.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-50 text-slate-700 text-xs font-light border border-slate-200">
                Condition: {c}
              </span>
            ))}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-50 text-slate-700 text-xs font-light border border-slate-200">
                Price: {formatNaira(minPrice || 0)} – {maxPrice ? formatNaira(maxPrice) : "Any"}
              </span>
            )}
            <Link
              href="/shop"
              className="text-xs font-light text-red-500 hover:underline ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </Link>
          </div>
        )}

        {/* Main Catalog Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-3 bg-white p-5 rounded border border-[#EBEBEB] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-light text-xs uppercase tracking-[0.16em] text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFB200] stroke-[1.5]" /> Filters
              </h3>
              {hasActiveFilters && (
                <Link href="/shop" className="text-[11px] font-light text-amber-600 hover:underline">
                  Reset
                </Link>
              )}
            </div>

            {/* Filter 1: Categories */}
            <div>
              <h4 className="text-xs font-normal uppercase tracking-wider text-slate-800 mb-2.5">
                Categories
              </h4>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href="/shop"
                    className={`block px-2.5 py-1.5 rounded font-light transition-colors ${
                      !params.category
                        ? "bg-[#FFB200] text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    All Categories
                  </Link>
                </li>
                {allCategories.map((c: any) => {
                  const isSelected = params.category === c.slug || canonicalCategory === c.slug;
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/shop?category=${c.slug}`}
                        prefetch={true}
                        className={`block px-2.5 py-1.5 rounded font-light transition-colors ${
                          isSelected
                            ? "bg-[#FFB200] text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Filter 2: Brands */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-normal uppercase tracking-wider text-slate-800 mb-2.5">
                Brands
              </h4>
              <div className="space-y-1.5">
                {allBrands.map((b: any) => {
                  const isChecked = brandList?.includes(b.slug);
                  return (
                    <Link
                      key={b.id}
                      href={`/shop?brand=${b.slug}${params.category ? `&category=${params.category}` : ""}`}
                      className="flex items-center justify-between text-xs font-light text-slate-600 hover:text-slate-900 py-0.5"
                    >
                      <span className={isChecked ? "font-normal text-amber-600" : ""}>
                        {b.name}
                      </span>
                      {isChecked && <span className="text-amber-500 font-bold">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Condition */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-normal uppercase tracking-wider text-slate-800 mb-2.5">
                Condition
              </h4>
              <div className="space-y-1 text-xs">
                {[
                  { label: "Brand New (Factory Sealed)", val: "BRAND_NEW" },
                  { label: "Refurbished (GTC Certified)", val: "REFURBISHED" },
                  { label: "Open Box", val: "OPEN_BOX" },
                ].map((cond) => (
                  <Link
                    key={cond.val}
                    href={`/shop?condition=${cond.val}${params.category ? `&category=${params.category}` : ""}`}
                    className={`block px-2.5 py-1.5 rounded font-light transition-colors ${
                      conditionList?.includes(cond.val)
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cond.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filter 4: Price Ranges in Naira */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-normal uppercase tracking-wider text-slate-800 mb-2.5">
                Budget (₦)
              </h4>
              <div className="space-y-1 text-xs">
                {[
                  { label: "Under ₦500,000", max: 500000 },
                  { label: "₦500,000 – ₦800,000", min: 500000, max: 800000 },
                  { label: "₦800,000 – ₦1,500,000", min: 800000, max: 1500000 },
                  { label: "₦1,500,000 & Above", min: 1500000 },
                ].map((range, idx) => (
                  <Link
                    key={idx}
                    href={`/shop?${range.min ? `minPrice=${range.min}&` : ""}${range.max ? `maxPrice=${range.max}&` : ""}${params.category ? `category=${params.category}` : ""}`}
                    className="block px-2.5 py-1.5 rounded text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-light"
                  >
                    {range.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Smart Finder Widget Promo */}
            <div className="pt-4 border-t border-slate-100 bg-amber-50/50 -mx-5 -mb-5 p-5 rounded-b border-t border-amber-100">
              <h5 className="font-normal text-xs text-amber-900 mb-1">Confused by specs?</h5>
              <p className="text-[11px] font-extralight text-amber-800 leading-snug mb-3">
                Let our Smart Finder match your exact coding, design or business requirements.
              </p>
              <Link
                href="/smart-finder"
                className="w-full block text-center py-2 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs"
              >
                Open Smart Finder
              </Link>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="bg-white rounded border border-[#EBEBEB] p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                  <Filter className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-light text-slate-800 uppercase tracking-wide">
                  No products matched your exact filter combination
                </h3>
                <p className="text-xs font-extralight text-slate-400 max-w-md mx-auto">
                  Try clearing some filters or budget constraints, or contact our team directly on WhatsApp to check custom procurement options.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/shop"
                    className="px-5 py-2 bg-[#FFB200] text-white font-light text-xs uppercase tracking-wider rounded hover:bg-[#FFA500] transition-colors"
                  >
                    Reset All Filters
                  </Link>
                  <a
                    href="https://wa.me/2348067150130"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 border border-emerald-500/40 text-emerald-700 bg-emerald-50/50 font-light text-xs uppercase tracking-wider rounded hover:bg-emerald-100 transition-colors"
                  >
                    WhatsApp Enquiry
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p: any) => (
                  <ProductCard key={p.id} product={p as any} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

