import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { categoryUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET /api/categories/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const category = await Category.findOne({
      $or: [{ _id: isMongoId ? id : null }, { slug: id }],
    }).lean();

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: { ...category, productCount },
    });
  } catch (error) {
    console.error("Category GET error:", error);
    return errorResponse("Internal server error", 500);
  }
}

// PUT /api/categories/[id] — admin only
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

    const parsed = categoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.slug) {
      updateData.slug = slugify(parsed.data.slug);
    } else if (parsed.data.name) {
      updateData.slug = slugify(parsed.data.name);
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Category PUT error:", error);
    return errorResponse("Internal server error", 500);
  }
}

// DELETE /api/categories/[id] — admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const { id } = await params;

    // Guard: Check if products belong to this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return errorResponse(
        `Cannot delete category: ${productsCount} product(s) are currently assigned to it. Reassign or delete the products first.`,
        400
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return errorResponse("Category not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return errorResponse("Internal server error", 500);
  }
}
