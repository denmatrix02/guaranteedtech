import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Collect all uploaded files from form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
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

    // Destination directory: public/uploads/products
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: { url: string; originalName: string; size: number }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate image mime type
      const mime = file.type || "";
      if (!mime.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i)) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique safe file name
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
      const fileName = `${timestamp}-${i}-${sanitizedName}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      uploadedUrls.push({
        url: `/uploads/products/${fileName}`,
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
