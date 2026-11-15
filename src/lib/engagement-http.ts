import "server-only";
import { cookies } from "next/headers";
import { getPublishedPostTitle } from "@/sanity/client";
import { mongoConfigured } from "./mongodb";
import { site } from "./site-config";
import { READER_COOKIE, newReaderId, slugPattern, validReaderId } from "./engagement";
const headers = { "Cache-Control": "no-store" };
export const reply = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status, headers });
export const message = (text: string, status: number) => reply({ message: text }, status);
// Same-site, small JSON writes only.
export async function readWrite(request: Request, maxBytes: number) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    ![new URL(site.url).origin, new URL(request.url).origin].includes(origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return { error: message("This request could not be verified. Please refresh and try again.", 403) };
  const text = await request.text().catch(() => "");
  if (text.length > maxBytes) return { error: message("That's too long to send.", 413) };
  try {
    return { body: JSON.parse(text) as unknown };
  } catch {
    return { error: message("Please send a valid request.", 400) };
  }
}
export async function readerId(create: boolean) {
  const jar = await cookies();
  const existing = jar.get(READER_COOKIE)?.value;
  if (validReaderId(existing)) return existing as string;
  if (!create) return undefined;
  const id = newReaderId();
  jar.set(READER_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
  return id;
}
// Resolves the post a request targets, or the error response to send.
export async function targetPost(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  if (!slugPattern.test(slug) || slug.length > 96)
    return { error: message("We couldn't find this publication.", 404) };
  if (!mongoConfigured())
    return { error: message("Likes and comments are unavailable right now.", 503) };
  const title = await getPublishedPostTitle(slug);
  if (!title) return { error: message("We couldn't find this publication.", 404) };
  return { slug, title };
}
