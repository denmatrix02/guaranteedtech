import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ensure instagram_gallery section exists
async function getOrCreateInstagramSection() {
  let section = await prisma.homepageSection.findUnique({
    where: { sectionKey: "instagram_gallery" },
  });

  if (!section) {
    section = await prisma.homepageSection.create({
      data: {
        sectionKey: "instagram_gallery",
        title: "INSTAGRAM @GUARANTEED_TECH",
        subtitle: "Live showroom inventory, unboxing previews, and customer deliveries from our Aba enterprise hubs.",
        sectionType: "HTML_BLOCK",
        displayOrder: 10,
        isPublished: true,
      },
    });
  }

  return section;
}

// GET /api/admin/instagram - Fetch all Instagram gallery items
export async function GET() {
  try {
    const section = await getOrCreateInstagramSection();
    const items = await prisma.homepageBanner.findMany({
      where: { sectionId: section.id },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      section,
      items,
    });
  } catch (err: any) {
    console.error("Failed to fetch Instagram gallery items:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load Instagram items." },
      { status: 500 }
    );
  }
}

// POST /api/admin/instagram - Create a new Instagram item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, imageUrl, targetUrl, displayOrder, isPublished } = body;

    const postTargetUrl = targetUrl?.trim() || "https://www.instagram.com/guaranteed_tech/";
    const postTitle = title?.trim() || "GuaranteedTech Live Showroom";

    const section = await getOrCreateInstagramSection();

    // Determine display order
    let order = displayOrder;
    if (order === undefined || order === null) {
      const count = await prisma.homepageBanner.count({
        where: { sectionId: section.id },
      });
      order = count + 1;
    }

    const newItem = await prisma.homepageBanner.create({
      data: {
        sectionId: section.id,
        title: postTitle,
        subtitle: subtitle?.trim() || "Official @guaranteed_tech showroom update",
        imageUrl: imageUrl?.trim() || "/images/ui/insta_1.jpg",
        targetUrl: postTargetUrl,
        badgeText: "INSTAGRAM",
        buttonText: "VIEW ON INSTAGRAM",
        displayOrder: parseInt(order, 10) || 1,
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Instagram showroom item created successfully.",
      item: newItem,
    });
  } catch (err: any) {
    console.error("Failed to create Instagram item:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create Instagram item." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/instagram - Update an existing item or reorder
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Handle reordering batch
    if (Array.isArray(body.reorder)) {
      const updates = body.reorder.map((item: { id: string; displayOrder: number }) =>
        prisma.homepageBanner.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      );
      await prisma.$transaction(updates);

      return NextResponse.json({
        success: true,
        message: "Instagram gallery reordered successfully.",
      });
    }

    // Single item update
    const { id, title, subtitle, imageUrl, targetUrl, displayOrder, isPublished } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required for update." },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.homepageBanner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle?.trim() || "" }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
        ...(targetUrl !== undefined && {
          targetUrl: targetUrl.trim() || "https://www.instagram.com/guaranteed_tech/",
        }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Instagram showroom item updated successfully.",
      item: updatedItem,
    });
  } catch (err: any) {
    console.error("Failed to update Instagram item:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update Instagram item." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/instagram - Delete an item
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required for deletion." },
        { status: 400 }
      );
    }

    await prisma.homepageBanner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Instagram showroom item deleted successfully.",
    });
  } catch (err: any) {
    console.error("Failed to delete Instagram item:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete item." },
      { status: 500 }
    );
  }
}
