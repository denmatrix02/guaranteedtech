import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        banners: { orderBy: { displayOrder: "asc" } },
      },
    });
    return NextResponse.json({ success: true, sections });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, sectionId, isPublished, title, subtitle, displayOrder, newBanner } = body;

    if (action === "TOGGLE_PUBLISH") {
      const updated = await prisma.homepageSection.update({
        where: { id: sectionId },
        data: { isPublished: !isPublished },
      });
      return NextResponse.json({ success: true, section: updated });
    }

    if (action === "UPDATE_DETAILS") {
      const updated = await prisma.homepageSection.update({
        where: { id: sectionId },
        data: { title, subtitle },
      });
      return NextResponse.json({ success: true, section: updated });
    }

    if (action === "REORDER") {
      // Reorder array of { id, displayOrder }
      const { reorderedSections } = body;
      for (const item of reorderedSections) {
        await prisma.homepageSection.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "ADD_BANNER") {
      const banner = await prisma.homepageBanner.create({
        data: {
          sectionId,
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          imageUrl: newBanner.imageUrl,
          targetUrl: newBanner.targetUrl || "/shop",
          buttonText: newBanner.buttonText || "Shop Now",
          badgeText: newBanner.badgeText || "PROMO",
          displayOrder: 1,
          isPublished: true,
        },
      });
      return NextResponse.json({ success: true, banner });
    }

    return NextResponse.json({ success: false, error: "Invalid CMS action" }, { status: 400 });
  } catch (err: any) {
    console.error("CMS update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

