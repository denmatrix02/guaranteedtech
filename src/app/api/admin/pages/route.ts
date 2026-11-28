import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pages = await prisma.cmsPage.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ success: true, pages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, subtitle, contentHtml, seoTitle, seoDescription, isPublished } = body;

    if (!slug || !title) {
      return NextResponse.json({ success: false, error: "Slug and Title are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newPage = await prisma.cmsPage.create({
      data: {
        slug: cleanSlug,
        title,
        subtitle: subtitle || null,
        contentHtml: contentHtml || "",
        seoTitle: seoTitle || `${title} | GuaranteedTech Nigeria`,
        seoDescription: seoDescription || subtitle || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, page: newPage });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
