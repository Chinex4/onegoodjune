import { test } from "node:test";
import assert from "node:assert/strict";
import {
  welcomeEmail,
  bookingUrl,
  spotlightFormUrl,
} from "../src/lib/email/template";
import { smtpSettings } from "../src/lib/email/smtp";
import copy from "../src/content/client-email-revisions.json";

test("all paid program variants get the correct supplied message and plain-text alternative", () => {
  for (const [program, index, start, end] of [
    ["sog-riser", 2, 4, 11],
    ["sog-builder", 2, 4, 11],
    ["sog-visionary", 2, 4, 11],
    ["fiction-waitlist", 12, 14, 22],
    ["author-consultation", 26, 28, 34],
    ["spotlight-basic", 35, 37, 43],
    ["spotlight-standard", 35, 37, 43],
    ["spotlight-elite", 35, 37, 43],
  ] as const) {
    const email = welcomeEmail(program, "Ada");
    assert.equal(
      email.subject,
      copy[index].replace(/^Subject(?: Line)?:\s*/, "").trim(),
    );
    for (const paragraph of copy.slice(start, end))
      assert(email.text.includes(paragraph));
    assert(email.html.includes('role="presentation"'));
    assert(email.text.includes("Dear Ada,"));
    assert(!email.html.includes("Flow:"));
  }
});
test("untrusted names cannot inject HTML and action links use the supplied destinations", () => {
  const message = welcomeEmail(
    "author-consultation",
    '<img src=x onerror="alert(1)">',
  );
  assert(!message.html.includes("<img src=x"));
  assert(message.html.includes("&lt;img"));
  assert(message.html.includes(bookingUrl));
  assert(
    welcomeEmail("spotlight-elite", "").html.includes(
      spotlightFormUrl.replaceAll("&", "&amp;"),
    ),
  );
  assert(welcomeEmail("spotlight-basic", "").text.includes("Dear Author,"));
  assert.throws(() => welcomeEmail("unknown", "Ada"));
});
test("SMTP fails closed without credentials, requires TLS, and validates sender and port", () => {
  const keys = [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM_EMAIL",
    "SMTP_PORT",
    "SMTP_REPLY_TO",
  ];
  const previous = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  try {
    keys.forEach((k) => delete process.env[k]);
    assert.throws(smtpSettings, /not configured/);
    Object.assign(process.env, {
      SMTP_HOST: "smtp.example.com",
      SMTP_USER: "test",
      SMTP_PASSWORD: "not-a-real-password",
      SMTP_FROM_EMAIL: "sayhi@example.com",
    });
    assert.equal(smtpSettings().requireTLS, true);
    process.env.SMTP_PORT = "465";
    assert.equal(smtpSettings().secure, true);
    process.env.SMTP_PORT = "25";
    assert.throws(smtpSettings);
    process.env.SMTP_PORT = "587";
    process.env.SMTP_FROM_EMAIL = "bad\r\nBcc: other@example.com";
    assert.throws(smtpSettings);
  } finally {
    keys.forEach((k) => {
      if (previous[k] === undefined) delete process.env[k];
      else process.env[k] = previous[k];
    });
  }
});
