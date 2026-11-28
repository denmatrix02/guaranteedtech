import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, imageUrl, iconName, parentId, isPopular, isPublished, displayOrder } = body;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : undefined,
        description: description !== undefined ? description : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        iconName: iconName !== undefined ? iconName : undefined,
        parentId: parentId !== undefined ? parentId : undefined,
        isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(String(displayOrder), 10) : undefined,
      },
    });

    return NextResponse.json({ success: true, category: updated });
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
    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete category because it contains ${productCount} active products. Please reassign or delete them first.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
