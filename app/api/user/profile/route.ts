import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { requireAuth, errorResponse, formatZodError } from "@/lib/api-helpers";
import { profileUpdateSchema } from "@/lib/validations";

// GET /api/user/profile — current user profile & stats
export async function GET() {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();

    const dbUser = await User.findById(user.id).select("-password").lean();
    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    // Customer summary stats
    const [totalOrders, orders] = await Promise.all([
      Order.countDocuments({ user: user.id }),
      Order.find({ user: user.id, isPaid: true }).select("totalPrice").lean(),
    ]);

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        ...dbUser,
        stats: {
          totalOrders,
          totalSpent,
        },
      },
    });
  } catch (error) {
    console.error("User profile GET error:", error);
    return errorResponse("Internal server error", 500);
  }
}

// PUT /api/user/profile — update profile & address
export async function PUT(request: NextRequest) {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const body = await request.json();

    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone;
    if (parsed.data.address) updateData.address = parsed.data.address;

    const updatedUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("User profile PUT error:", error);
    return errorResponse("Internal server error", 500);
  }
}
