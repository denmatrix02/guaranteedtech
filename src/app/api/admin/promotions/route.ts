import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, promotions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      discountType = "PERCENTAGE",
      discountValue = 10,
      bannerUrl,
      ctaLabel = "Shop Offer",
      ctaUrl = "/shop",
      countdownEnabled = false,
      startAt,
      endAt,
      isActive = true,
      applicableCategories,
      applicableProducts,
    } = body;

    if (!title || !endAt) {
      return NextResponse.json({ success: false, error: "Title and End Date are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPromo = await prisma.promotion.create({
      data: {
        title,
        slug: cleanSlug,
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue) || 10,
        bannerUrl: bannerUrl || null,
        ctaLabel,
        ctaUrl,
        countdownEnabled: Boolean(countdownEnabled),
        startAt: startAt ? new Date(startAt) : new Date(),
        endAt: new Date(endAt),
        isActive: Boolean(isActive),
        applicableCategories: applicableCategories ? JSON.stringify(applicableCategories) : null,
        applicableProducts: applicableProducts ? JSON.stringify(applicableProducts) : null,
      },
    });

    return NextResponse.json({ success: true, promotion: newPromo });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
