import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";
import { errorResponse, formatZodError } from "@/lib/api-helpers";
import { couponValidateSchema } from "@/lib/validations";
import { ensureSeedCoupons } from "@/lib/coupon-seed";

// POST /api/coupons/validate — Validate coupon and calculate discount
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await ensureSeedCoupons();

    const body = await request.json();
    const parsed = couponValidateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const { code, subtotal } = parsed.data;

    // Optional user session
    const session = await auth();
    const userId = session?.user?.id;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, valid: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    const now = new Date();

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, valid: false, error: "This coupon is currently inactive" },
        { status: 400 }
      );
    }

    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json(
        { success: false, valid: false, error: "This coupon promotion has not started yet" },
        { status: 400 }
      );
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return NextResponse.json(
        { success: false, valid: false, error: "This coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, valid: false, error: "This coupon has reached its maximum redemption limit" },
        { status: 400 }
      );
    }

    if (userId && coupon.userLimit) {
      const userUsage = coupon.usedBy?.find(
        (u) => u.user && u.user.toString() === userId
      );
      if (userUsage && userUsage.count >= coupon.userLimit) {
        return NextResponse.json(
          {
            success: false,
            valid: false,
            error: `You have already redeemed this coupon the maximum allowed times (${coupon.userLimit})`,
          },
          { status: 400 }
        );
      }
    }

    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
      const diff = coupon.minOrderAmount - subtotal;
      return NextResponse.json(
        {
          success: false,
          valid: false,
          error: `Minimum order of ৳${coupon.minOrderAmount.toLocaleString()} required. Add ৳${diff.toLocaleString()} more to apply this coupon.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      message: `Coupon "${coupon.code}" applied! You save ৳${discountAmount.toLocaleString()}`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return errorResponse("Failed to validate coupon", 500);
  }
}
