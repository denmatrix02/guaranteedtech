import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, sku: true } },
      },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, reviewerName, reviewerLocation, rating, title, comment, isVerifiedPurchase, isApproved, isFeatured } = body;

    if (!reviewerName || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Reviewer name, rating, and comment are required" }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        productId: productId || null,
        reviewerName,
        reviewerLocation: reviewerLocation || "Nigeria",
        rating: parseInt(String(rating), 10) || 5,
        title: title || null,
        comment,
        isVerifiedPurchase: Boolean(isVerifiedPurchase),
        isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
