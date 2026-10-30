import "server-only";
import crypto from "node:crypto";
// Paystack's REST API: https://paystack.com/docs/api/
const API = "https://api.paystack.co";
export class PaystackError extends Error {}
function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new PaystackError("PAYSTACK_SECRET_KEY is not set");
  return key;
}
async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const body = (await response.json().catch(() => ({}))) as {
    status?: boolean;
    message?: string;
    data?: T;
  };
  if (!response.ok || !body.status || !body.data)
    throw new PaystackError(
      body.message || `Paystack error ${response.status}`,
    );
  return body.data;
}
export type PaystackTransaction = {
  id: number;
  reference: string;
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
  customer?: { email?: string; customer_code?: string };
  plan?: string | { plan_code?: string } | null;
  metadata?: Record<string, unknown> | string | null;
};
export function initializeTransaction(input: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  plan?: string;
  metadata: Record<string, unknown>;
}) {
  return call<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      ...(input.plan && { plan: input.plan }),
    }),
  });
}
export function verifyTransaction(reference: string) {
  return call<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}
// Webhooks are signed with HMAC-SHA512 of the raw body using the secret key.
export function isValidSignature(
  rawBody: string,
  signature: string | null,
  key = secretKey(),
) {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha512", key)
    .update(rawBody)
    .digest("hex");
  return (
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}
