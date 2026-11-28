import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, contentHtml, featuredImage, authorName, category, tags, isPublished, isFeatured } = body;

    if (!title || !contentHtml) {
      return NextResponse.json({ success: false, error: "Title and Content are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug: cleanSlug,
        excerpt: excerpt || null,
        contentHtml,
        featuredImage: featuredImage || null,
        authorName: authorName || "GuaranteedTech Tech Team",
        category: category || "HARDWARE_GUIDE",
        tags: tags || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
