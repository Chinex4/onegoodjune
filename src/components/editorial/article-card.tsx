import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/sanity/types";
import { imageUrl } from "@/sanity/images";
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
}: {
  post: Post;
  featured?: boolean;
}) {
  const image = imageUrl(post.mainImage, featured ? 1400 : 800);
  return (
    <article className="group min-w-0">
      <Link
        href={`/read-pubs/${post.slug}`}
        className={
          featured
            ? "grid items-center gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12"
            : "block"
        }
      >
        <div
          className={`relative overflow-hidden bg-ink/5 ${featured ? "aspect-[4/3]" : "aspect-[3/2]"}`}
        >
          {image ? (
            <Image
              src={image}
              alt={post.mainImage?.alt || post.title}
              fill
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 60vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center font-serif text-4xl italic text-forest/40"
              aria-hidden="true"
            >
              OneGoodJune
            </span>
          )}
        </div>
        <div className={featured ? "" : "pt-6"}>
          <p className="font-sans text-[10px] uppercase tracking-widest text-forest">
            {post.category?.title || "Publication"}
          </p>
          <h3
            className={`mt-4 font-serif font-normal leading-snug tracking-tight transition-colors group-hover:text-forest ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-ink/80">
              {post.excerpt}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] leading-relaxed text-ink/70">
            <span>{post.author?.name || "Author to be confirmed"}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {articleDate(post.publishedAt)}
            </time>
            <span>· {readingMinutes(post.text)} min read</span>
            <ArrowUpRight
              size={15}
              className="ml-auto transition-transform motion-safe:group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
