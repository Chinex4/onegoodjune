import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { getPublicClient } from "@/sanity/client";
import { POST_QUERY } from "@/sanity/queries";
import type { Post } from "@/sanity/types";
function same(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") || "";
  const expected = process.env.SANITY_PREVIEW_SECRET;
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!expected || !token || !same(secret, expected))
    return new Response("Unauthorized", { status: 401 });
  const slug = url.searchParams.get("slug");
  const client = getPublicClient();
  if (!client)
    return new Response("Preview is not configured", { status: 503 });
  let destination = "/read-pubs";
  if (slug) {
    if (!/^[a-z0-9-]{1,96}$/.test(slug))
      return new Response("Invalid slug", { status: 400 });
    try {
      const post = await client
        .withConfig({ useCdn: false, token, perspective: "drafts" })
        .fetch<Post | null>(
          POST_QUERY,
          { slug, preview: true },
          { cache: "no-store" },
        );
      if (!post) return new Response("Article not found", { status: 404 });
      destination = `/read-pubs/${post.slug}`;
    } catch {
      return new Response("Preview unavailable", { status: 503 });
    }
  }
  (await draftMode()).enable();
  return new Response(null, {
    status: 307,
    headers: {
      Location: destination,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
