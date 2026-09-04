import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAdmin, errorResponse } from "@/lib/api-helpers";

// GET /api/admin/users — list users with search and pagination
export async function GET(request: NextRequest) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "15")));
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (role && role !== "all") filter.role = role;
    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}

// PATCH /api/admin/users — change user role
export async function PATCH(request: NextRequest) {
  try {
    const { user: currentUser, errorResponse: authError } = await requireAdmin();
    if (authError || !currentUser) return authError;

    await connectDB();
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !["user", "admin"].includes(role)) {
      return errorResponse("Valid userId and role ('user' | 'admin') are required", 400);
    }

    // Prevent removing own admin role
    if (userId === currentUser.id && role !== "admin") {
      return errorResponse("Cannot demote your own admin account", 400);
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updated) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      data: updated,
    });
  } catch (error) {
    console.error("Admin user PATCH error:", error);
    return errorResponse("Internal server error", 500);
  }
}
