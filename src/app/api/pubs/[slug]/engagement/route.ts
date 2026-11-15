import { getEngagement, slugPattern } from "@/lib/engagement";
import { message, readerId, reply } from "@/lib/engagement-http";
import { mongoConfigured } from "@/lib/mongodb";
// Like count, whether this browser liked the post, and visible comments.
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugPattern.test(slug) || slug.length > 96)
    return message("We couldn't find this publication.", 404);
  if (!mongoConfigured())
    return message("Likes and comments are unavailable right now.", 503);
  try {
    return reply(await getEngagement(slug, await readerId(false)));
  } catch (error) {
    console.error("Engagement read failed:", error instanceof Error ? error.message : error);
    return message("We couldn't load likes and comments.", 502);
  }
}
