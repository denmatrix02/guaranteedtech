import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      description,
      discountType,
      discountValue,
      bannerUrl,
      ctaLabel,
      ctaUrl,
      countdownEnabled,
      startAt,
      endAt,
      isActive,
      applicableCategories,
      applicableProducts,
    } = body;

    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        title,
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : undefined,
        description: description !== undefined ? description : undefined,
        discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        bannerUrl: bannerUrl !== undefined ? bannerUrl : undefined,
        ctaLabel,
        ctaUrl,
        countdownEnabled: countdownEnabled !== undefined ? Boolean(countdownEnabled) : undefined,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        applicableCategories: applicableCategories !== undefined ? JSON.stringify(applicableCategories) : undefined,
        applicableProducts: applicableProducts !== undefined ? JSON.stringify(applicableProducts) : undefined,
      },
    });

    return NextResponse.json({ success: true, promotion: updated });
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
    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Promotion deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
