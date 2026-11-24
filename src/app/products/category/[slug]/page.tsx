import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getFilteredProducts } from "@/lib/search";
import { normalizeCategorySlug, getCategoryMetadata } from "@/lib/categories";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight, ArrowUpDown, Filter, Sparkles, MessageSquare } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    brand?: string | string[];
    condition?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonicalSlug = normalizeCategorySlug(slug) || slug;
  const meta = getCategoryMetadata(canonicalSlug);

  return {
    title: `${meta.name} | GuaranteedTech Nigeria`,
    description: meta.description,
    openGraph: {
      title: `${meta.name} — GuaranteedTech Nigeria`,
      description: meta.description,
      url: `https://guaranteedtech.vercel.app/products/category/${slug}`,
    },
  };
}

export default async function CategoryListingPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;

  const canonicalSlug = normalizeCategorySlug(slug);
  if (!canonicalSlug) {
    notFound();
  }

  const meta = getCategoryMetadata(canonicalSlug);

  // Normalize filters
  const brandList = Array.isArray(queryParams.brand)
    ? queryParams.brand
    : queryParams.brand
    ? [queryParams.brand]
    : undefined;

  const conditionList = Array.isArray(queryParams.condition)
    ? queryParams.condition
    : queryParams.condition
    ? [queryParams.condition]
    : undefined;

  const minPrice = queryParams.minPrice ? parseFloat(queryParams.minPrice) : undefined;
  const maxPrice = queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : undefined;
  const sort = (queryParams.sort as any) || "featured";

  // Query products for this specific category (including its children)
  const [products, dbCategory, allCategories] = await Promise.all([
    getFilteredProducts({
      category: canonicalSlug,
      brand: brandList,
      condition: conditionList as any,
      minPrice,
      maxPrice,
      sort,
    }),
    prisma.category.findFirst({
      where: {
        OR: [
          { slug: canonicalSlug },
          { slug },
        ],
      },
      include: {
        subcategories: true,
      },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const categoryTitle = dbCategory?.name || meta.name;
  const categoryDesc = dbCategory?.description || meta.description;

  return (
    <div className="bg-white min-h-screen py-8 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-light text-slate-400 mb-4 flex-wrap">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/shop" className="hover:text-slate-800 transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-800 font-normal">{categoryTitle}</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#FFB200] text-white text-[10px] font-medium uppercase tracking-[0.16em] px-2.5 py-0.5 rounded-full">
                Certified Category
              </span>
              <span className="text-[11px] font-extralight text-slate-400">
                Payment on Delivery Available
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight uppercase">
              {categoryTitle}
            </h1>
            <p className="text-xs sm:text-sm font-extralight text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {categoryDesc}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <form method="GET" className="flex items-center gap-2">
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
                className="px-3.5 py-1.5 bg-[#FFB200] hover:bg-[#FFA500] text-white rounded text-xs font-light uppercase tracking-wider transition-colors shadow-xs"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {/* Subcategories / Quick Pill Links if available */}
        {dbCategory?.subcategories && dbCategory.subcategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-100">
            <span className="text-xs font-light text-slate-400">Subcategories:</span>
            {dbCategory.subcategories.map((sub: any) => (
              <Link
                key={sub.id}
                href={`/products/category/${sub.slug}`}
                prefetch={true}
                className="px-3 py-1 rounded-full text-xs font-light bg-slate-50 border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Main Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded border border-[#EBEBEB] p-12 text-center space-y-4 my-8">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-[#FFB200]">
              <Sparkles className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-light text-slate-800 uppercase tracking-wide">
              New {categoryTitle} Inventory Arriving Soon
            </h3>
            <p className="text-xs font-extralight text-slate-400 max-w-md mx-auto leading-relaxed">
              Our technicians are currently inspecting and certifying fresh batches of {categoryTitle.toLowerCase()}. Chat directly with our Aba showroom desk on WhatsApp to reserve upcoming units before they hit the site.
            </p>
            <div className="flex justify-center gap-3 pt-3 flex-wrap">
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded transition-colors shadow-xs"
              >
                Browse All In-Stock Hardware
              </Link>
              <a
                href={`https://wa.me/2348067150130?text=${encodeURIComponent(
                  `Hello GuaranteedTech, I am looking for ${categoryTitle} availability and pricing.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-emerald-500/40 text-emerald-800 bg-emerald-50 font-light text-xs uppercase tracking-wider rounded hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Sourcing Desk
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs font-extralight text-slate-400 mb-6">
              <span>Showing {products.length} certified {products.length === 1 ? "unit" : "units"} in stock</span>
              <span className="text-emerald-700 font-light">✓ Certified GTC Warranty Included</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        )}

        {/* Category Navigation Footer Links */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <h4 className="text-xs font-light text-slate-400 uppercase tracking-[0.16em] mb-4">
            Other Popular Hardware Categories
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {allCategories.map((c: any) => (
              <Link
                key={c.id}
                href={`/products/category/${c.slug}`}
                prefetch={true}
                className="px-3.5 py-1.5 rounded bg-slate-50 text-slate-700 text-xs font-light hover:bg-[#FFB200] hover:text-white transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/shop"
              prefetch={true}
              className="px-3.5 py-1.5 rounded bg-slate-900 text-white text-xs font-light hover:bg-slate-800 transition-colors"
            >
              All Hardware Catalog &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
