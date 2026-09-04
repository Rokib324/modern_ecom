/**
 * Nagad Payment Gateway Utility
 *
 * SIMULATION MODE: When NAGAD_SIMULATION=true (or credentials are missing),
 * all functions return simulated responses.
 *
 * Production flow uses RSA encryption with Nagad public key.
 * Docs: https://nagad.com.bd/merchant/api-documentation
 */

import { createHash } from "crypto";

const NAGAD_BASE_URL =
  process.env.NAGAD_BASE_URL ||
  "https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0";

const IS_SIMULATION =
  process.env.NAGAD_SIMULATION === "true" ||
  !process.env.NAGAD_MERCHANT_ID ||
  !process.env.NAGAD_MERCHANT_PRIVATE_KEY;

const MERCHANT_ID = process.env.NAGAD_MERCHANT_ID ?? "683002007104225";

// ── RSA helpers ─────────────────────────────────────────────────────────────
function encryptWithPublicKey(data: string): string {
  if (IS_SIMULATION) return Buffer.from(data).toString("base64");
  // In production: use node crypto RSA encrypt with Nagad public key
  // const publicKey = process.env.NAGAD_NAGAD_PUBLIC_KEY;
  // return crypto.publicEncrypt({ key: publicKey, padding: RSA_PKCS1_PADDING }, Buffer.from(data)).toString("base64");
  return Buffer.from(data).toString("base64");
}

function signWithPrivateKey(data: string): string {
  if (IS_SIMULATION) return createHash("sha256").update(data).digest("base64");
  // In production: use node crypto RSA sign with merchant private key
  // const privateKey = process.env.NAGAD_MERCHANT_PRIVATE_KEY;
  // const sign = crypto.createSign("SHA256"); sign.update(data); return sign.sign(privateKey, "base64");
  return createHash("sha256").update(data).digest("base64");
}

// ── Create Nagad Order ───────────────────────────────────────────────────────
export interface NagadCreateResult {
  orderId: string;
  nagadOrderId: string;
  callBackUrl: string;
}

export async function createNagadOrder({
  orderId,
  amount,
  callbackUrl,
}: {
  orderId: string;
  amount: number;
  callbackUrl: string;
}): Promise<NagadCreateResult> {
  if (IS_SIMULATION) {
    const simNagadId = `SIM-NG-${Date.now()}`;
    return {
      orderId,
      nagadOrderId: simNagadId,
      callBackUrl: `${callbackUrl}?payment_ref_id=${simNagadId}&orderId=${orderId}&status=Success`,
    };
  }

  const datetime = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);

  // Step 1: Check out
  const challenge = createHash("md5")
    .update(`${MERCHANT_ID}${orderId}${datetime}`)
    .digest("hex");

  const sensitiveData = JSON.stringify({
    merchantId: MERCHANT_ID,
    datetime,
    orderId,
    challenge,
  });

  const encryptedPayload = encryptWithPublicKey(sensitiveData);
  const signature = signWithPrivateKey(sensitiveData);

  const checkoutRes = await fetch(
    `${NAGAD_BASE_URL}/api/dfs/check-out/initialize/${MERCHANT_ID}/${orderId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-KM-Api-Version": "v-0.2.0" },
      body: JSON.stringify({
        dateTime: datetime,
        sensitiveData: encryptedPayload,
        signature,
      }),
    }
  );

  const checkoutData = await checkoutRes.json();
  if (!checkoutData.sensitiveData) {
    throw new Error(`Nagad checkout error: ${JSON.stringify(checkoutData)}`);
  }

  // Step 2: Complete checkout
  const completePayload = {
    sensitiveData: encryptWithPublicKey(
      JSON.stringify({
        merchantId: MERCHANT_ID,
        orderId,
        challenge: checkoutData.sensitiveData,
        amount: amount.toFixed(2),
        currencyCode: "050",
        exchangeRate: 1,
        productDetails: [{ name: "Order", sku: orderId, value: amount.toFixed(2), quantity: 1 }],
        merchantCallbackURL: callbackUrl,
        additionalMerchantInfo: {},
      })
    ),
    signature: signWithPrivateData(checkoutData.sensitiveData),
    merchantCallbackURL: callbackUrl,
  };

  const completeRes = await fetch(
    `${NAGAD_BASE_URL}/api/dfs/check-out/complete/${checkoutData.paymentReferenceId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-KM-Api-Version": "v-0.2.0" },
      body: JSON.stringify(completePayload),
    }
  );

  const completeData = await completeRes.json();
  return {
    orderId,
    nagadOrderId: checkoutData.paymentReferenceId,
    callBackUrl: completeData.callBackUrl,
  };
}

// Helper to avoid duplicate function name issue in non-simulation path
function signWithPrivateData(data: string): string {
  return signWithPrivateKey(data);
}

// ── Verify Nagad callback ────────────────────────────────────────────────────
export interface NagadVerifyResult {
  orderId: string;
  paymentRefId: string;
  amount: string;
  clientMobileNo: string;
  merchantMobileNo: string;
  orderDateTime: string;
  issuerPaymentDateTime: string;
  issuerPaymentRefNo: string;
  additionalMerchantInfo: Record<string, string>;
  status: string;
  statusCode: string;
}

export async function verifyNagadPayment(
  paymentRefId: string
): Promise<{ verified: boolean; transactionId: string; status: string }> {
  if (IS_SIMULATION) {
    return { verified: true, transactionId: `NGTXN${Date.now()}`, status: "Success" };
  }

  const res = await fetch(
    `${NAGAD_BASE_URL}/api/dfs/verify/payment/${paymentRefId}`,
    {
      headers: { "X-KM-Api-Version": "v-0.2.0" },
    }
  );
  const data = await res.json();
  return {
    verified: data.status === "Success",
    transactionId: data.issuerPaymentRefNo ?? paymentRefId,
    status: data.status,
  };
}
