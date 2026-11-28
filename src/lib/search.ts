import prisma from "@/lib/prisma";
import { normalizeCategorySlug } from "@/lib/categories";

export interface SearchFilters {
  category?: string;
  brand?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  usage?: string[];
  ram?: string[];
  storage?: string[];
  sort?: "featured" | "price_asc" | "price_desc" | "newest" | "rating";
}

export interface RecommendationReason {
  badge: string;
  explanation: string;
}

export interface ProductWithReason {
  product: any;
  recommendationReason?: RecommendationReason;
  score?: number;
}

export interface SearchResult {
  query: string;
  exactMatches: any[];
  alternativeMatches: ProductWithReason[];
  isAlternativeFallback: boolean;
  fallbackMessage?: string;
  totalFound: number;
}

/**
 * Intelligent Search Engine with Multi-Tier Alternative Fallback Hierarchy
 */
export async function executeIntelligentSearch(
  rawQuery: string,
  filters: SearchFilters = {}
): Promise<SearchResult> {
  const query = rawQuery.trim();
  const normalizedQuery = query.toLowerCase();

  // If no query string, return standard filtered products
  if (!query) {
    const products = await getFilteredProducts(filters);
    return {
      query: "",
      exactMatches: products,
      alternativeMatches: [],
      isAlternativeFallback: false,
      totalFound: products.length,
    };
  }

  // Extract key terms: Brand, RAM, CPU, Series, Intended Use
  const parsedIntent = parseSearchTokens(normalizedQuery);

  // 1. First attempt: Exact and high-relevance fuzzy match
  const exactMatches = await findExactMatches(normalizedQuery, filters, parsedIntent);

  if (exactMatches.length > 0) {
    // Log successful search in background
    logSearchQuery(query, exactMatches.length, true, false).catch(() => {});

    return {
      query,
      exactMatches,
      alternativeMatches: [],
      isAlternativeFallback: false,
      totalFound: exactMatches.length,
    };
  }

  // 2. CRITICAL: Exact match returned 0 results. Trigger Intelligent Fallback Hierarchy!
  const alternatives = await findIntelligentAlternatives(query, parsedIntent, filters);

  const fallbackMessage = generateFallbackMessage(query, parsedIntent, alternatives.length > 0);

  // Log unfulfilled search demand with closest alternative references
  const alternativeIds = alternatives.map((a) => a.product.id);
  logSearchQuery(
    query,
    0,
    false,
    true,
    JSON.stringify(alternativeIds)
  ).catch(() => {});

  return {
    query,
    exactMatches: [],
    alternativeMatches: alternatives,
    isAlternativeFallback: true,
    fallbackMessage,
    totalFound: alternatives.length,
  };
}

/**
 * Tokenize search query to extract hardware specifications, brands, and usage
 */
function parseSearchTokens(query: string) {
  const brands = [
    "hp",
    "lenovo",
    "dell",
    "apple",
    "asus",
    "logitech",
    "samsung",
    "apc",
    "anker",
    "canon",
    "starlink",
    "cisco",
    "mikrotik",
    "ubiquiti",
    "tp-link",
  ];
  const seriesList = ["thinkpad", "elitebook", "probook", "latitude", "macbook", "zenbook", "optiplex", "rog"];
  const usages = ["programming", "gaming", "business", "student", "graphic design", "office", "workstation"];

  const foundBrand = brands.find((b) => query.includes(b));
  const foundSeries = seriesList.find((s) => query.includes(s));
  const foundUsage = usages.find((u) => query.includes(u));

  // Extract RAM (e.g., "16gb", "32gb", "8gb")
  const ramMatch = query.match(/(\d{1,2})\s*gb\s*(ram)?/i);
  const targetRam = ramMatch ? `${ramMatch[1]}GB` : null;

  // Extract CPU (e.g., "i7", "i5", "i9", "ryzen", "m1", "m2", "m3")
  let targetCpu: string | null = null;
  if (/i7|core\s*i7/i.test(query)) targetCpu = "Core i7";
  else if (/i5|core\s*i5/i.test(query)) targetCpu = "Core i5";
  else if (/i9|core\s*i9/i.test(query)) targetCpu = "Core i9";
  else if (/ryzen/i.test(query)) targetCpu = "Ryzen";
  else if (/m3/i.test(query)) targetCpu = "M3";
  else if (/m2/i.test(query)) targetCpu = "M2";

  // Extract Budget constraint (e.g. "under 1000000" or "under 500k")
  const underMatch = query.match(/under\s*(\d+)(k|m|000)?/i);
  let maxPrice: number | null = null;
  if (underMatch) {
    let val = parseInt(underMatch[1], 10);
    const unit = (underMatch[2] || "").toLowerCase();
    if (unit === "k") val *= 1000;
    else if (unit === "m") val *= 1000000;
    maxPrice = val;
  }

  return {
    raw: query,
    brand: foundBrand,
    series: foundSeries,
    usage: foundUsage,
    ram: targetRam,
    cpu: targetCpu,
    maxPrice,
  };
}

/**
 * Find exact or direct matches based on query terms
 */
async function findExactMatches(normalizedQuery: string, filters: SearchFilters, intent: any) {
  const whereClause: any = {
    isPublished: true,
    OR: [
      { name: { contains: normalizedQuery } },
      { shortDescription: { contains: normalizedQuery } },
      { sku: { contains: normalizedQuery } },
      { modelNumber: { contains: normalizedQuery } },
      { series: { contains: normalizedQuery } },
    ],
  };

  if (filters.category) {
    whereClause.category = { slug: filters.category };
  }
  if (filters.brand && filters.brand.length > 0) {
    whereClause.brand = { slug: { in: filters.brand } };
  }
  if (filters.condition && filters.condition.length > 0) {
    whereClause.condition = { in: filters.condition };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined || intent.maxPrice) {
    whereClause.basePrice = {};
    if (filters.minPrice) whereClause.basePrice.gte = filters.minPrice;
    const effectiveMax = filters.maxPrice || intent.maxPrice;
    if (effectiveMax) whereClause.basePrice.lte = effectiveMax;
  }

  return prisma.product.findMany({
    where: whereClause,
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
      specifications: true,
    },
    take: 24,
  });
}

/**
 * Intelligent Alternative Discovery Engine
 * Hierarchy:
 * 1. Related Product Links marked as ALTERNATIVE
 * 2. Same Brand + Same Series (e.g. HP 840 G7 instead of 840 G8)
 * 3. Same Brand with comparable specs
 * 4. Competitor Brands with comparable hardware specs (e.g. ThinkPad T490s for EliteBook 840)
 * 5. Same Category & Usage (e.g. Programming laptops in same price bracket)
 */
async function findIntelligentAlternatives(query: string, intent: any, filters: SearchFilters): Promise<ProductWithReason[]> {
  const alternatives: ProductWithReason[] = [];
  const seenIds = new Set<string>();

  // Fetch all active products in the candidate catalog for scoring
  const candidates = await prisma.product.findMany({
    where: {
      isPublished: true,
      availabilityStatus: "IN_STOCK",
    },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
      specifications: true,
    },
  });

  for (const product of candidates) {
    if (seenIds.has(product.id)) continue;

    let score = 0;
    let badge = "";
    let explanation = "";

    const pBrand = product.brand.slug.toLowerCase();
    const pSeries = (product.series || "").toLowerCase();
    const pName = product.name.toLowerCase();
    const pUsage = (product.intendedUsage || "").toLowerCase();

    // Check 1: Same Brand match
    if (intent.brand && pBrand === intent.brand) {
      score += 30;
      badge = `Similar ${product.brand.name}`;
      explanation = `Matches your preferred ${product.brand.name} brand with verified reliability.`;
    }

    // Check 2: Same or close series (e.g. EliteBook or ThinkPad)
    if (intent.series && (pSeries.includes(intent.series) || pName.includes(intent.series))) {
      score += 40;
      badge = `Same ${product.series} Line`;
      explanation = `Shares the same enterprise unibody build quality and features.`;
    }

    // Check 3: Hardware Specification match (CPU / RAM)
    if (intent.cpu && pName.includes(intent.cpu.toLowerCase())) {
      score += 25;
      if (!badge) {
        badge = `Matching ${intent.cpu}`;
        explanation = `Equipped with comparable ${intent.cpu} processing power.`;
      }
    }
    if (intent.ram && (pName.includes(intent.ram.toLowerCase()) || product.variants.some((v: any) => v.ram?.toLowerCase().includes(intent.ram!.toLowerCase())))) {
      score += 20;
    }

    // Check 4: Usage match (e.g. Programming, Gaming, Office)
    if (intent.usage && pUsage.includes(intent.usage)) {
      score += 25;
      if (!badge) {
        badge = `Best for ${intent.usage.toUpperCase()}`;
        explanation = `Configured specifically for demanding ${intent.usage} workflows.`;
      }
    }

    // Check 5: Budget constraint match
    if (intent.maxPrice) {
      if (product.basePrice <= intent.maxPrice) {
        score += 20;
        if (!badge) {
          badge = `Within Budget`;
          explanation = `Priced comfortably under your target ₦ budget.`;
        }
      }
    }

    if (score >= 25) {
      alternatives.push({
        product,
        score,
        recommendationReason: {
          badge: badge || "Recommended Alternative",
          explanation: explanation || "A closely matched alternative based on specs, quality, and pricing.",
        },
      });
      seenIds.add(product.id);
    }
  }

  // Sort by relevance score descending
  alternatives.sort((a, b) => (b.score || 0) - (a.score || 0));

  // If still fewer than 4 alternatives, fill with bestsellers in category
  if (alternatives.length < 4) {
    for (const product of candidates) {
      if (!seenIds.has(product.id) && (product.isBestSeller || product.isFeatured)) {
        alternatives.push({
          product,
          score: 10,
          recommendationReason: {
            badge: "Top Business Seller",
            explanation: "One of our most popular in-stock systems trusted by our customers.",
          },
        });
        seenIds.add(product.id);
        if (alternatives.length >= 6) break;
      }
    }
  }

  return alternatives.slice(0, 12);
}

function generateFallbackMessage(query: string, intent: any, hasAlternatives: boolean): string {
  if (hasAlternatives) {
    return `We couldn't find an exact in-stock match for "${query}", but our technicians have hand-selected these high-performance alternatives with equivalent specifications and reliability:`;
  }
  return `We currently do not have an exact match for "${query}" in our active catalogue. You can request a quotation below or chat directly with our sourcing team on WhatsApp.`;
}

/**
 * Filtered products helper for shop catalog browsing
 */
export async function getFilteredProducts(filters: SearchFilters) {
  const whereClause: any = { isPublished: true };

  if (filters.category) {
    const canonical = normalizeCategorySlug(filters.category);
    whereClause.category = {
      OR: [
        { slug: canonical },
        { slug: filters.category },
        { parent: { slug: canonical } },
        { parent: { slug: filters.category } },
      ],
    };
  }

  if (filters.brand && filters.brand.length > 0) {
    whereClause.brand = { slug: { in: filters.brand } };
  }

  if (filters.condition && filters.condition.length > 0) {
    whereClause.condition = { in: filters.condition };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    whereClause.basePrice = {};
    if (filters.minPrice !== undefined) whereClause.basePrice.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) whereClause.basePrice.lte = filters.maxPrice;
  }

  let orderBy: any = { isFeatured: "desc" };
  if (filters.sort === "price_asc") orderBy = { basePrice: "asc" };
  else if (filters.sort === "price_desc") orderBy = { basePrice: "desc" };
  else if (filters.sort === "newest") orderBy = { createdAt: "desc" };
  else if (filters.sort === "rating") orderBy = { salesCount: "desc" };

  return prisma.product.findMany({
    where: whereClause,
    orderBy,
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" }, take: 4 },
      variants: { select: { id: true, name: true, priceAdjustment: true } },
    },
    take: 36,
  });
}

/**
 * Track search demand in database for business intelligence
 */
async function logSearchQuery(
  query: string,
  resultCount: number,
  hasExactMatch: boolean,
  isUnavailableProduct: boolean,
  requestedAlternatives?: string
) {
  try {
    await prisma.searchDemandLog.create({
      data: {
        query,
        normalizedQuery: query.toLowerCase(),
        resultCount,
        hasExactMatch,
        isUnavailableProduct,
        requestedAlternatives,
      },
    });
  } catch (err) {
    // Log silently to avoid interrupting the search request
    console.error("Failed to log search query:", err);
  }
}

