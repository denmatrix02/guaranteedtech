import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Image ID is required", { status: 400 });
    }

    // Strip any file extension if present (e.g. "uuid.jpg" -> "uuid")
    const cleanId = id.replace(/\.[^/.]+$/, "");

    const media = await prisma.mediaItem.findUnique({
      where: { id: cleanId },
    });

    if (!media) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // If media.url is a base64 Data URL, decode and serve as binary HTTP stream
    if (media.url.startsWith("data:")) {
      const parts = media.url.split(",");
      if (parts.length === 2) {
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : media.mimeType || "image/jpeg";
        const buffer = Buffer.from(parts[1], "base64");

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // If media.url is an external URL (e.g. Supabase CDN, Unsplash, Cloudinary)
    if (media.url.startsWith("http://") || media.url.startsWith("https://")) {
      return NextResponse.redirect(media.url, 307);
    }

    // If it's a relative path on disk (e.g. /images/ui/post_1.jpg)
    return NextResponse.redirect(new URL(media.url, request.url), 307);
  } catch (err: any) {
    console.error("Media serve error:", err);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
