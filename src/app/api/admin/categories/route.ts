import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true, subcategories: true },
        },
        parent: true,
      },
    });
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl, iconName, parentId, isPopular, isPublished, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || null,
        imageUrl: imageUrl || null,
        iconName: iconName || "Laptop",
        parentId: parentId || null,
        isPopular: Boolean(isPopular),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        displayOrder: parseInt(String(displayOrder), 10) || 0,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
