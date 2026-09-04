import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAuth, errorResponse, formatZodError } from "@/lib/api-helpers";
import { changePasswordSchema } from "@/lib/validations";

// POST /api/user/change-password
export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const body = await request.json();

    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const { currentPassword, newPassword } = parsed.data;

    const dbUser = await User.findById(user.id).select("+password");
    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    if (!dbUser.password) {
      // User signed up with Google/social OAuth
      dbUser.password = newPassword;
      await dbUser.save();
      return NextResponse.json({
        success: true,
        message: "Password created successfully",
      });
    }

    const isValid = await dbUser.comparePassword(currentPassword);
    if (!isValid) {
      return errorResponse("Incorrect current password", 400);
    }

    dbUser.password = newPassword;
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return errorResponse("Internal server error", 500);
  }
}
