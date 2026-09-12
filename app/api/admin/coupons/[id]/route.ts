import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";
import { requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { couponUpdateSchema } from "@/lib/validations";

// GET /api/admin/coupons/[id] — Retrieve single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    await connectDB();

    const coupon = await Coupon.findById(id).lean();
    if (!coupon) {
      return errorResponse("Coupon not found", 404);
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error("Admin coupon GET [id] error:", error);
    return errorResponse("Failed to fetch coupon", 500);
  }
}

// PUT /api/admin/coupons/[id] — Update coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const parsed = couponUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return errorResponse("Coupon not found", 404);
    }

    const updates = parsed.data;

    // Check code uniqueness if changing code
    if (updates.code && updates.code !== coupon.code) {
      const existing = await Coupon.findOne({
        code: updates.code,
        _id: { $ne: id },
      });
      if (existing) {
        return errorResponse(`Coupon code "${updates.code}" is already in use`, 409);
      }
      coupon.code = updates.code;
    }

    if (updates.description !== undefined) coupon.description = updates.description;
    if (updates.discountType !== undefined) coupon.discountType = updates.discountType;
    if (updates.discountValue !== undefined) coupon.discountValue = updates.discountValue;
    if (updates.minOrderAmount !== undefined) coupon.minOrderAmount = updates.minOrderAmount;
    if (updates.maxDiscountAmount !== undefined) coupon.maxDiscountAmount = updates.maxDiscountAmount;
    if (updates.startDate !== undefined) coupon.startDate = new Date(updates.startDate);
    if (updates.expiryDate !== undefined) {
      coupon.expiryDate = updates.expiryDate ? new Date(updates.expiryDate) : null;
    }
    if (updates.usageLimit !== undefined) coupon.usageLimit = updates.usageLimit;
    if (updates.userLimit !== undefined) coupon.userLimit = updates.userLimit;
    if (updates.isActive !== undefined) coupon.isActive = updates.isActive;

    await coupon.save();

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error("Admin coupon PUT [id] error:", error);
    return errorResponse("Failed to update coupon", 500);
  }
}

// DELETE /api/admin/coupons/[id] — Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    await connectDB();

    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return errorResponse("Coupon not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: `Coupon "${deleted.code}" successfully deleted`,
    });
  } catch (error) {
    console.error("Admin coupon DELETE [id] error:", error);
    return errorResponse("Failed to delete coupon", 500);
  }
}
