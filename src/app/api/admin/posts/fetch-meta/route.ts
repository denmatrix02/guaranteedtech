import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    const targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return NextResponse.json(
        { success: false, error: "URL must begin with http:// or https://" },
        { status: 400 }
      );
    }

    // Fetch Facebook or target page using facebookexternalhit to get rich Open Graph meta
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Unable to access page (HTTP ${response.status}). You can upload an image directly.`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Helper regex to extract meta property/name contents
    const extractMeta = (property: string): string | null => {
      const regex1 = new RegExp(
        `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i"
      );
      const match1 = html.match(regex1);
      if (match1 && match1[1]) return match1[1];

      const regex2 = new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
        "i"
      );
      const match2 = html.match(regex2);
      if (match2 && match2[1]) return match2[1];

      return null;
    };

    // Helper to decode HTML entities
    const decodeHtml = (str: string) => {
      return str
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
        .replace(/&#([0-9]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 10)))
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    };

    // Extract title
    let title = extractMeta("og:title") || extractMeta("twitter:title");
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
    }
    if (title) {
      title = decodeHtml(title.replace(/\s*\|\s*Facebook$/i, "").trim());
    }

    // Extract description
    let description =
      extractMeta("og:description") ||
      extractMeta("twitter:description") ||
      extractMeta("description");
    if (description) {
      description = decodeHtml(description.trim());
    }

    // Extract image URL
    let rawImageUrl =
      extractMeta("og:image") ||
      extractMeta("twitter:image") ||
      extractMeta("og:image:url") ||
      extractMeta("og:image:secure_url");

    if (rawImageUrl) {
      rawImageUrl = decodeHtml(rawImageUrl.trim());
    }

    let finalImageUrl = rawImageUrl || "";

    // Save image to serverless database storage (MediaItem) so it never breaks on Vercel
    if (rawImageUrl && rawImageUrl.startsWith("http")) {
      try {
        const imgRes = await fetch(rawImageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (imgRes.ok) {
          const contentType = imgRes.headers.get("content-type") || "image/jpeg";
          let ext = ".jpg";
          if (contentType.includes("png")) ext = ".png";
          else if (contentType.includes("webp")) ext = ".webp";
          else if (contentType.includes("gif")) ext = ".gif";

          const arrayBuf = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuf);

          const base64Data = `data:${contentType};base64,${buffer.toString("base64")}`;
          const mediaItem = await prisma.mediaItem.create({
            data: {
              filename: `fb-${Date.now()}${ext}`,
              originalName: "facebook-post.jpg",
              mimeType: contentType,
              fileSize: buffer.length,
              url: base64Data,
              folder: "posts",
            },
          });

          finalImageUrl = `/api/media/${mediaItem.id}`;

          // Optional local disk cache in non-serverless dev (safe try-catch)
          if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
            try {
              const uploadDir = path.join(process.cwd(), "public", "uploads", "posts");
              await mkdir(uploadDir, { recursive: true });
              await writeFile(path.join(uploadDir, `fb-${Date.now()}${ext}`), buffer);
            } catch {
              // Ignore filesystem errors in serverless environments
            }
          }
        }
      } catch (imgErr) {
        console.warn("Could not save copy to MediaItem, falling back to raw URL:", imgErr);
        finalImageUrl = rawImageUrl;
      }
    }

    if (!finalImageUrl && !title && !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Facebook page did not provide open metadata. You can upload an image directly from your device.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        title: title || "",
        subtitle: description || "",
        imageUrl: finalImageUrl,
        targetUrl,
      },
    });
  } catch (err: any) {
    console.error("Facebook meta fetch error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch Facebook metadata.",
      },
      { status: 500 }
    );
  }
}
