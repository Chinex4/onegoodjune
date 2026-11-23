import { test } from "node:test";
import assert from "node:assert/strict";
import { sog } from "../src/content/sog";
import source from "../src/content/sog-source.json";

test("SOG preserves the three distinct payment periods and the revised plan benefits", () => {
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
    [4, 4, 4],
  );
  // Visionary keeps its original benefits; only its description changed.
  assert.deepEqual(sog.plans[2].benefits, source.slice(85, 89));
  assert(!("roadmap" in sog.plans[1]), "the 12-month roadmap was removed");
});
test("SOG November revision: opening, audience, pathways, results and closing", () => {
  assert.equal(sog.embrace.options.length, 5);
  assert.equal(sog.embrace.commitments.length, 5);
  assert.deepEqual(sog.audience, ["Writers", "Authors", "Editors"]);
  assert.equal(sog.experience.length, 5);
  assert.equal(sog.coach.credentials.length, 6);
  assert.equal(sog.pathways.length, 3);
  assert.deepEqual(
    sog.results.map((r) => r.items.length),
    [3, 3, 3],
  );
  assert.match(sog.closing, /^Someday you will look back/);
  const page = JSON.stringify(sog);
  for (const removed of ["NEXT BIG career goal", "12-month", "self-paced course?", "not for you if"])
    assert(!page.includes(removed), removed);
});
test("SOG keeps client testimonials and the revised FAQ list", () => {
  assert.equal(sog.testimonials.length, 4);
  for (const testimonial of sog.testimonials) {
    assert(source.includes(testimonial.quote));
    assert(source.includes(testimonial.author));
  }
  assert.equal(sog.faqs.length, 8);
  const questions = sog.faqs.map((f) => f.question).join(" ");
  assert.doesNotMatch(questions, /bootcamps|live sessions/);
  assert.match(questions, /professional training/);
  assert(!JSON.stringify(sog).includes("[Add Video]"));
});
