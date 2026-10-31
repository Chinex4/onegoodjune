import Link from "next/link";
import type { Post } from "@/sanity/types";
import { CoverImage } from "./cover-image";
import { label } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
export function readingMinutes(text?: string) {
  return Math.max(
    1,
    Math.ceil((text || "").trim().split(/\s+/).filter(Boolean).length / 220),
  );
}
export function articleDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
}
export function ArticleCard({
  post,
  featured = false,
  tone = "light",
  compact = false,
}: {
  post: Post;
  featured?: boolean;
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <article className="group @container min-w-0">
      <Link
        href={`/read-pubs/${post.slug}`}
        className={
          featured
            ? "grid items-center gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12"
            : "block"
        }
      >
        <CoverImage
          post={post}
          width={featured ? 1400 : 800}
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 60vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className={featured ? "aspect-[4/3]" : "aspect-[3/2]"}
        />
        <div className={featured ? "" : compact ? "pt-4" : "pt-5"}>
          {!compact && (
            <p className={cn(label, dark ? "text-sunshine" : "text-rust")}>
              {post.category?.title || "Publication"}
            </p>
          )}
          <h3
            className={cn(
              "font-serif font-semibold leading-[1.18] tracking-[-0.01em] transition-colors",
              dark ? "group-hover:text-lime" : "group-hover:text-forest",
              featured
                ? "mt-3 text-[1.75rem] md:text-[2.25rem]"
                : compact
                  ? "text-[1.1875rem]"
                  : "mt-3 text-[1.375rem]",
            )}
          >
            {post.title}
          </h3>
          {post.excerpt && !compact && (
            <p
              className={cn(
                "mt-3 line-clamp-3 font-serif text-[1.0625rem] leading-[1.6]",
                dark ? "text-white/75" : "text-ink/80",
              )}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs leading-relaxed",
              compact ? "mt-2" : "mt-4",
              dark ? "text-white/70" : "text-ink/70",
            )}
          >
            <span className="w-full font-semibold">
              {post.author?.name || "ONEGOODJUNE"}
            </span>
            {!compact && (
              <span>
                <time dateTime={post.publishedAt}>
                  {articleDate(post.publishedAt)}
                </time>{" "}
                · {readingMinutes(post.text)} min read
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
