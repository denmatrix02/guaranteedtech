import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isApproved, isFeatured, rating, comment } = body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        isApproved: isApproved !== undefined ? Boolean(isApproved) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        rating: rating !== undefined ? parseInt(String(rating), 10) : undefined,
        comment: comment !== undefined ? comment : undefined,
      },
    });

    return NextResponse.json({ success: true, review: updated });
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
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
