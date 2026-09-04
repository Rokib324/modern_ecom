import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET /api/categories — list all active categories with product counts
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();

    // Attach product count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: cat._id,
          isActive: true,
        });
        return {
          ...cat,
          productCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error("Categories GET error:", error);
    return errorResponse("Failed to fetch categories", 500);
  }
}

// POST /api/categories — admin only
export async function POST(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const body = await request.json();

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const { name, description, image, parent, isActive } = parsed.data;
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(name);

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return errorResponse("A category with this name or slug already exists", 409);
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parent: parent || undefined,
      isActive: isActive !== false,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Category POST error:", error);
    return errorResponse("Internal server error", 500);
  }
}
