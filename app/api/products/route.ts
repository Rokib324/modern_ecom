import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));
    const categoryParam = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") ?? "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const inStock = searchParams.get("inStock");

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isActive: true };

    // Resolve category if provided by slug or ObjectId
    if (categoryParam && categoryParam !== "all") {
      const isMongoId = categoryParam.match(/^[0-9a-fA-F]{24}$/);
      if (isMongoId) {
        filter.category = categoryParam;
      } else {
        const cat = await Category.findOne({ slug: categoryParam }).lean();
        if (cat) {
          filter.category = cat._id;
        } else {
          // If category slug not found, match tags or return empty
          filter.tags = categoryParam;
        }
      }
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { name: regex },
        { tags: regex },
        { description: regex },
        { brand: regex },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortOption: Record<string, any> = {};
    switch (sort) {
      case "price_asc":
        sortOption.price = 1;
        break;
      case "price_desc":
        sortOption.price = -1;
        break;
      case "rating":
        sortOption.rating = -1;
        break;
      case "popular":
        sortOption.numReviews = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return errorResponse("Failed to fetch products", 500);
  }
}

// POST /api/products — admin only
export async function POST(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const body = await request.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const productData = { ...parsed.data };

    // Auto-generate slug if not provided
    if (!productData.slug) {
      const baseSlug = slugify(productData.name);
      const existingSlug = await Product.findOne({ slug: baseSlug });
      productData.slug = existingSlug
        ? `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
        : baseSlug;
    }

    // Auto-generate SKU if not provided
    if (!productData.sku) {
      productData.sku = `SKU-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase()}`;
    }

    // Verify category exists
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      return errorResponse("Selected category does not exist", 400);
    }

    const product = await Product.create(productData);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return errorResponse("Failed to create product", 500);
  }
}
