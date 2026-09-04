import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { verifyNagadPayment } from "@/lib/nagad";

// Nagad redirects here after payment
// GET /api/payment/nagad/callback?payment_ref_id=xxx&orderId=xxx&status=Success
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentRefId = searchParams.get("payment_ref_id");
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!paymentRefId || status === "Aborted" || status === "Cancel") {
    return NextResponse.redirect(
      `${appUrl}/checkout/payment?error=payment_cancelled&orderId=${orderId ?? ""}`
    );
  }

  try {
    await connectDB();

    // Verify payment with Nagad
    const verifyResult = await verifyNagadPayment(paymentRefId);

    if (!verifyResult.verified) {
      return NextResponse.redirect(
        `${appUrl}/checkout/payment?error=payment_failed&orderId=${orderId ?? ""}`
      );
    }

    // Find the order
    const order = await Order.findOne({
      $or: [{ nagadOrderId: paymentRefId }, { orderId }],
    });

    if (!order) {
      return NextResponse.redirect(`${appUrl}/checkout/payment?error=order_not_found`);
    }

    // Mark as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "processing";
    order.paymentResult = {
      id: paymentRefId,
      status: verifyResult.status,
      transactionId: verifyResult.transactionId,
      updateTime: new Date().toISOString(),
    };
    await order.save();

    return NextResponse.redirect(
      `${appUrl}/checkout/success?orderId=${order.orderId}&method=nagad&trxId=${verifyResult.transactionId}`
    );
  } catch (error) {
    console.error("Nagad callback error:", error);
    return NextResponse.redirect(
      `${appUrl}/checkout/payment?error=server_error&orderId=${orderId ?? ""}`
    );
  }
}
