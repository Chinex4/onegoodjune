import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;
before(async () => {
  mongo = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
  process.env.MONGODB_URI = mongo.getUri();
  process.env.MONGODB_DB = "ogj-engagement-test";
});
after(async () => {
  const { getDb } = await import("../src/lib/mongodb");
  await (await getDb()).client.close();
  await mongo.stop();
});
const engagement = () => import("../src/lib/engagement");

test("comment validation trims, limits and allows line breaks", async () => {
  const { commentSchema } = await engagement();
  const ok = commentSchema.safeParse({ name: "  Ada  ", body: "Loved this.\nThank you <3" });
  assert(ok.success);
  assert.equal(ok.data.name, "Ada");
  assert(!commentSchema.safeParse({ name: "A", body: "Hi there" }).success);
  assert(!commentSchema.safeParse({ name: "<b>Ada</b>", body: "Hi there" }).success);
  assert(!commentSchema.safeParse({ name: "Ada", body: "x".repeat(1501) }).success);
  assert(!commentSchema.safeParse({ name: "Ada", body: "bad\u0000byte" }).success);
});

test("one like per reader, and unliking removes it", async () => {
  const { setLike, getEngagement } = await engagement();
  const base = { slug: "likes-post", source: "s1" };
  assert.deepEqual(await setLike({ ...base, reader: "r1", liked: true }), { likes: 1, liked: true });
  assert.deepEqual(await setLike({ ...base, reader: "r1", liked: true }), { likes: 1, liked: true });
  await setLike({ ...base, reader: "r2", liked: true });
  const seen = await getEngagement("likes-post", "r1");
  assert.equal(seen.likes, 2);
  assert.equal(seen.liked, true);
  assert.equal((await getEngagement("likes-post", "someone-else")).liked, false);
  assert.deepEqual(await setLike({ ...base, reader: "r1", liked: false }), { likes: 1, liked: false });
});

test("comments are public at once, oldest first, and hidden ones drop out", async () => {
  const { addComment, getEngagement, setCommentHidden, deleteComment } = await engagement();
  const input = { slug: "comment-post", postTitle: "Comment post", reader: "r1", source: "c1" };
  const first = await addComment({ ...input, name: "Ada", body: "First", now: new Date(1000) });
  const second = await addComment({ ...input, name: "Obi", body: "Second", now: new Date(2000) });
  assert(first && second);
  let page = await getEngagement("comment-post");
  assert.deepEqual(page.comments.map((c) => c.body), ["First", "Second"]);
  assert(!("reader" in page.comments[0]), "reader ids stay private");
  assert(await setCommentHidden(first.id, true));
  page = await getEngagement("comment-post");
  assert.deepEqual(page.comments.map((c) => c.body), ["Second"]);
  assert(await deleteComment(second.id));
  assert.equal((await getEngagement("comment-post")).comments.length, 0);
  assert.equal(await setCommentHidden("not-an-id", true), false);
});

test("comment and like limits apply per source within the window", async () => {
  const { addComment, setLike, limits } = await engagement();
  const now = new Date();
  const input = { slug: "busy-post", postTitle: "Busy", reader: "r9", source: "flood", name: "Bot", body: "Hi" };
  for (let i = 0; i < limits.comments; i++) assert(await addComment({ ...input, now }));
  assert.equal(await addComment({ ...input, now }), null);
  // Other readers are unaffected, and the window expires.
  assert(await addComment({ ...input, source: "calm", now }));
  assert(await addComment({ ...input, now: new Date(now.getTime() + limits.windowMs + 1) }));
  for (let i = 0; i < limits.likes; i++)
    assert(await setLike({ slug: `p-${i}`, reader: `r-${i}`, source: "liker", liked: true, now }));
  assert.equal(await setLike({ slug: "p-x", reader: "r-x", source: "liker", liked: true, now }), null);
});

test("activity source uses the proxy address only when trusted", async () => {
  const { activitySource } = await engagement();
  const request = (ip: string) => new Request("https://x.test", { headers: { "x-forwarded-for": ip } });
  process.env.CONTACT_TRUST_PROXY = "false";
  assert.notEqual(activitySource(request("1.1.1.1"), "a"), activitySource(request("1.1.1.1"), "b"));
  process.env.CONTACT_TRUST_PROXY = "true";
  assert.equal(activitySource(request("1.1.1.1"), "a"), activitySource(request("1.1.1.1, 9.9.9.9"), "b"));
  delete process.env.CONTACT_TRUST_PROXY;
});
