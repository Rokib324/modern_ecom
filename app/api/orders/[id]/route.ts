import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireAuth, requireAdmin, errorResponse, formatZodError } from "@/lib/api-helpers";
import { orderStatusSchema } from "@/lib/validations";

// GET /api/orders/[id] — retrieve single order
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const { id } = await params;

    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const order = await Order.findOne({
      $or: [{ _id: isMongoId ? id : null }, { orderId: id }],
    })
      .populate("user", "name email image")
      .lean();

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    // Access control: customer can only access their own order, admin can access any
    if (order.user._id.toString() !== user.id && user.role !== "admin") {
      return errorResponse("Forbidden: You do not have access to this order", 403);
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order GET error:", error);
    return errorResponse("Internal server error", 500);
  }
}

// PATCH /api/orders/[id] — admin update order status and fulfillment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse: authError } = await requireAdmin();
    if (authError) return authError;

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const order = await Order.findOne({
      $or: [{ _id: isMongoId ? id : null }, { orderId: id }],
    });

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    const previousStatus = order.status;
    const newStatus = parsed.data.status;

    // Handle cancellation: restore inventory if previous status was not already cancelled/refunded
    if (
      (newStatus === "cancelled" || newStatus === "refunded") &&
      previousStatus !== "cancelled" &&
      previousStatus !== "refunded"
    ) {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    // Handle reactivation if was cancelled but now reverted to active
    if (
      (previousStatus === "cancelled" || previousStatus === "refunded") &&
      newStatus !== "cancelled" &&
      newStatus !== "refunded"
    ) {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    order.status = newStatus;

    if (parsed.data.trackingNumber !== undefined) {
      order.trackingNumber = parsed.data.trackingNumber;
    }

    if (parsed.data.isPaid !== undefined) {
      order.isPaid = parsed.data.isPaid;
      if (parsed.data.isPaid && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    if (newStatus === "delivered" && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (parsed.data.notes) {
      order.notes = parsed.data.notes;
    }

    await order.save();

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return errorResponse("Internal server error", 500);
  }
}
