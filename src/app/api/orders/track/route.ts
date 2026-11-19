import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || searchParams.get("waybill") || searchParams.get("orderNumber") || "").trim();

    if (!q) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    // Search by orderNumber OR by shipment trackingNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: q } },
          { shipment: { trackingNumber: { equals: q } } },
        ],
      },
      include: {
        items: true,
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "No matching order found for this reference." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

