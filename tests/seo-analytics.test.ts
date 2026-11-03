import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsLocation, analyticsReferrer, trackablePath } from "../src/lib/analytics";
import { articleSearchCopy } from "../src/lib/metadata";

test("analytics excludes private routes and strips query strings/fragments", () => {
  for (const path of ["/studio", "/studio/desk", "/payment/callback", "/consult/book", "/api/register", "/silencekeepsitgoingonegoodjune"]) assert(!trackablePath(path));
  for (const path of ["/home", "/pubs", "/pubs/a-story", "/consult"]) assert(trackablePath(path));
  assert.equal(analyticsReferrer("https://www.google.com/search?q=private"), "https://www.google.com/");
  assert.equal(analyticsReferrer(""), "");
  assert.equal(analyticsLocation("https://onegoodjune.com", "/pubs?email=private@example.com#secret"), "https://onegoodjune.com/pubs");
});
test("SEO overrides preserve editorial content and safely fall back for old posts", () => {
  const post = { _id: "test", slug: "a-story", title: "Editorial title", excerpt: "Editorial summary" };
  assert.deepEqual(articleSearchCopy(post), { title: post.title, description: post.excerpt });
  assert.deepEqual(articleSearchCopy({ ...post, seo: { title: "  Search title  ", description: "Search summary" } }), { title: "Search title", description: "Search summary" });
  assert.deepEqual(articleSearchCopy({ ...post, seo: { title: " ", description: " " } }), { title: post.title, description: post.excerpt });
  assert.equal(post.title, "Editorial title");
});

test("published article query returns the optional Sanity SEO overrides", async () => {
  const { parse, evaluate } = await import("groq-js");
  const { POST_QUERY } = await import("../src/sanity/queries");
  const seo = { title: "Search title", description: "Search description", image: { _type: "editorialImage", asset: { _ref: "image-test" } } };
  const result = await evaluate(parse(POST_QUERY), {
    dataset: [{ _id: "seo-fixture", _type: "post", title: "Editorial title", slug: { current: "seo-test" }, publishedAt: "2026-01-01T00:00:00Z", seo }],
    params: { slug: "seo-test", preview: false },
  });
  assert.deepEqual((await result.get()).seo, seo);
});
