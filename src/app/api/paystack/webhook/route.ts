import { isValidSignature, verifyTransaction } from "@/lib/paystack";
import { mongoConfigured } from "@/lib/mongodb";
import { applyTransaction } from "@/lib/registrations";
// Paystack posts payment events here (set the URL in Paystack → Settings →
// API Keys & Webhooks). Each event is signed with the secret key; we also
// re-verify the transaction with Paystack rather than trusting the payload.
export async function POST(request: Request) {
  const raw = await request.text();
  if (!isValidSignature(raw, request.headers.get("x-paystack-signature")))
    return new Response("Invalid signature", { status: 401 });
  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }
  if (!mongoConfigured())
    return new Response("Not configured", { status: 503 });
  if (event.event === "charge.success" && event.data?.reference) {
    try {
      const tx = await verifyTransaction(event.data.reference);
      await applyTransaction(tx, "webhook");
    } catch (error) {
      console.error(
        "Webhook processing failed:",
        error instanceof Error ? error.message : error,
      );
      // A non-2xx status makes Paystack retry the event later.
      return new Response("Retry later", { status: 500 });
    }
  }
  // Acknowledge other events (subscription.create, invoice.*, …) so Paystack
  // doesn't keep retrying them.
  return new Response("OK", { status: 200 });
}
