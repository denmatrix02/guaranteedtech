import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rfqs = await prisma.corporateRfq.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, rfqs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      companyName,
      email,
      phone,
      requestType = "BULK_LAPTOPS",
      requestedItems,
      quantity = 1,
      targetBudget,
      timeline,
      deliveryAddress,
      internalNotes,
    } = body;

    if (!customerName || !companyName || !email || !phone || !requestedItems) {
      return NextResponse.json(
        { success: false, error: "Customer name, company, email, phone, and requested items are required." },
        { status: 400 }
      );
    }

    const rfqNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRfq = await prisma.corporateRfq.create({
      data: {
        rfqNumber,
        customerName,
        companyName,
        email,
        phone,
        requestType,
        requestedItems,
        quantity: parseInt(String(quantity), 10) || 1,
        targetBudget: targetBudget ? parseFloat(targetBudget) : null,
        timeline: timeline || null,
        deliveryAddress: deliveryAddress || null,
        internalNotes: internalNotes || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, rfq: newRfq });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
