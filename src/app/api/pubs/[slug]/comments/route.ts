import { activitySource, addComment, commentSchema } from "@/lib/engagement";
import { message, readWrite, readerId, reply, targetPost } from "@/lib/engagement-http";
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const read = await readWrite(request, 6000);
  if (read.error) return read.error;
  const parsed = commentSchema.safeParse(read.body);
  if (!parsed.success)
    return reply(
      { message: "Please check the highlighted fields.", errors: parsed.error.flatten().fieldErrors },
      400,
    );
  // Bots that fill the hidden field get a quiet success and nothing is saved.
  if (parsed.data.website) return reply({ message: "Thank you." });
  try {
    const post = await targetPost(params);
    if (post.error) return post.error;
    const reader = (await readerId(true)) as string;
    const comment = await addComment({
      slug: post.slug,
      postTitle: post.title,
      name: parsed.data.name,
      body: parsed.data.body,
      reader,
      source: activitySource(request, reader),
    });
    if (!comment)
      return message("You've posted several comments in a short time. Please try again later.", 429);
    return reply({ comment });
  } catch (error) {
    console.error("Comment failed:", error instanceof Error ? error.message : error);
    return message("We couldn't post your comment. Please try again.", 502);
  }
}
