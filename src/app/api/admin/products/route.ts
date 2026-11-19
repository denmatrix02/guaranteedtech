import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: true,
        category: true,
        variants: true,
        images: true,
      },
    });
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      sku,
      brandId,
      categoryId,
      series,
      modelNumber,
      condition,
      conditionDetails,
      basePrice,
      comparePrice,
      stockQuantity,
      warrantyMonths,
      warrantyDetails,
      shortDescription,
      fullDescription,
      intendedUsage,
      imageUrl,
      variants,
      specifications,
    } = body;

    if (!name || !sku || !brandId || !categoryId || !basePrice) {
      return NextResponse.json(
        { success: false, error: "Please fill all required product fields." },
        { status: 400 }
      );
    }

    // Auto-generate slug
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        brandId,
        categoryId,
        series,
        modelNumber,
        condition: condition || "REFURBISHED",
        conditionDetails,
        basePrice: parseFloat(basePrice),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stockQuantity: parseInt(stockQuantity || "1", 10),
        availabilityStatus: parseInt(stockQuantity || "1", 10) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
        warrantyMonths: parseInt(warrantyMonths || "6", 10),
        warrantyDetails,
        shortDescription,
        fullDescription,
        intendedUsage: Array.isArray(intendedUsage) ? intendedUsage.join(",") : intendedUsage,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  altText: name,
                  isPrimary: true,
                  displayOrder: 1,
                },
              ],
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

