import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { generateOrderId } from "@/lib/utils";
import { createBkashPayment } from "@/lib/bkash";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, itemsPrice, shippingPrice, totalPrice } = body;

    if (!items?.length || !shippingAddress || !totalPrice) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const orderId = generateOrderId();

    const sanitizedItems = (items || []).map((item: {
      product?: string;
      productId?: string;
      id?: string;
      name?: string;
      image?: string;
      price?: number;
      quantity?: number;
    }) => ({
      product: String(item.product || item.productId || item.id || "item"),
      name: item.name || "Product",
      image: item.image || "/images/placeholder.jpg",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    // Create a pending order first
    const order = await Order.create({
      orderId,
      user: session.user.id,
      items: sanitizedItems,
      shippingAddress,
      paymentMethod: "bkash",
      paymentProvider: "bkash",
      itemsPrice,
      shippingPrice,
      totalPrice,
      currency: "BDT",
      isPaid: false,
      isDelivered: false,
      status: "pending",
    });

    // Build the callback URL
    const appUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/api/payment/bkash/callback`;

    // Create bKash payment session
    const bkashResult = await createBkashPayment({
      orderId,
      amount: totalPrice,
      callbackUrl,
    });

    // Save the bKash paymentID to the order for later verification
    await Order.findByIdAndUpdate(order._id, {
      bkashPaymentId: bkashResult.paymentID,
    });

    return NextResponse.json({
      success: true,
      bkashURL: bkashResult.bkashURL,
      paymentID: bkashResult.paymentID,
      orderId,
    });
  } catch (error) {
    console.error("bKash create error:", error);
    return NextResponse.json(
      { success: false, error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
