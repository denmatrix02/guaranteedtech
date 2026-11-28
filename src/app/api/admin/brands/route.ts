import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json({ success: true, brands });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, logoUrl, description, websiteUrl, isFeatured, isPublished, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Brand name is required" }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newBrand = await prisma.brand.create({
      data: {
        name,
        slug: cleanSlug,
        logoUrl: logoUrl || null,
        description: description || null,
        websiteUrl: websiteUrl || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        displayOrder: parseInt(String(displayOrder), 10) || 0,
      },
    });

    return NextResponse.json({ success: true, brand: newBrand });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
