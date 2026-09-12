import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";
import { requireAdmin, errorResponse } from "@/lib/api-helpers";

// PATCH /api/admin/coupons/[id]/status — Quick toggle active state
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    await connectDB();

    const body = await request.json();
    if (typeof body.isActive !== "boolean") {
      return errorResponse("isActive boolean field is required", 400);
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isActive: body.isActive },
      { new: true }
    );

    if (!coupon) {
      return errorResponse("Coupon not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: { id: coupon._id, code: coupon.code, isActive: coupon.isActive },
    });
  } catch (error) {
    console.error("Admin coupon status PATCH error:", error);
    return errorResponse("Failed to update coupon status", 500);
  }
}
