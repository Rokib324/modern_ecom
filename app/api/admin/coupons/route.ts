import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";
import { requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { couponSchema } from "@/lib/validations";
import { ensureSeedCoupons } from "@/lib/coupon-seed";

// GET /api/admin/coupons — List with stats & filtering
export async function GET(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    await ensureSeedCoupons();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";
    const discountType = searchParams.get("type") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const now = new Date();

    if (status === "active") {
      filter.isActive = true;
      filter.$and = [
        { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
        { startDate: { $lte: now } },
      ];
    } else if (status === "inactive") {
      filter.isActive = false;
    } else if (status === "expired") {
      filter.expiryDate = { $lt: now };
    }

    if (discountType === "percentage" || discountType === "fixed") {
      filter.discountType = discountType;
    }

    const skip = (page - 1) * limit;

    const [coupons, total, allCoupons] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(filter),
      Coupon.find({}).lean(),
    ]);

    // Aggregate overall stats
    const totalCoupons = allCoupons.length;
    const activeCoupons = allCoupons.filter(
      (c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) >= now)
    ).length;
    const totalRedemptions = allCoupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);

    // Approximate total savings given across all coupons
    const totalDiscountGiven = allCoupons.reduce((acc, c) => {
      if (c.discountType === "fixed") {
        return acc + (c.usedCount || 0) * c.discountValue;
      } else {
        // Average estimate based on min order or standard order size
        const sampleOrder = Math.max(c.minOrderAmount || 0, 1500);
        let disc = (sampleOrder * c.discountValue) / 100;
        if (c.maxDiscountAmount && disc > c.maxDiscountAmount) disc = c.maxDiscountAmount;
        return acc + (c.usedCount || 0) * disc;
      }
    }, 0);

    return NextResponse.json({
      success: true,
      data: coupons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalCoupons,
        activeCoupons,
        totalRedemptions,
        totalDiscountGiven: Math.round(totalDiscountGiven),
      },
    });
  } catch (error) {
    console.error("Admin coupons GET error:", error);
    return errorResponse("Failed to fetch coupons", 500);
  }
}

// POST /api/admin/coupons — Create a new coupon
export async function POST(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const body = await request.json();

    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      usageLimit,
      userLimit,
      isActive,
    } = parsed.data;

    // Check unique code
    const existing = await Coupon.findOne({ code });
    if (existing) {
      return errorResponse(`Coupon code "${code}" already exists`, 409);
    }

    const newCoupon = await Coupon.create({
      code,
      description: description || undefined,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount ?? 0,
      maxDiscountAmount: maxDiscountAmount ?? null,
      startDate: startDate ? new Date(startDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ?? null,
      userLimit: userLimit ?? 1,
      isActive: isActive !== undefined ? isActive : true,
      usedCount: 0,
      usedBy: [],
    });

    return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
  } catch (error) {
    console.error("Admin coupon POST error:", error);
    return errorResponse("Failed to create coupon", 500);
  }
}
