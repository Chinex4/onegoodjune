import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "./mongodb";
// Reader likes and comments on pubs. Readers have no accounts: an anonymous,
// httpOnly cookie gives each browser one like per post and lets the limits
// below count its activity. Comments go live at once; admins can hide them.
export const READER_COOKIE = "ogj_reader";
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const singleLine = /^[^\u0000-\u001f\u007f<>]+$/;
// Allows tabs and line breaks; React escapes everything else on display.
const multiLine = /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/;
export const commentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(60, "Use 60 characters or fewer.")
    .regex(singleLine, "Please use a valid name."),
  body: z
    .string()
    .trim()
    .min(2, "Please write a comment.")
    .max(1500, "Use 1,500 characters or fewer.")
    .regex(multiLine, "Please remove unusual characters from your comment."),
  // Honeypot: hidden from readers, filled in by bots.
  website: z.string().max(200).optional(),
});
export const limits = {
  windowMs: 15 * 60 * 1000,
  comments: 5,
  likes: 60,
};
export type PostComment = {
  _id?: ObjectId;
  slug: string;
  postTitle: string;
  name: string;
  body: string;
  reader: string;
  source: string;
  hidden: boolean;
  createdAt: Date;
};
type PostLike = { slug: string; reader: string; source: string; createdAt: Date };
export type PublicComment = { id: string; name: string; body: string; createdAt: string };
export function newReaderId() {
  return randomUUID();
}
export function validReaderId(value?: string) {
  return !!value && /^[0-9a-f-]{36}$/.test(value);
}
const hash = (value: string) =>
  createHash("sha256").update(`ogj-engagement:${value}`).digest("hex").slice(0, 32);
// Who to count for rate limits: the network address when a trusted proxy sets
// it, otherwise the browser's reader cookie.
export function activitySource(request: Request, reader: string) {
  const ip =
    process.env.CONTACT_TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : undefined;
  return hash(ip ? `ip:${ip}` : `reader:${reader}`);
}
const collections = async () => {
  const db = await getDb();
  const likes = db.collection<PostLike>("postLikes");
  const comments = db.collection<PostComment>("postComments");
  const g = globalThis as unknown as { ogjEngagementIndexes?: Promise<unknown> };
  g.ogjEngagementIndexes ??= Promise.all([
    likes.createIndex({ slug: 1, reader: 1 }, { unique: true }),
    likes.createIndex({ source: 1, createdAt: -1 }),
    comments.createIndex({ slug: 1, hidden: 1, createdAt: 1 }),
    comments.createIndex({ source: 1, createdAt: -1 }),
    comments.createIndex({ createdAt: -1 }),
  ]);
  await g.ogjEngagementIndexes;
  return { likes, comments };
};
const toPublic = (c: PostComment): PublicComment => ({
  id: String(c._id),
  name: c.name,
  body: c.body,
  createdAt: c.createdAt.toISOString(),
});
export async function getEngagement(slug: string, reader?: string) {
  const { likes, comments } = await collections();
  const [likeCount, liked, visible] = await Promise.all([
    likes.countDocuments({ slug }),
    reader ? likes.countDocuments({ slug, reader }, { limit: 1 }) : 0,
    comments.find({ slug, hidden: false }).sort({ createdAt: 1 }).limit(500).toArray(),
  ]);
  return { likes: likeCount, liked: liked > 0, comments: visible.map(toPublic) };
}
async function withinLimit(
  col: { countDocuments(filter: object): Promise<number> },
  source: string,
  max: number,
  now: Date,
) {
  const since = new Date(now.getTime() - limits.windowMs);
  return (await col.countDocuments({ source, createdAt: { $gte: since } })) < max;
}
// Returns null when this source has hit the limit.
export async function setLike(input: {
  slug: string;
  reader: string;
  source: string;
  liked: boolean;
  now?: Date;
}) {
  const { likes } = await collections();
  const now = input.now ?? new Date();
  if (input.liked) {
    const exists = await likes.countDocuments(
      { slug: input.slug, reader: input.reader },
      { limit: 1 },
    );
    if (!exists) {
      if (!(await withinLimit(likes, input.source, limits.likes, now))) return null;
      try {
        await likes.insertOne({
          slug: input.slug,
          reader: input.reader,
          source: input.source,
          createdAt: now,
        });
      } catch (error) {
        if ((error as { code?: number }).code !== 11000) throw error;
      }
    }
  } else {
    await likes.deleteOne({ slug: input.slug, reader: input.reader });
  }
  return {
    likes: await likes.countDocuments({ slug: input.slug }),
    liked: input.liked,
  };
}
export async function addComment(
  input: Omit<PostComment, "_id" | "hidden" | "createdAt"> & { now?: Date },
) {
  const { comments } = await collections();
  const { now = new Date(), ...rest } = input;
  if (!(await withinLimit(comments, input.source, limits.comments, now))) return null;
  const doc: PostComment = { ...rest, hidden: false, createdAt: now };
  const { insertedId } = await comments.insertOne(doc);
  return toPublic({ ...doc, _id: insertedId });
}
// Admin views.
export async function listAllComments(filters: { q?: string; status?: string }) {
  const { comments } = await collections();
  const query: Record<string, unknown> = {};
  if (filters.status === "hidden") query.hidden = true;
  if (filters.status === "visible") query.hidden = false;
  if (filters.q) {
    const pattern = new RegExp(filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: pattern }, { body: pattern }, { postTitle: pattern }, { slug: pattern }];
  }
  return comments.find(query).sort({ createdAt: -1 }).limit(500).toArray();
}
export async function engagementTotals() {
  const { likes, comments } = await collections();
  const [likeCount, commentCount, hiddenCount] = await Promise.all([
    likes.estimatedDocumentCount(),
    comments.countDocuments({ hidden: false }),
    comments.countDocuments({ hidden: true }),
  ]);
  return { likes: likeCount, comments: commentCount, hidden: hiddenCount };
}
export async function setCommentHidden(id: string, hidden: boolean) {
  if (!ObjectId.isValid(id)) return false;
  const { comments } = await collections();
  const result = await comments.updateOne({ _id: new ObjectId(id) }, { $set: { hidden } });
  return result.matchedCount === 1;
}
export async function deleteComment(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const { comments } = await collections();
  return (await comments.deleteOne({ _id: new ObjectId(id) })).deletedCount === 1;
}
