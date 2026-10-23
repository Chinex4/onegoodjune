import { test } from "node:test";
import assert from "node:assert/strict";
import { sog } from "../src/content/sog";
import source from "../src/content/sog-source.json";

test("SOG preserves the three distinct payment periods and all supplied plan benefits", () => {
  assert.equal(sog.plans.length, 3);
  assert.equal(sog.plans[0].price, "$9 / ₦12,500 every quarter");
  assert.equal(
    sog.plans[1].price,
    "$56 / ₦75,000 per year (pay in 2–4 installments)",
  );
  assert.equal(
    sog.plans[2].price,
    "$40 / ₦55,000 every quarter (founding price)",
  );
  assert.deepEqual(
    sog.plans.map((p) => p.benefits.length),
    [4, 5, 4],
  );
  assert.equal(sog.plans[1].roadmap?.split("\n").length, 4);
});
test("SOG keeps client testimonials and every FAQ without publishing the document's video note", () => {
  assert.equal(sog.testimonials.length, 4);
  assert.equal(sog.faqs.length, 10);
  for (const testimonial of sog.testimonials) {
    assert(source.includes(testimonial.quote));
    assert(source.includes(testimonial.author));
  }
  assert.match(sog.faqs[7].answer, /50% discount/);
  assert(!JSON.stringify(sog).includes("[Add Video]"));
});
