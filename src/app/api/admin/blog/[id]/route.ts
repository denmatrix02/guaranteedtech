import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, contentHtml, featuredImage, authorName, category, tags, isPublished, isFeatured } = body;

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : undefined,
        excerpt: excerpt !== undefined ? excerpt : undefined,
        contentHtml: contentHtml !== undefined ? contentHtml : undefined,
        featuredImage: featuredImage !== undefined ? featuredImage : undefined,
        authorName: authorName !== undefined ? authorName : undefined,
        category: category !== undefined ? category : undefined,
        tags: tags !== undefined ? tags : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
    });

    return NextResponse.json({ success: true, post: updated });
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
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog post deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
