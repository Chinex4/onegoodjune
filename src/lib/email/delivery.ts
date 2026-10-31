import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/mongodb";
import type { Registration } from "@/lib/registrations";
import { welcomeEmail } from "./template";
import { sendWelcomeMail } from "./smtp";

// The signed, re-verified payment webhook owns delivery. A Mongo lease prevents
// concurrent webhook retries from sending two welcomes. Renewals do not resend.
export async function deliverWelcome(
  reference: string,
  send: typeof sendWelcomeMail = sendWelcomeMail,
) {
  const col = (await getDb()).collection<Registration>("registrations");
  const token = crypto.randomUUID();
  const now = new Date();
  const registration = await col.findOneAndUpdate(
    {
      reference,
      status: "paid",
      "welcomeEmail.sentAt": { $exists: false },
      $or: [
        { "welcomeEmail.leaseUntil": { $exists: false } },
        { "welcomeEmail.leaseUntil": { $lt: now } },
      ],
    },
    {
      $set: {
        "welcomeEmail.token": token,
        "welcomeEmail.leaseUntil": new Date(now.getTime() + 120000),
      },
      $inc: { "welcomeEmail.attempts": 1 },
    },
    { returnDocument: "after" },
  );
  if (!registration) {
    const current = await col.findOne({ reference });
    if (current?.status === "paid" && !current.welcomeEmail?.sentAt)
      throw new Error("Welcome delivery is already in progress; retry later");
    return;
  }
  try {
    const email = welcomeEmail(registration.program, registration.name);
    const messageId = await send({
      ...email,
      to: registration.email,
      messageId: `<welcome-${crypto.createHash("sha256").update(reference).digest("hex")}@onegoodjune.com>`,
    });
    await col.updateOne(
      { reference, "welcomeEmail.token": token },
      {
        $set: {
          "welcomeEmail.sentAt": new Date(),
          "welcomeEmail.messageId": messageId,
        },
        $unset: {
          "welcomeEmail.token": "",
          "welcomeEmail.leaseUntil": "",
          "welcomeEmail.failedAt": "",
        },
      },
    );
  } catch {
    await col.updateOne(
      { reference, "welcomeEmail.token": token },
      {
        $set: { "welcomeEmail.failedAt": new Date() },
        $unset: { "welcomeEmail.token": "", "welcomeEmail.leaseUntil": "" },
      },
    );
    // Never log SMTP passwords, raw provider responses or message content.
    throw new Error(
      "Welcome email delivery failed; retry this payment webhook",
    );
  }
}
