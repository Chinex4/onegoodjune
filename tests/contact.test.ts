import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/contact/route";
const originalFetch = globalThis.fetch;
const valid = {
  firstName: "Ada",
  lastName: "Obi",
  email: "ada@example.com",
  inquiryType: "Programs",
  message: "Please send program information.",
  website: "",
};
function request(data: unknown, origin = "https://onegoodjune.com") {
  return new Request("https://onegoodjune.com/api/contact", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
beforeEach(() => {
  Object.assign(process.env, {
    NODE_ENV: "production",
    RESEND_API_KEY: "",
    CONTACT_FROM_EMAIL: "",
    CONTACT_TO_EMAIL: "",
    UPSTASH_REDIS_REST_URL: "",
    UPSTASH_REDIS_REST_TOKEN: "",
    CONTACT_TRUST_PROXY: "false",
  });
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});
test("rejects cross-origin, invalid fields, wrong content types and oversized bodies", async () => {
  assert.equal(
    (await POST(request(valid, "https://other.example"))).status,
    403,
  );
  assert.equal((await POST(request({ ...valid, email: "wrong" }))).status, 400);
  assert.equal(
    (
      await POST(
        new Request("https://onegoodjune.com/api/contact", {
          method: "POST",
          headers: {
            Origin: "https://onegoodjune.com",
            "Content-Type": "text/plain",
          },
          body: "invalid",
        }),
      )
    ).status,
    415,
  );
  assert.equal(
    (await POST(request({ ...valid, message: "x".repeat(25000) }))).status,
    413,
  );
});
test("production fails closed without a shared limiter and does not claim email delivery", async () => {
  const r = await POST(request(valid));
  assert.equal(r.status, 503);
  assert((await r.json()).message.includes("temporarily unavailable"));
});
test("rate-limits repeated requests using the shared provider", async () => {
  Object.assign(process.env, {
    UPSTASH_REDIS_REST_URL: "https://limiter.invalid",
    UPSTASH_REDIS_REST_TOKEN: "test-only",
  });
  globalThis.fetch = async () => Response.json({ result: 6 });
  const r = await POST(request(valid));
  assert.equal(r.status, 429);
  assert.equal(r.headers.get("retry-after"), "900");
});
test("successful delivery, provider failures and bot trap behave correctly (mocked providers)", async () => {
  Object.assign(process.env, {
    UPSTASH_REDIS_REST_URL: "https://limiter.invalid",
    UPSTASH_REDIS_REST_TOKEN: "test-only",
    RESEND_API_KEY: "re_test_only",
    CONTACT_FROM_EMAIL: "ONEGOODJUNE <sender@example.com>",
    CONTACT_TO_EMAIL: "inbox@example.com",
  });
  let emailCalls = 0;
  let fail = false;
  globalThis.fetch = async (url, options) => {
    if (String(url).includes("limiter.invalid"))
      return Response.json({ result: 1 });
    assert(String(url).startsWith("https://api.resend.com"));
    emailCalls++;
    const payload = JSON.parse(String(options?.body));
    assert.equal(payload.reply_to, "ada@example.com");
    assert(payload.text.includes(valid.message));
    return fail
      ? Response.json(
          { name: "validation_error", message: "test failure" },
          { status: 422 },
        )
      : Response.json({ id: "mock-email" });
  };
  assert.equal((await POST(request(valid))).status, 200);
  fail = true;
  assert.equal((await POST(request(valid))).status, 502);
  const count = emailCalls;
  assert.equal(
    (await POST(request({ ...valid, website: "spam.example" }))).status,
    200,
  );
  assert.equal(emailCalls, count);
});

test("valid long Unicode messages fit the byte limit", async () => {
  const r = await POST(request({ ...valid, message: "文".repeat(5000) }));
  assert.equal(r.status, 503);
});
