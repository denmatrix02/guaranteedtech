import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ensure latest_posts section exists
async function getOrCreateSection() {
  let section = await prisma.homepageSection.findUnique({
    where: { sectionKey: "latest_posts" },
  });

  if (!section) {
    section = await prisma.homepageSection.create({
      data: {
        sectionKey: "latest_posts",
        title: "LATEST POSTS",
        subtitle: "Official GuaranteedTech tech insights, enterprise hardware reviews, and Facebook community updates.",
        sectionType: "ARTICLES_GRID",
        displayOrder: 8,
        isPublished: true,
      },
    });
  }

  return section;
}

// GET /api/admin/posts - Fetch all posts
export async function GET() {
  try {
    const section = await getOrCreateSection();
    const posts = await prisma.homepageBanner.findMany({
      where: { sectionId: section.id },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      section,
      posts,
    });
  } catch (err: any) {
    console.error("Failed to fetch posts:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load posts." },
      { status: 500 }
    );
  }
}

// POST /api/admin/posts - Create a new post
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, imageUrl, targetUrl, badgeText, displayOrder, isPublished } = body;

    if (!title || !targetUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Facebook Post URL are required." },
        { status: 400 }
      );
    }

    const section = await getOrCreateSection();

    // Determine display order
    let order = displayOrder;
    if (order === undefined || order === null) {
      const count = await prisma.homepageBanner.count({
        where: { sectionId: section.id },
      });
      order = count + 1;
    }

    const newPost = await prisma.homepageBanner.create({
      data: {
        sectionId: section.id,
        title: title.trim(),
        subtitle: subtitle?.trim() || "",
        imageUrl: imageUrl?.trim() || "/images/ui/post_1.jpg",
        targetUrl: targetUrl.trim(),
        badgeText: (badgeText?.trim() || "TECH").toUpperCase(),
        buttonText: "READ MORE",
        displayOrder: parseInt(order, 10) || 1,
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Facebook post created successfully.",
      post: newPost,
    });
  } catch (err: any) {
    console.error("Failed to create post:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create post." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts - Update an existing post or reorder
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { action, id, title, subtitle, imageUrl, targetUrl, badgeText, displayOrder, isPublished, reorderedPosts } = body;

    // Bulk Reorder Action
    if (action === "REORDER" && Array.isArray(reorderedPosts)) {
      for (const item of reorderedPosts) {
        await prisma.homepageBanner.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        });
      }
      return NextResponse.json({ success: true, message: "Posts reordered successfully." });
    }

    // Toggle Published State
    if (action === "TOGGLE_PUBLISH" && id) {
      const updated = await prisma.homepageBanner.update({
        where: { id },
        data: { isPublished: !isPublished },
      });
      return NextResponse.json({ success: true, post: updated });
    }

    // Standard Edit
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required." },
        { status: 400 }
      );
    }

    const updated = await prisma.homepageBanner.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        subtitle: subtitle !== undefined ? subtitle.trim() : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : undefined,
        targetUrl: targetUrl !== undefined ? targetUrl.trim() : undefined,
        badgeText: badgeText !== undefined ? badgeText.trim().toUpperCase() : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post updated successfully.",
      post: updated,
    });
  } catch (err: any) {
    console.error("Failed to update post:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update post." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts - Delete a post
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required." },
        { status: 400 }
      );
    }

    await prisma.homepageBanner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (err: any) {
    console.error("Failed to delete post:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete post." },
      { status: 500 }
    );
  }
}
