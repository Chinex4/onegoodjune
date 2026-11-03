import type { Author } from "../src/sanity/types";
import { test } from "node:test";
import assert from "node:assert/strict";
import { heroDate } from "../src/lib/editorial-format";
import { isExampleEvent } from "../src/lib/event-visibility";
import { course, submissionLines, about } from "../src/content/pages";
import { contributorProfile } from "../src/content/contributor-profile";

test("the confirmed design-only event stays private until explicitly confirmed as real", () => {
  const title =
    "Manny, Ada & Sesan Talk Tough on the Untold Woes of Self-publishing in Africa";
  assert(isExampleEvent({ title }));
  assert(isExampleEvent({ title, isExample: null }));
  assert(isExampleEvent({ title: "Another demo", isExample: true }));
  assert(!isExampleEvent({ title, isExample: false }));
  assert(!isExampleEvent({ title: "A genuine future gathering" }));
});
test("hero dates use abbreviated American dates without inventing missing dates", () => {
  assert.equal(heroDate("2026-10-30T10:00:00Z"), "Oct 30, 2026");
  assert.equal(heroDate(undefined), "Date to be confirmed");
  assert.equal(heroDate("invalid"), "Date to be confirmed");
});
test("supplied review copy replaces the old fiction offer and submission instruction", () => {
  assert.equal(course.modules.length, 17);
  assert.equal(course.introduction.length, 3);
  assert.equal(course.outcomes.length, 4);
  assert.equal(course.launchDate, "February 5, 2027.");
  assert(submissionLines.some((x) => x.includes("Submissions – Your Name")));
  assert(!submissionLines.some((x) => x.includes("Creative Ambassador Award")));
  assert(about.team.some((x) => x.name === "Seun Mary-Ann Olabiyi"));
});
test("only the supplied contributor gets the supplied profile; existing photo is retained", () => {
  const author: Author = {
    _id: "one",
    name: "Chidinma Nnalue",
    image: { _type: "editorialImage", alt: "Approved portrait" },
  };
  const profile = contributorProfile(author);
  assert.equal(profile.image, author.image);
  assert(profile.bio?.startsWith("Chidinma Nnalue is a lover of words"));
  assert.equal(profile.links?.length, 3);
  const other = { _id: "two", name: "Other Author" };
  assert.equal(contributorProfile(other), other);
});

test("quarterly Builder is hidden without confirmed configuration and uses exactly four payments", async () => {
  const { builderQuarterly, getProgram } = await import("../src/lib/programs");
  const price = process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA;
  const plan = process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY;
  try {
    delete process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA;
    delete process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY;
    assert.equal(builderQuarterly(), undefined);
    // Test amount only; this is not a proposed client price.
    process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA = "12345";
    assert.equal(builderQuarterly(), undefined);
    process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY = "PLN_testfixture";
    assert.equal(getProgram("sog-builder-quarterly")?.amount, 1234500);
    assert.equal(builderQuarterly()?.billingCycles, 4);
  } finally {
    if (price === undefined)
      delete process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA;
    else process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA = price;
    if (plan === undefined)
      delete process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY;
    else process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY = plan;
  }
});

test("quarterly checkout checks the provider's interval/price and caps charges at four", async () => {
  const { validateQuarterlyPlan, initializeTransaction } =
    await import("../src/lib/paystack");
  const previous = globalThis.fetch;
  const key = process.env.PAYSTACK_SECRET_KEY;
  const requests: { url: string; body?: Record<string, unknown> }[] = [];
  try {
    process.env.PAYSTACK_SECRET_KEY = "sk_test_fixture";
    globalThis.fetch = async (input, init) => {
      requests.push({
        url: String(input),
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      return Response.json({
        status: true,
        data: String(input).includes("/plan/")
          ? { amount: 1234500, currency: "NGN", interval: "quarterly" }
          : {
              authorization_url: "https://checkout.paystack.com/fixture",
              reference: "fixture",
              access_code: "fixture",
            },
      });
    };
    await validateQuarterlyPlan("PLN_fixture", 1234500);
    await assert.rejects(validateQuarterlyPlan("PLN_fixture", 999));
    await initializeTransaction({
      email: "test@example.com",
      amount: 1234500,
      reference: "fixture",
      callbackUrl: "https://example.com/callback",
      plan: "PLN_fixture",
      billingCycles: 4,
      metadata: {},
    });
    assert.equal(requests.at(-1)?.body?.invoice_limit, 4);
  } finally {
    globalThis.fetch = previous;
    if (key === undefined) delete process.env.PAYSTACK_SECRET_KEY;
    else process.env.PAYSTACK_SECRET_KEY = key;
  }
});

test("client dates include a two-digit day and remain in Lagos time", () => {
  assert.equal(heroDate("2026-11-03T09:30:00Z"), "Nov 03, 2026");
  assert.equal(heroDate("2026-11-02T23:30:00Z"), "Nov 03, 2026");
});

test("Spotlight disclosures follow both main and additional categories", async () => {
  const { isSponsored } = await import("../src/lib/sponsored");
  const spotlight = { _id: "spotlight", title: "Spotlight", slug: "spotlight" };
  assert(isSponsored({ category: spotlight }));
  assert(isSponsored({ additionalCategories: [spotlight], sponsored: false }));
  assert(isSponsored({ sponsored: true }));
  assert(!isSponsored({ category: { ...spotlight, slug: "craft" } }));
});

test("updated submission rules preserve submission details and all eighteen supplied terms", async () => {
  const { spotlightTerms } = await import("../src/content/spotlight-terms");
  assert.equal(spotlightTerms.length, 18);
  assert(submissionLines.some(line => line.includes("PDFs will not be accepted")));
  assert(submissionLines.some(line => line.includes("Times New Roman, 12 pt")));
  assert(submissionLines.some(line => line.includes("Chicago Manual of Style")));
  assert(submissionLines.some(line => line.includes("title-byline-year")));
});

test("the supplied creed preserves all four principles", async () => {
  const { reviewContent } = await import("../src/content/pending-review");
  assert.equal(reviewContent.creed.title, "Our Creed");
  assert.equal(reviewContent.creed.subtitle, "Guiding Philosophies");
  assert.equal(reviewContent.creed.principles.length, 4);
  assert.equal(reviewContent.creed.principles[1], "Embrace joyful stewardship rooted in personal consecration, agency, accountability, and consistent action.");
});

test("Builder choices are named clearly and stay together before Visionary", async () => {
  const { enrollmentPrograms } = await import("../src/lib/programs");
  const price = process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA;
  const plan = process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY;
  try {
    process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA = "18750";
    process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY = "PLN_fixture";
    const options = enrollmentPrograms().filter(p => p.group === "school-of-growth");
    assert.deepEqual(options.map(p => p.id), ["sog-riser", "sog-builder", "sog-builder-quarterly", "sog-visionary"]);
    assert.equal(options[1].name, "School of Growth — Builder (Pay Once)");
    assert.equal(options[2].name, "School of Growth — Builder (Pay x4)");
    assert.equal(options[2].period, "every quarter");
    assert.equal(options[2].billingCycles, 4);
  } finally {
    if (price === undefined) delete process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA; else process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA = price;
    if (plan === undefined) delete process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY; else process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY = plan;
  }
});
