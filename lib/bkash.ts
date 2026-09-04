/**
 * bKash Payment Gateway Utility
 *
 * SIMULATION MODE: When BKASH_SIMULATION=true (or credentials are missing),
 * all functions return simulated responses so the full checkout UI works
 * without real API credentials.
 *
 * Production: Set BKASH_SIMULATION=false and provide real credentials.
 * Docs: https://developer.bka.sh/docs
 */

const BKASH_BASE_URL =
  process.env.BKASH_BASE_URL ||
  "https://tokenized.sandbox.bka.sh/v1.2.0-beta";

const IS_SIMULATION =
  process.env.BKASH_SIMULATION === "true" ||
  !process.env.BKASH_APP_KEY ||
  !process.env.BKASH_APP_SECRET;

// ── Token cache (in-memory, per server instance) ──────────────────────────
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getBkashToken(): Promise<string> {
  if (IS_SIMULATION) return "sim_token_bkash";

  // Return cached token if still valid (expires 1h, refresh 5min early)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const res = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: process.env.BKASH_USERNAME ?? "",
      password: process.env.BKASH_PASSWORD ?? "",
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    }),
  });

  const data = await res.json();
  if (!data.id_token) throw new Error("Failed to get bKash token");

  cachedToken = {
    token: data.id_token,
    expiresAt: Date.now() + 3600 * 1000,
  };
  return data.id_token;
}

export interface BkashCreatePaymentResult {
  paymentID: string;
  bkashURL: string;
  statusCode: string;
  statusMessage: string;
}

export async function createBkashPayment({
  orderId,
  amount,
  callbackUrl,
}: {
  orderId: string;
  amount: number;
  callbackUrl: string;
}): Promise<BkashCreatePaymentResult> {
  if (IS_SIMULATION) {
    // Simulate: redirect to our callback with success params
    const simPaymentId = `SIM-BK-${Date.now()}`;
    return {
      paymentID: simPaymentId,
      bkashURL: `${callbackUrl}?paymentID=${simPaymentId}&status=success&orderId=${orderId}`,
      statusCode: "0000",
      statusMessage: "Successful",
    };
  }

  const token = await getBkashToken();
  const res = await fetch(
    `${BKASH_BASE_URL}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_APP_KEY ?? "",
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: orderId,
        callbackURL: callbackUrl,
        amount: amount.toFixed(2),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderId,
      }),
    }
  );

  const data = await res.json();
  if (data.statusCode !== "0000") {
    throw new Error(`bKash create error: ${data.statusMessage}`);
  }
  return data;
}

export interface BkashExecuteResult {
  paymentID: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  statusCode: string;
  statusMessage: string;
}

export async function executeBkashPayment(
  paymentID: string
): Promise<BkashExecuteResult> {
  if (IS_SIMULATION) {
    return {
      paymentID,
      trxID: `TRX${Date.now()}`,
      transactionStatus: "Completed",
      amount: "0",
      currency: "BDT",
      statusCode: "0000",
      statusMessage: "Successful",
    };
  }

  const token = await getBkashToken();
  const res = await fetch(
    `${BKASH_BASE_URL}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_APP_KEY ?? "",
      },
      body: JSON.stringify({ paymentID }),
    }
  );

  const data = await res.json();
  if (data.statusCode !== "0000") {
    throw new Error(`bKash execute error: ${data.statusMessage}`);
  }
  return data;
}

export async function queryBkashPayment(paymentID: string) {
  if (IS_SIMULATION) return { statusCode: "0000", transactionStatus: "Completed" };

  const token = await getBkashToken();
  const res = await fetch(
    `${BKASH_BASE_URL}/tokenized/checkout/payment/status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_APP_KEY ?? "",
      },
      body: JSON.stringify({ paymentID }),
    }
  );
  return res.json();
}
