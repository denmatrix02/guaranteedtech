import React from "react";
import Link from "next/link";
import { executeIntelligentSearch } from "@/lib/search";
import { ProductCard } from "@/components/ui/ProductCard";
import { formatNaira } from "@/lib/currency";
import {
  Search,
  Sparkles,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Send,
} from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params.q || "";

  // Call the Intelligent Search & Alternative Engine
  const searchResult = await executeIntelligentSearch(rawQuery, {
    category: params.category,
    brand: Array.isArray(params.brand) ? params.brand : params.brand ? [params.brand] : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
  });

  const { exactMatches, alternativeMatches, isAlternativeFallback, fallbackMessage } =
    searchResult;

  const whatsappSourcingText = encodeURIComponent(
    `Hello GuaranteedTech, I searched your website for "${rawQuery}" but couldn't find it. Can you confirm if you have it in stock or can source it for me?`
  );
  const whatsappSourcingUrl = `https://wa.me/2348067150130?text=${whatsappSourcingText}`;

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Search Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs font-light text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-normal">Search Results</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
                {rawQuery ? `Search results for "${rawQuery}"` : "Product Catalog Search"}
              </h1>
              <p className="text-xs font-extralight text-slate-400 mt-1">
                {isAlternativeFallback
                  ? `0 exact matches found • ${alternativeMatches.length} recommended alternatives`
                  : `${exactMatches.length} matching products found`}
              </p>
            </div>

            {/* Quick Sourcing CTA */}
            <a
              href={whatsappSourcingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-light text-xs uppercase tracking-wider rounded-full transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Request Item on WhatsApp
            </a>
          </div>
        </div>

        {/* CRITICAL: Alternative Fallback Banner */}
        {isAlternativeFallback && (
          <div className="mb-8 p-4 bg-[#FFF9E6] border border-[#FFE699] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-200/60 text-amber-900 mt-0.5 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h3 className="font-normal text-xs uppercase tracking-wider text-amber-950">
                  Exact Match Currently Unavailable
                </h3>
                <p className="text-xs font-light text-amber-900 mt-0.5 leading-relaxed">
                  {fallbackMessage}
                </p>
              </div>
            </div>

            <a
              href={whatsappSourcingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-medium text-xs uppercase tracking-wider rounded-full transition-colors flex-shrink-0"
            >
              Ask Tech Team to Source It
            </a>
          </div>
        )}

        {/* 1. Exact Matches Section */}
        {exactMatches.length > 0 && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-700">
                Exact Catalog Matches ({exactMatches.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {exactMatches.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* 2. Alternative Recommendations Section */}
        {alternativeMatches.length > 0 && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h2 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB200]" />
                Intelligent Alternative Suggestions ({alternativeMatches.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {alternativeMatches.map((item) => (
                <ProductCard
                  key={item.product.id}
                  product={item.product}
                  recommendationReason={item.recommendationReason}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Dead-End Handling / Sourcing Request Form */}
        {exactMatches.length === 0 && alternativeMatches.length === 0 && (
          <div className="bg-white rounded border border-[#EBEBEB] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-none space-y-6">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-[#EBEBEB] flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-7 h-7 text-[#FFB200] stroke-[1.5]" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-light text-slate-800 uppercase tracking-wide">
                Item Not Currently In Stock
              </h2>
              <p className="text-xs sm:text-sm font-extralight text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                We frequently import custom business laptops, workstations, and high-spec configurations directly from US &amp; UK enterprise refurbishers.
              </p>
            </div>

            <div className="p-5 bg-slate-50/60 rounded border border-[#EBEBEB] text-left space-y-3">
              <h4 className="font-normal text-xs uppercase tracking-wider text-slate-800">
                Submit a Product Sourcing Request
              </h4>
              <p className="text-xs font-extralight text-slate-400">
                Our procurement technicians will search our inventory pipeline and reply via WhatsApp or Phone within 2 business hours.
              </p>

              <form action="/api/enquiries" method="POST" className="space-y-3 pt-2">
                <input type="hidden" name="enquiryType" value="PRODUCT_SOURCING" />
                <input type="hidden" name="requestedProduct" value={rawQuery} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    required
                    className="px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Phone Number"
                    required
                    className="px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs font-light text-slate-800 focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-medium text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-none"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Sourcing Request
                </button>
              </form>
            </div>

            <div className="pt-2">
              <a
                href={whatsappSourcingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-light text-emerald-700 hover:underline"
              >
                Or chat with a sourcing specialist instantly on WhatsApp &rarr;
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

