import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        specifications: { orderBy: { displayOrder: "asc" } },
        branchStock: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      subtitle,
      slug,
      sku,
      brandId,
      customBrandName,
      categoryId,
      series,
      modelNumber,
      condition,
      conditionDetails,
      basePrice,
      comparePrice,
      costPrice,
      discountPercent,
      stockQuantity,
      lowStockThreshold,
      availabilityStatus,
      warrantyMonths,
      warrantyProvider,
      warrantyType,
      warrantyDetails,
      warrantyTerms,
      shortDescription,
      fullDescription,
      intendedUsage,
      videoUrl,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isSpecialOffer,
      onSale,
      bestReviewed,
      enableAddToCart,
      enableBuyNow,
      enableEnquiries,
      isPublished,
      isArchived,
      seoTitle,
      seoDescription,
      focusKeywords,
      canonicalUrl,
      images,
      specifications,
      branchStock,
    } = body;

    // Resolve Brand: Support dynamic on-the-fly custom brand creation
    let resolvedBrandId = brandId;
    if ((brandId === "CUSTOM" || !brandId || brandId === "OTHER") && customBrandName && typeof customBrandName === "string" && customBrandName.trim().length > 0) {
      const trimmedBrand = customBrandName.trim();
      const brandSlug = trimmedBrand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      let matchedBrand = await prisma.brand.findFirst({
        where: {
          OR: [
            { name: { equals: trimmedBrand, mode: "insensitive" } },
            { slug: brandSlug },
          ],
        },
      });

      if (!matchedBrand) {
        matchedBrand = await prisma.brand.create({
          data: {
            name: trimmedBrand,
            slug: brandSlug || `brand-${Date.now()}`,
            isPublished: true,
          },
        });
      }
      resolvedBrandId = matchedBrand.id;
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

    // Update main product entity
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        slug: slug || undefined,
        sku,
        brandId: resolvedBrandId || brandId,
        categoryId,
        series: series !== undefined ? series : undefined,
        modelNumber: modelNumber !== undefined ? modelNumber : undefined,
        condition,
        conditionDetails,
        basePrice: parsedPrice,
        comparePrice: parsedCompare,
        costPrice: parsedCost,
        discountPercent: calcDiscount,
        stockQuantity: parsedStock,
        lowStockThreshold: parseInt(String(lowStockThreshold), 10) || 3,
        availabilityStatus: availabilityStatus || (parsedStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK"),
        warrantyMonths: warrantyMonths ? parseInt(String(warrantyMonths), 10) : undefined,
        warrantyProvider,
        warrantyType,
        warrantyDetails,
        warrantyTerms,
        shortDescription,
        fullDescription,
        intendedUsage: Array.isArray(intendedUsage) ? intendedUsage.join(",") : (intendedUsage || null),
        videoUrl,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : undefined,
        isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : undefined,
        isSpecialOffer: isSpecialOffer !== undefined ? Boolean(isSpecialOffer) : undefined,
        onSale: onSale !== undefined ? Boolean(onSale) : undefined,
        bestReviewed: bestReviewed !== undefined ? Boolean(bestReviewed) : undefined,
        enableAddToCart: enableAddToCart !== undefined ? Boolean(enableAddToCart) : undefined,
        enableBuyNow: enableBuyNow !== undefined ? Boolean(enableBuyNow) : undefined,
        enableEnquiries: enableEnquiries !== undefined ? Boolean(enableEnquiries) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        isArchived: isArchived !== undefined ? Boolean(isArchived) : undefined,
        seoTitle,
        seoDescription,
        focusKeywords,
        canonicalUrl,
      },
    });

    // Replace images if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            altText: img.altText || name,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            displayOrder: img.displayOrder || idx + 1,
          })),
        });
      }
    }

    // Replace specifications if provided
    if (specifications && Array.isArray(specifications)) {
      await prisma.productSpecification.deleteMany({ where: { productId: id } });
      if (specifications.length > 0) {
        await prisma.productSpecification.createMany({
          data: specifications.map((spec: any, idx: number) => ({
            productId: id,
            category: spec.category || "GENERAL",
            specKey: spec.name || spec.specKey || "Specification",
            specValue: spec.value || spec.specValue || "",
            displayOrder: spec.displayOrder || idx + 1,
          })),
        });
      }
    }

    // Upsert branchStock if provided
    if (branchStock && Array.isArray(branchStock)) {
      for (const b of branchStock) {
        await prisma.branchInventory.upsert({
          where: {
            productId_branch: {
              productId: id,
              branch: b.branch,
            },
          },
          update: {
            quantity: parseInt(String(b.quantity), 10) || 0,
            lowStockThreshold: parseInt(String(b.lowStockThreshold), 10) || 2,
          },
          create: {
            productId: id,
            branch: b.branch,
            quantity: parseInt(String(b.quantity), 10) || 0,
            lowStockThreshold: parseInt(String(b.lowStockThreshold), 10) || 2,
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        specifications: { orderBy: { displayOrder: "asc" } },
        branchStock: true,
      },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (err: any) {
    console.error("Update product error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Product deleted permanently" });
  } catch (err: any) {
    console.error("Delete product error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
