import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.navigationMenu.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ success: true, menus });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location = "HEADER", label, url, displayOrder, isPublished, openInNewTab } = body;

    if (!label || !url) {
      return NextResponse.json({ success: false, error: "Label and URL are required" }, { status: 400 });
    }

    const newMenu = await prisma.navigationMenu.create({
      data: {
        location,
        label,
        url,
        displayOrder: parseInt(String(displayOrder), 10) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        openInNewTab: Boolean(openInNewTab),
      },
    });

    return NextResponse.json({ success: true, menu: newMenu });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
