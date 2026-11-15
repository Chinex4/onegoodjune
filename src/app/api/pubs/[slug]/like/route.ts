import { activitySource, setLike } from "@/lib/engagement";
import { message, readWrite, readerId, reply, targetPost } from "@/lib/engagement-http";
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const read = await readWrite(request, 200);
  if (read.error) return read.error;
  const liked = (read.body as { liked?: unknown } | null)?.liked;
  if (typeof liked !== "boolean") return message("Please send a valid request.", 400);
  try {
    const post = await targetPost(params);
    if (post.error) return post.error;
    const reader = (await readerId(true)) as string;
    const result = await setLike({
      slug: post.slug,
      reader,
      source: activitySource(request, reader),
      liked,
    });
    if (!result) return message("You're liking a lot right now. Please try again later.", 429);
    return reply(result);
  } catch (error) {
    console.error("Like failed:", error instanceof Error ? error.message : error);
    return message("We couldn't save your like. Please try again.", 502);
  }
}
