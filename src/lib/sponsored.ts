import type { Post } from "@/sanity/types";
export function isSponsored(post: Pick<Post, "category" | "additionalCategories" | "sponsored">) {
  return post.sponsored === true || [post.category, ...(post.additionalCategories || [])].some(c => c?.slug === "spotlight");
}
