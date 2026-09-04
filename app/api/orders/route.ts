import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderId } from "@/lib/utils";
import { requireAuth, errorResponse, formatZodError } from "@/lib/api-helpers";
import { orderCreateSchema } from "@/lib/validations";

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const { session, user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10")));
    const status = searchParams.get("status");
    const isPaid = searchParams.get("isPaid");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (user.role === "admin") {
      if (status && status !== "all") filter.status = status;
      if (isPaid === "true") filter.isPaid = true;
      if (isPaid === "false") filter.isPaid = false;
      if (search && search.trim()) {
        filter.$or = [
          { orderId: { $regex: search.trim(), $options: "i" } },
          { "shippingAddress.phone": { $regex: search.trim(), $options: "i" } },
          { "shippingAddress.fullName": { $regex: search.trim(), $options: "i" } },
        ];
      }
    } else {
      // Regular customer only views their own orders
      filter.user = user.id;
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return errorResponse("Failed to fetch orders", 500);
  }
}

// POST /api/orders — create order with server price verification & inventory reservation
export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const body = await request.json();

    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const { items: cartItems, shippingAddress, paymentMethod, notes } = parsed.data;

    // 1. Fetch products from DB & recalculate exact prices + verify stock
    const validatedItems = [];
    let itemsPrice = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return errorResponse(`Product not found or currently unavailable: ${item.product}`, 400);
      }

      if (product.stock < item.quantity) {
        return errorResponse(
          `Insufficient stock for "${product.name}". Available stock: ${product.stock}`,
          400
        );
      }

      const itemTotalPrice = product.price * item.quantity;
      itemsPrice += itemTotalPrice;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "/images/placeholder.jpg",
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 2. Calculate Bangladesh shipping: ৳70 within Dhaka, ৳130 outside Dhaka. Free over ৳5000.
    let shippingPrice = 130;
    if (shippingAddress.division.trim().toLowerCase() === "dhaka") {
      shippingPrice = 70;
    }
    if (itemsPrice >= 5000) {
      shippingPrice = 0;
    }

    const totalPrice = itemsPrice + shippingPrice;

    // 3. Atomically decrement stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 4. Create Order
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      user: user.id,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      currency: "BDT",
      status: "pending",
      isPaid: false,
      notes,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return errorResponse("Failed to create order", 500);
  }
}
