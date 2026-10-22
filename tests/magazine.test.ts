import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse, evaluate } from "groq-js";
import {
  MAGAZINE_QUERY,
  CATEGORIES_QUERY,
  POST_QUERY,
  RELATED_QUERY,
  SITEMAP_QUERY,
} from "../src/sanity/queries";
// Synthetic fixtures only: never imported into the live CMS or attributed to real people.
const taxonomy = readFileSync(
  new URL("../src/sanity/initial-taxonomy.ndjson", import.meta.url),
  "utf8",
)
  .trim()
  .split("\n")
  .map((s) => JSON.parse(s));
const author = { _id: "test-author", _type: "author", name: "Test Author" };
const posts = Array.from({ length: 16 }, (_, i) => ({
  _id: `test-${i}`,
  _type: "post",
  title: `Test article ${i}`,
  slug: { current: `test-${i}` },
  publishedAt: `2026-09-${String(28 - i).padStart(2, "0")}T12:00:00Z`,
  author: { _ref: author._id },
  category: { _ref: i % 2 === 0 ? "category-stories" : "category-news" },
  tags: i % 4 === 0 ? [{ _ref: "tag-fiction" }] : [],
  body: [{ _type: "block", children: [{ _type: "span", text: "Test body" }] }],
}));
const dataset = [
  ...taxonomy,
  author,
  ...posts,
  {
    ...posts[0],
    _id: "future",
    slug: { current: "future" },
    publishedAt: "2099-01-01T00:00:00Z",
  },
];
async function query(q: string, params: Record<string, unknown> = {}) {
  return (
    await evaluate(
      parse(q, {
        params: { preview: false, category: "", start: 0, end: 12, ...params },
      }),
      {
        dataset,
        params: { preview: false, category: "", start: 0, end: 12, ...params },
        timestamp: new Date("2026-10-21T12:00:00Z"),
      },
    )
  ).get();
}
test("CMS categories, publication dates, pagination and tag-driven sections work", async () => {
  assert.equal((await query(CATEGORIES_QUERY)).length, 5);
  const data = await query(MAGAZINE_QUERY);
  assert.equal(data.latest.length, 4);
  assert.equal(data.total, 16);
  assert.equal(data.listing.length, 12);
  assert.equal(
    data.sections.find((s: { title: string }) => s.title === "Cozy Corner")
      .posts.length,
    4,
  );
  assert(
    data.sections
      .find((s: { title: string }) => s.title === "Cozy Corner")
      .posts.every(
        (p: { category: { slug: string } }) => p.category.slug === "stories",
      ),
  );
  assert(
    data.sections
      .find((s: { title: string }) => s.title === "Big Story")
      .posts.every(
        (p: { category: { slug: string } }) => p.category.slug === "news",
      ),
  );
  const page2 = await query(MAGAZINE_QUERY, { start: 12, end: 24 });
  assert.equal(page2.listing.length, 4);
  const stories = await query(MAGAZINE_QUERY, { category: "stories" });
  assert.equal(stories.total, 8);
});
test("article detail, related articles and sitemap do not expose future posts", async () => {
  assert.equal(
    (await query(POST_QUERY, { slug: "test-0" })).title,
    "Test article 0",
  );
  assert.equal(await query(POST_QUERY, { slug: "future" }), null);
  assert.equal((await query(SITEMAP_QUERY)).length, 16);
  const related = await query(RELATED_QUERY, {
    slug: "test-0",
    categoryId: "category-stories",
    tagIds: ["tag-fiction"],
  });
  assert.equal(related.length, 3);
  assert(related.every((p: { slug: string }) => p.slug !== "test-0"));
});
test("draft perspective query permits an upcoming article for preview", async () => {
  assert.equal(
    (await query(POST_QUERY, { slug: "future", preview: true })).title,
    "Test article 0",
  );
});
