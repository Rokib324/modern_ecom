import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { generateOrderId } from "@/lib/utils";
import { createNagadOrder } from "@/lib/nagad";

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

    // Create a pending order
    const order = await Order.create({
      orderId,
      user: session.user.id,
      items,
      shippingAddress,
      paymentMethod: "nagad",
      paymentProvider: "nagad",
      itemsPrice,
      shippingPrice,
      totalPrice,
      currency: "BDT",
      isPaid: false,
      isDelivered: false,
      status: "pending",
    });

    // Build the callback URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/api/payment/nagad/callback`;

    // Create Nagad order
    const nagadResult = await createNagadOrder({
      orderId,
      amount: totalPrice,
      callbackUrl,
    });

    // Save the Nagad order ID
    await Order.findByIdAndUpdate(order._id, {
      nagadOrderId: nagadResult.nagadOrderId,
    });

    return NextResponse.json({
      success: true,
      nagadURL: nagadResult.callBackUrl,
      nagadOrderId: nagadResult.nagadOrderId,
      orderId,
    });
  } catch (error) {
    console.error("Nagad create error:", error);
    return NextResponse.json(
      { success: false, error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
