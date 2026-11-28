import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadAssetToSupabase } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Collect all uploaded files from form data
    const files: File[] = [];
    for (const [_, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image files were uploaded." },
        { status: 400 }
      );
    }

    const uploadedUrls: { url: string; originalName: string; size: number }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate image mime type
      const mime = file.type || "image/jpeg";
      if (!mime.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i)) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const fileName = `${timestamp}-${i}-${sanitizedName}`;

      let finalUrl = "";

      // 1. Try Supabase Storage if credentials are configured
      if (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabaseResult = await uploadAssetToSupabase(
            "products",
            fileName,
            buffer,
            mime
          );
          if (supabaseResult.success && supabaseResult.publicUrl) {
            finalUrl = supabaseResult.publicUrl;
          }
        } catch (supabaseErr) {
          console.warn("Supabase storage upload skipped:", supabaseErr);
        }
      }

      // 2. Database Media Storage (100% serverless compatible on Vercel without local filesystem dependencies)
      if (!finalUrl) {
        const base64Data = `data:${mime};base64,${buffer.toString("base64")}`;

        const mediaItem = await prisma.mediaItem.create({
          data: {
            filename: fileName,
            originalName: file.name,
            mimeType: mime,
            fileSize: file.size,
            url: base64Data,
            folder: "products",
          },
        });

        finalUrl = `/api/media/${mediaItem.id}`;
      }

      // 3. Optional local disk cache in non-serverless local development (safe try-catch, never throws on Vercel)
      if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
        try {
          const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
          await mkdir(uploadDir, { recursive: true });
          await writeFile(path.join(uploadDir, fileName), buffer);
        } catch {
          // Ignore filesystem errors in serverless environments
        }
      }

      uploadedUrls.push({
        url: finalUrl,
        originalName: file.name,
        size: file.size,
      });
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "Uploaded files are not valid image formats (JPEG, PNG, WebP, GIF, SVG, AVIF)." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls.map((u) => u.url),
      files: uploadedUrls,
      count: uploadedUrls.length,
      message: `Successfully uploaded ${uploadedUrls.length} image(s).`,
    });
  } catch (err: any) {
    console.error("Image upload API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload image(s)." },
      { status: 500 }
    );
  }
}
