import type { Post } from "@/sanity/types";
// Everyone credited on a post, main contributor first.
export function postAuthors({ author, additionalAuthors }: Pick<Post, "author" | "additionalAuthors">) {
  const authors = [author, ...(additionalAuthors ?? [])].filter((a) => !!a);
  return authors.filter((a, i) => authors.findIndex((b) => b._id === a._id) === i);
}
export const authorNames = (post: Pick<Post, "author" | "additionalAuthors">) =>
  new Intl.ListFormat("en-US", { type: "conjunction" }).format(
    postAuthors(post).map((a) => a.name),
  ) || "ONEGOODJUNE";
// All public dates use the client's format and Lagos time.
export function heroDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "2-digit", year: "numeric", timeZone: "Africa/Lagos",
  }).format(new Date(value));
}
