import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { action, productIds, payload } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: "No products selected" }, { status: 400 });
    }

    if (action === "publish") {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isPublished: true },
      });
      return NextResponse.json({ success: true, message: `Published ${productIds.length} products` });
    }

    if (action === "unpublish") {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isPublished: false },
      });
      return NextResponse.json({ success: true, message: `Unpublished ${productIds.length} products` });
    }

    if (action === "archive") {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isArchived: true, isPublished: false },
      });
      return NextResponse.json({ success: true, message: `Archived ${productIds.length} products` });
    }

    if (action === "delete") {
      await prisma.product.deleteMany({
        where: { id: { in: productIds } },
      });
      return NextResponse.json({ success: true, message: `Deleted ${productIds.length} products permanently` });
    }

    if (action === "setCategory" && payload?.categoryId) {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { categoryId: payload.categoryId },
      });
      return NextResponse.json({ success: true, message: `Updated category for ${productIds.length} products` });
    }

    if (action === "setDiscount" && payload?.discountPercent !== undefined) {
      const discount = parseInt(payload.discountPercent, 10) || 0;
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { discountPercent: discount, onSale: discount > 0 },
      });
      return NextResponse.json({ success: true, message: `Updated discount to ${discount}% for ${productIds.length} products` });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Bulk action error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
