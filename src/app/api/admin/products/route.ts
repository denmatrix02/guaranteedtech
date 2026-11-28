import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category") || "";
    const brandId = searchParams.get("brand") || "";
    const condition = searchParams.get("condition") || "";
    const stockStatus = searchParams.get("stockStatus") || "";
    const isPublished = searchParams.get("isPublished");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {
      isArchived: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { modelNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    if (brandId && brandId !== "ALL") {
      where.brandId = brandId;
    }

    if (condition && condition !== "ALL") {
      where.condition = condition;
    }

    if (stockStatus && stockStatus !== "ALL") {
      if (stockStatus === "OUT_OF_STOCK") {
        where.stockQuantity = 0;
      } else if (stockStatus === "LOW_STOCK") {
        where.stockQuantity = { gt: 0, lte: 4 };
      } else if (stockStatus === "IN_STOCK") {
        where.stockQuantity = { gt: 4 };
      }
    }

    if (isPublished !== null && isPublished !== undefined && isPublished !== "") {
      where.isPublished = isPublished === "true";
    }

    const orderBy: any = {};
    if (sortBy === "price") {
      orderBy.basePrice = sortOrder === "asc" ? "asc" : "desc";
    } else if (sortBy === "stock") {
      orderBy.stockQuantity = sortOrder === "asc" ? "asc" : "desc";
    } else if (sortBy === "name") {
      orderBy.name = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = sortOrder === "asc" ? "asc" : "desc";
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          brand: true,
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          specifications: { orderBy: { displayOrder: "asc" } },
          branchStock: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("Products GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      subtitle,
      slug: customSlug,
      sku,
      brandId,
      categoryId,
      series,
      modelNumber,
      condition = "REFURBISHED",
      conditionDetails,
      basePrice,
      comparePrice,
      costPrice,
      discountPercent,
      stockQuantity = 0,
      lowStockThreshold = 3,
      availabilityStatus,
      warrantyMonths,
      warrantyProvider = "GuaranteedTech",
      warrantyType = "Comprehensive Hardware Replacement & Repair",
      warrantyDetails,
      warrantyTerms,
      shortDescription,
      fullDescription,
      intendedUsage,
      videoUrl,
      isFeatured = false,
      isBestSeller = false,
      isNewArrival = false,
      isSpecialOffer = false,
      onSale = false,
      bestReviewed = false,
      enableAddToCart = true,
      enableBuyNow = true,
      enableEnquiries = true,
      isPublished = true,
      seoTitle,
      seoDescription,
      focusKeywords,
      canonicalUrl,
      images = [],
      specifications = [],
      branchStock = [],
    } = body;

    if (!name || !sku || !brandId || !categoryId || basePrice === undefined || basePrice === null) {
      return NextResponse.json(
        { success: false, error: "Product name, SKU, Brand, Category, and Selling Price are required." },
        { status: 400 }
      );
    }

    // Auto-generate or sanitize slug
    const cleanSlug = (customSlug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Verify unique slug
    let finalSlug = cleanSlug;
    const existingWithSlug = await prisma.product.findUnique({ where: { slug: finalSlug } });
    if (existingWithSlug) {
      finalSlug = `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const parsedPrice = parseFloat(basePrice);
    const parsedCompare = comparePrice ? parseFloat(comparePrice) : null;
    const parsedCost = costPrice ? parseFloat(costPrice) : null;
    const parsedStock = parseInt(String(stockQuantity), 10) || 0;

    let calcDiscount = discountPercent;
    if (calcDiscount === undefined || calcDiscount === null) {
      if (parsedCompare && parsedCompare > parsedPrice) {
        calcDiscount = Math.round(((parsedCompare - parsedPrice) / parsedCompare) * 100);
      } else {
        calcDiscount = 0;
      }
    }

    const computedStatus = availabilityStatus || (parsedStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK");

    const newProduct = await prisma.product.create({
      data: {
        name,
        subtitle: subtitle || null,
        slug: finalSlug,
        sku,
        brandId,
        categoryId,
        series: series || null,
        modelNumber: modelNumber || null,
        condition,
        conditionDetails: conditionDetails || null,
        basePrice: parsedPrice,
        comparePrice: parsedCompare,
        costPrice: parsedCost,
        discountPercent: calcDiscount,
        stockQuantity: parsedStock,
        lowStockThreshold: parseInt(String(lowStockThreshold), 10) || 3,
        availabilityStatus: computedStatus,
        warrantyMonths: warrantyMonths ? parseInt(String(warrantyMonths), 10) : 6,
        warrantyProvider,
        warrantyType,
        warrantyDetails: warrantyDetails || null,
        warrantyTerms: warrantyTerms || null,
        shortDescription: shortDescription || null,
        fullDescription: fullDescription || null,
        intendedUsage: Array.isArray(intendedUsage) ? intendedUsage.join(",") : (intendedUsage || null),
        videoUrl: videoUrl || null,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNewArrival: Boolean(isNewArrival),
        isSpecialOffer: Boolean(isSpecialOffer),
        onSale: Boolean(onSale),
        bestReviewed: Boolean(bestReviewed),
        enableAddToCart: Boolean(enableAddToCart),
        enableBuyNow: Boolean(enableBuyNow),
        enableEnquiries: Boolean(enableEnquiries),
        isPublished: Boolean(isPublished),
        isArchived: false,
        seoTitle: seoTitle || `${name} | GuaranteedTech Nigeria`,
        seoDescription: seoDescription || shortDescription || `${name} with official GTC warranty and nationwide delivery.`,
        focusKeywords: focusKeywords || null,
        canonicalUrl: canonicalUrl || `https://www.guaranteedtech.org/products/${finalSlug}`,
        images: images && images.length > 0 ? {
          create: images.map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || name,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            displayOrder: img.displayOrder || idx + 1,
          })),
        } : undefined,
        specifications: specifications && specifications.length > 0 ? {
          create: specifications.map((spec: any, idx: number) => ({
            category: spec.category || "GENERAL",
            specKey: spec.name || spec.specKey || "Specification",
            specValue: spec.value || spec.specValue || "",
            displayOrder: spec.displayOrder || idx + 1,
          })),
        } : undefined,
        branchStock: branchStock && branchStock.length > 0 ? {
          create: branchStock.map((b: any) => ({
            branch: b.branch,
            quantity: parseInt(String(b.quantity), 10) || 0,
            lowStockThreshold: parseInt(String(b.lowStockThreshold), 10) || 2,
          })),
        } : undefined,
      },
      include: {
        brand: true,
        category: true,
        images: true,
        specifications: true,
        branchStock: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
