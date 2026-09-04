import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { productUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET /api/products/[id] — retrieve by ID or Slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const product = await Product.findOne({
      $or: [{ _id: isMongoId ? id : null }, { slug: id }],
      isActive: true,
    })
      .populate("category", "name slug")
      .populate("reviews.user", "name image")
      .lean();

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product GET error:", error);
    return errorResponse("Internal server error", 500);
  }
}

// PUT /api/products/[id] — admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    if (parsed.data.name && !parsed.data.slug) {
      updateData.slug = slugify(parsed.data.name);
    }

    if (parsed.data.category) {
      const catExists = await Category.findById(parsed.data.category);
      if (!catExists) {
        return errorResponse("Category not found", 400);
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product PUT error:", error);
    return errorResponse("Internal server error", 500);
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    if (hardDelete) {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return errorResponse("Product not found", 404);
      return NextResponse.json({ success: true, message: "Product permanently deleted" });
    }

    // Default: Soft delete
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return NextResponse.json({ success: true, message: "Product archived successfully" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return errorResponse("Internal server error", 500);
  }
}
