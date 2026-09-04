import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin, errorResponse } from "@/lib/api-helpers";

// POST /api/upload — upload product and category images (admin only)
export async function POST(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    // Validate type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validMimeTypes.includes(file.type)) {
      return errorResponse("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.", 400);
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return errorResponse("File size exceeds maximum limit of 5MB", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Extension & unique name
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^\w-]/g, "");
    const uniqueName = `${baseName}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Failed to upload image", 500);
  }
}
