import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const source = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        specifications: true,
        branchStock: true,
      },
    });

    if (!source) {
      return NextResponse.json({ success: false, error: "Original product not found" }, { status: 404 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newSku = `${source.sku}-COPY-${randomSuffix}`;
    const newSlug = `${source.slug}-copy-${randomSuffix}`;
    const newName = `${source.name} (Copy)`;

    const duplicated = await prisma.product.create({
      data: {
        name: newName,
        subtitle: source.subtitle,
        slug: newSlug,
        sku: newSku,
        brandId: source.brandId,
        categoryId: source.categoryId,
        series: source.series,
        modelNumber: source.modelNumber,
        condition: source.condition,
        conditionDetails: source.conditionDetails,
        basePrice: source.basePrice,
        comparePrice: source.comparePrice,
        costPrice: source.costPrice,
        discountPercent: source.discountPercent,
        stockQuantity: source.stockQuantity,
        lowStockThreshold: source.lowStockThreshold,
        availabilityStatus: source.availabilityStatus,
        warrantyMonths: source.warrantyMonths,
        warrantyProvider: source.warrantyProvider,
        warrantyType: source.warrantyType,
        warrantyDetails: source.warrantyDetails,
        warrantyTerms: source.warrantyTerms,
        shortDescription: source.shortDescription,
        fullDescription: source.fullDescription,
        intendedUsage: source.intendedUsage,
        videoUrl: source.videoUrl,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isSpecialOffer: false,
        onSale: source.onSale,
        bestReviewed: false,
        enableAddToCart: source.enableAddToCart,
        enableBuyNow: source.enableBuyNow,
        enableEnquiries: source.enableEnquiries,
        isPublished: false, // Default duplicates to draft so admin can review
        isArchived: false,
        seoTitle: `${newName} | GuaranteedTech Nigeria`,
        seoDescription: source.seoDescription,
        focusKeywords: source.focusKeywords,
        canonicalUrl: `https://www.guaranteedtech.org/products/${newSlug}`,
        images: source.images.length > 0 ? {
          create: source.images.map((img: any) => ({
            url: img.url,
            altText: img.altText || newName,
            isPrimary: img.isPrimary,
            displayOrder: img.displayOrder,
          })),
        } : undefined,
        specifications: source.specifications.length > 0 ? {
          create: source.specifications.map((spec: any) => ({
            category: spec.category,
            specKey: spec.specKey,
            specValue: spec.specValue,
            displayOrder: spec.displayOrder,
          })),
        } : undefined,
        branchStock: source.branchStock.length > 0 ? {
          create: source.branchStock.map((b: any) => ({
            branch: b.branch,
            quantity: b.quantity,
            lowStockThreshold: b.lowStockThreshold,
          })),
        } : undefined,
      },
    });

    return NextResponse.json({ success: true, product: duplicated });
  } catch (err: any) {
    console.error("Duplicate product error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
