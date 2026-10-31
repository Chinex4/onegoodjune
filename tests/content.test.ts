import { test } from "node:test";
import assert from "node:assert/strict";
import { getCountdown, COURSE_LAUNCH } from "../src/lib/countdown";
import { contactSchema } from "../src/lib/contact-schema";
import {
  about,
  policySections,
  policyLines,
  submissionLines,
  course,
} from "../src/content/pages";
import source from "../src/content/source-copy.json";
test("the launch uses one Lagos instant and completes without negative time", () => {
  const launch = Date.parse(COURSE_LAUNCH);
  assert.equal(new Date(launch).toISOString(), "2027-01-14T23:00:00.000Z");
  assert.deepEqual(getCountdown(launch - 90061000), {
    complete: false,
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });
  for (const now of [launch, launch + 1000000])
    assert.deepEqual(getCountdown(now), {
      complete: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
});
test("all privacy wording is preserved in all 14 sections", () => {
  assert.equal(policySections.length, 14);
  assert.deepEqual(
    policySections.flatMap((s) => [s.title, ...s.paragraphs]),
    policyLines,
  );
  assert.equal(
    source[source.indexOf("PRIVACY POLICY PAGE") + 2],
    "ONEGOODJUNE · Effective Oct 19, 2026",
  );
});
test("all four supplied team members and course modules are present", () => {
  assert.equal(about.team.length, 4);
  for (const person of about.team) {
    assert(source.includes(person.name));
    assert(source.includes(person.description));
  }
  assert.equal(course.modules.length, 14);
  assert(submissionLines.some((s) => s.includes("500 to 3,000 words")));
});
const valid = {
  firstName: "Ada",
  lastName: "Obi",
  email: "ada@example.com",
  inquiryType: "Programs",
  message: "I would like more information.",
  website: "",
};
test("contact validation rejects malformed email, types, header injection and oversize messages", () => {
  assert(contactSchema.safeParse(valid).success);
  for (const change of [
    { email: "not-email" },
    { firstName: "Ada\r\nBcc: x" },
    { inquiryType: "Billing" },
    { message: "a" },
    { message: "x".repeat(5001) },
    { lastName: "" },
  ])
    assert(!contactSchema.safeParse({ ...valid, ...change }).success);
});
