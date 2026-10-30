import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { MongoMemoryServer } from "mongodb-memory-server";
import { registrationSchema } from "../src/lib/registration-schema";
import { getProgram, programs } from "../src/lib/programs";
import type { PaystackTransaction } from "../src/lib/paystack";

let mongo: MongoMemoryServer;
before(async () => {
  // A busy machine (dev server, builds) can take longer than the 10s default.
  mongo = await MongoMemoryServer.create({
    instance: { launchTimeout: 60000 },
  });
  process.env.MONGODB_URI = mongo.getUri();
  process.env.MONGODB_DB = "ogj-test";
  process.env.PAYSTACK_SECRET_KEY = "sk_test_unit";
  process.env.ADMIN_SESSION_SECRET = "x".repeat(40);
  process.env.ADMIN_PASSWORD = "correct horse";
});
after(async () => {
  const { getDb } = await import("../src/lib/mongodb");
  await (await getDb()).client.close();
  await mongo.stop();
});
const input = {
  name: "Ada Obi",
  email: "Ada@Example.com",
  phone: "+234 801 234 5678",
  program: "sog-riser",
};
const tx = (
  reference: string,
  overrides: Partial<PaystackTransaction> = {},
): PaystackTransaction => ({
  id: 1,
  reference,
  status: "success",
  amount: getProgram("sog-riser")!.amount,
  currency: "NGN",
  channel: "card",
  paid_at: "2026-10-30T10:00:00.000Z",
  customer: { email: "ada@example.com", customer_code: "CUS_1" },
  ...overrides,
});

test("prices match the sales copy and are charged in kobo", () => {
  assert.deepEqual(
    programs.map((p) => [p.id, p.amount / 100]),
    [
      ["sog-riser", 12500],
      ["sog-builder", 75000],
      ["sog-visionary", 55000],
      ["fiction-waitlist", 27500],
      ["author-consultation", 101250],
      ["spotlight-basic", 25000],
      ["spotlight-standard", 35000],
      ["spotlight-elite", 52000],
    ],
  );
});
test("Launch Spotlight requires the book title; other programs don't", () => {
  const spotlight = { ...input, program: "spotlight-basic" };
  const missing = registrationSchema.safeParse(spotlight);
  assert.equal(missing.success, false);
  assert.deepEqual(Object.keys(missing.error!.flatten().fieldErrors), [
    "bookTitle",
  ]);
  assert.equal(
    registrationSchema.safeParse({ ...spotlight, bookTitle: "Rain Season" })
      .success,
    true,
  );
  assert.equal(
    registrationSchema.safeParse({ ...input, program: "author-consultation" })
      .success,
    true,
  );
});
test("event registration closes at the start time or when editors close it", async () => {
  const { registrationIsOpen } = await import("../src/lib/event-registrations");
  const now = Date.parse("2026-10-30T12:00:00Z");
  assert.equal(
    registrationIsOpen({ startsAt: "2026-11-01T19:00:00Z" }, now),
    true,
  );
  assert.equal(
    registrationIsOpen({ startsAt: "2026-10-23T19:00:00Z" }, now),
    false,
  );
  assert.equal(
    registrationIsOpen(
      { startsAt: "2026-11-01T19:00:00Z", registrationOpen: false },
      now,
    ),
    false,
  );
});
test("registration form requires name, email, phone and a known program", () => {
  assert.equal(registrationSchema.safeParse(input).success, true);
  const bad = registrationSchema.safeParse({
    name: "A",
    email: "nope",
    phone: "12",
    program: "free-stuff",
  });
  assert.equal(bad.success, false);
  assert.deepEqual(Object.keys(bad.error!.flatten().fieldErrors).sort(), [
    "email",
    "name",
    "phone",
    "program",
  ]);
});
test("webhook signatures are HMAC-SHA512 of the raw body", async () => {
  const { isValidSignature } = await import("../src/lib/paystack");
  const body = JSON.stringify({ event: "charge.success" });
  const signature = crypto
    .createHmac("sha512", "sk_test_unit")
    .update(body)
    .digest("hex");
  assert.equal(isValidSignature(body, signature), true);
  assert.equal(isValidSignature(body + " ", signature), false);
  assert.equal(isValidSignature(body, null), false);
  assert.equal(isValidSignature(body, "abc"), false);
});
test("a verified payment marks the registration paid and is idempotent", async () => {
  const { createRegistration, applyTransaction, findRegistration } =
    await import("../src/lib/registrations");
  const program = getProgram("sog-riser")!;
  const reg = await createRegistration(
    registrationSchema.parse(input),
    program,
  );
  assert.equal(reg.status, "pending");
  assert.equal(reg.email, "ada@example.com");
  await applyTransaction(tx(reg.reference), "callback");
  await applyTransaction(tx(reg.reference), "webhook");
  // A late "abandoned" verify must never undo a successful payment.
  await applyTransaction(
    tx(reg.reference, { status: "abandoned" }),
    "callback",
  );
  const saved = await findRegistration(reg.reference);
  assert.equal(saved?.status, "paid");
  assert.equal(saved?.paidAt?.toISOString(), "2026-10-30T10:00:00.000Z");
});
test("an underpaid transaction is recorded as failed, not paid", async () => {
  const { createRegistration, applyTransaction } =
    await import("../src/lib/registrations");
  const reg = await createRegistration(
    registrationSchema.parse(input),
    getProgram("sog-riser")!,
  );
  const saved = await applyTransaction(
    tx(reg.reference, { amount: 100 }),
    "webhook",
  );
  assert.equal(saved?.status, "failed");
});
test("admin sessions expire and reject tampering", async () => {
  const { createSessionToken, isValidSessionToken, passwordMatches } =
    await import("../src/lib/admin-auth");
  const now = Date.now();
  const token = createSessionToken(now);
  assert.equal(isValidSessionToken(token, now + 1000), true);
  assert.equal(isValidSessionToken(token, now + 13 * 3600 * 1000), false);
  assert.equal(isValidSessionToken(token.replace(/.$/, "0"), now), false);
  assert.equal(passwordMatches("correct horse"), true);
  assert.equal(passwordMatches("wrong"), false);
});
