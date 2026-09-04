import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { executeBkashPayment } from "@/lib/bkash";

// bKash redirects here after user pays (or cancels)
// GET /api/payment/bkash/callback?paymentID=xxx&status=success&orderId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle cancellation / failure
  if (!paymentID || status === "cancel" || status === "failure") {
    return NextResponse.redirect(
      `${appUrl}/checkout/payment?error=payment_cancelled&orderId=${orderId ?? ""}`
    );
  }

  try {
    await connectDB();

    // Execute the payment (verify with bKash)
    const executeResult = await executeBkashPayment(paymentID);

    if (
      executeResult.statusCode !== "0000" ||
      executeResult.transactionStatus !== "Completed"
    ) {
      return NextResponse.redirect(
        `${appUrl}/checkout/payment?error=payment_failed&orderId=${orderId ?? ""}`
      );
    }

    // Find the order by bkashPaymentId or orderId
    const order = await Order.findOne({
      $or: [{ bkashPaymentId: paymentID }, { orderId }],
    });

    if (!order) {
      return NextResponse.redirect(`${appUrl}/checkout/payment?error=order_not_found`);
    }

    // Mark as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "processing";
    order.paymentResult = {
      id: paymentID,
      status: executeResult.transactionStatus,
      transactionId: executeResult.trxID,
      updateTime: new Date().toISOString(),
    };
    await order.save();

    // Redirect to success page
    return NextResponse.redirect(
      `${appUrl}/checkout/success?orderId=${order.orderId}&method=bkash&trxId=${executeResult.trxID}`
    );
  } catch (error) {
    console.error("bKash callback error:", error);
    return NextResponse.redirect(
      `${appUrl}/checkout/payment?error=server_error&orderId=${orderId ?? ""}`
    );
  }
}
