import "server-only";
import crypto from "node:crypto";
import type { Filter } from "mongodb";
import { getDb } from "./mongodb";
import { getProgram, type Program } from "./programs";
import type { PaystackTransaction } from "./paystack";
import type { RegistrationInput } from "./registration-schema";

export type PaymentStatus = "pending" | "paid" | "failed" | "abandoned";
export type Registration = {
  reference: string;
  program: string;
  programName: string;
  name: string;
  email: string;
  phone: string;
  bookTitle?: string;
  releaseDate?: string;
  amount: number;
  currency: "NGN";
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  paystack?: {
    accessCode?: string;
    transactionId?: number;
    channel?: string;
    customerCode?: string;
    plan?: string;
  };
};
export type Payment = {
  reference: string;
  registrationReference?: string;
  email?: string;
  amount: number;
  currency: string;
  status: string;
  plan?: string;
  paidAt?: Date;
  receivedAt: Date;
  source: "callback" | "webhook";
};
const registrations = async () =>
  (await getDb()).collection<Registration>("registrations");
const payments = async () => (await getDb()).collection<Payment>("payments");

export function newReference(program: Program) {
  return `OGJ-${program.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}
export async function createRegistration(
  input: RegistrationInput,
  program: Program,
) {
  const now = new Date();
  const doc: Registration = {
    reference: newReference(program),
    program: program.id,
    programName: program.name,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    ...(input.bookTitle && { bookTitle: input.bookTitle }),
    ...(input.releaseDate && { releaseDate: input.releaseDate }),
    amount: program.amount,
    currency: "NGN",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  await (await registrations()).insertOne(doc);
  return doc;
}
export async function attachCheckout(reference: string, accessCode: string) {
  await (
    await registrations()
  ).updateOne(
    { reference },
    { $set: { "paystack.accessCode": accessCode, updatedAt: new Date() } },
  );
}
const planCode = (tx: PaystackTransaction) =>
  typeof tx.plan === "string" ? tx.plan : tx.plan?.plan_code || undefined;
// Applies a Paystack-verified transaction. Safe to call more than once for the
// same reference (callback and webhook both arrive for every payment).
export async function applyTransaction(
  tx: PaystackTransaction,
  source: Payment["source"],
) {
  const col = await registrations();
  const registration = await col.findOne({ reference: tx.reference });
  const plan = planCode(tx);
  // Subscription renewals arrive with new references; link them by email + plan.
  const owner =
    registration ??
    (plan && tx.customer?.email
      ? await col.findOne(
          { email: tx.customer.email.toLowerCase(), "paystack.plan": plan },
          { sort: { createdAt: -1 } },
        )
      : null);
  const program = owner ? getProgram(owner.program) : undefined;
  // Without a plan the amount must match exactly; plans set their own amount.
  const amountOk =
    !program ||
    !!plan ||
    (tx.amount === program.amount && tx.currency === "NGN");
  const paid = tx.status === "success" && amountOk;
  await (
    await payments()
  ).updateOne(
    { reference: tx.reference },
    {
      $set: {
        registrationReference: owner?.reference,
        email: tx.customer?.email,
        amount: tx.amount,
        currency: tx.currency,
        status: paid ? "success" : tx.status,
        plan,
        paidAt: tx.paid_at ? new Date(tx.paid_at) : undefined,
        source,
      },
      $setOnInsert: { receivedAt: new Date() },
    },
    { upsert: true },
  );
  if (!registration) return owner;
  const status: PaymentStatus = paid
    ? "paid"
    : tx.status === "failed" || (tx.status === "success" && !amountOk)
      ? "failed"
      : tx.status === "abandoned"
        ? "abandoned"
        : "pending";
  // Never downgrade a registration that has already been paid.
  if (registration.status === "paid" && status !== "paid") return registration;
  const update = {
    status,
    updatedAt: new Date(),
    ...(paid && { paidAt: tx.paid_at ? new Date(tx.paid_at) : new Date() }),
    "paystack.transactionId": tx.id,
    "paystack.channel": tx.channel,
    "paystack.customerCode": tx.customer?.customer_code,
    ...(plan && { "paystack.plan": plan }),
  };
  return col.findOneAndUpdate(
    { reference: tx.reference },
    { $set: update },
    { returnDocument: "after" },
  );
}
export async function findRegistration(reference: string) {
  return (await registrations()).findOne({ reference });
}
export async function listRegistrations(filters: {
  program?: string;
  status?: string;
  q?: string;
}) {
  const query: Filter<Registration> = {};
  if (filters.program) query.program = filters.program;
  if (filters.status) query.status = filters.status as PaymentStatus;
  if (filters.q) {
    const pattern = new RegExp(
      filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    query.$or = [
      { name: pattern },
      { email: pattern },
      { phone: pattern },
      { reference: pattern },
    ];
  }
  return (await registrations())
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(1000)
    .toArray();
}
export async function registrationStats() {
  return (await registrations())
    .aggregate<{
      _id: { program: string; status: PaymentStatus };
      count: number;
      amount: number;
    }>([
      {
        $group: {
          _id: { program: "$program", status: "$status" },
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ])
    .toArray();
}
