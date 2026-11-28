import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assignedStaff, internalNotes, quotationFileUrl } = body;

    const updated = await prisma.corporateRfq.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        assignedStaff: assignedStaff !== undefined ? assignedStaff : undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
        quotationFileUrl: quotationFileUrl !== undefined ? quotationFileUrl : undefined,
      },
    });

    return NextResponse.json({ success: true, rfq: updated });
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
    await prisma.corporateRfq.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "RFQ deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
