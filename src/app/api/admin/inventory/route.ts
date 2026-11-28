import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        lowStockThreshold: true,
        availabilityStatus: true,
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        branchStock: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { productId, stockQuantity, azikiweStock, asaRoadStock, lowStockThreshold, availabilityStatus } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const totalBranch = (parseInt(azikiweStock, 10) || 0) + (parseInt(asaRoadStock, 10) || 0);
    const finalQuantity = totalBranch > 0 ? totalBranch : (parseInt(stockQuantity, 10) || 0);
    const computedStatus = availabilityStatus || (finalQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK");

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: finalQuantity,
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(String(lowStockThreshold), 10) : undefined,
        availabilityStatus: computedStatus,
      },
    });

    if (azikiweStock !== undefined) {
      await prisma.branchInventory.upsert({
        where: {
          productId_branch: { productId, branch: "AZIKIWE_ROAD" },
        },
        update: { quantity: parseInt(String(azikiweStock), 10) || 0 },
        create: { productId, branch: "AZIKIWE_ROAD", quantity: parseInt(String(azikiweStock), 10) || 0 },
      });
    }

    if (asaRoadStock !== undefined) {
      await prisma.branchInventory.upsert({
        where: {
          productId_branch: { productId, branch: "ASA_ROAD" },
        },
        update: { quantity: parseInt(String(asaRoadStock), 10) || 0 },
        create: { productId, branch: "ASA_ROAD", quantity: parseInt(String(asaRoadStock), 10) || 0 },
      });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
