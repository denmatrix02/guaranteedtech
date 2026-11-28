import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, logoUrl, description, websiteUrl, isFeatured, isPublished, displayOrder } = body;

    const updated = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : undefined,
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        description: description !== undefined ? description : undefined,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(String(displayOrder), 10) : undefined,
      },
    });

    return NextResponse.json({ success: true, brand: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productCount = await prisma.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete brand because ${productCount} active products are linked to it. Please reassign them first.` },
        { status: 400 }
      );
    }

    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Brand deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
