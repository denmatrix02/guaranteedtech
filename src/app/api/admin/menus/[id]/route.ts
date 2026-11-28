import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { location, label, url, displayOrder, isPublished, openInNewTab } = body;

    const updated = await prisma.navigationMenu.update({
      where: { id },
      data: {
        location,
        label,
        url,
        displayOrder: displayOrder !== undefined ? parseInt(String(displayOrder), 10) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : undefined,
      },
    });

    return NextResponse.json({ success: true, menu: updated });
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
    await prisma.navigationMenu.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Menu item deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
