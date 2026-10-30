import Image from "next/image";
import { imageUrl } from "@/sanity/images";
import type { Post } from "@/sanity/types";
import { cn } from "@/lib/utils";
// Featured images are optional while the editors add them; until then each
// category gets its own brand-colour placeholder.
const placeholderTone: Record<string, string> = {
  stories: "bg-orange text-ink",
  essays: "bg-straw text-ink",
  poetry: "bg-sage text-ink",
  people: "bg-sunshine text-ink",
  newcomer: "bg-lime text-ink",
  spotlight: "bg-rust text-white",
  news: "bg-forest text-white",
  craft: "bg-earth text-white",
};
export function CoverImage({
  post,
  width = 900,
  sizes,
  className = "",
  priority = false,
}: {
  post: Post;
  width?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const src = imageUrl(post.mainImage, width);
  const slug = post.category?.slug ?? "";
  return (
    <div className={cn("relative overflow-hidden bg-paper", className)}>
      {src ? (
        <Image
          src={src}
          alt={post.mainImage?.alt || post.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex flex-col justify-between p-[6%]",
            placeholderTone[slug] ?? "bg-ink text-white",
          )}
        >
          <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] opacity-80 font-stretch-expanded">
            {post.category?.title ?? "Read Pubs"}
          </span>
          <span className="font-heading text-[clamp(1rem,4cqw,2rem)] leading-none tracking-[-0.03em] opacity-90">
            ONEGOODJUNE
          </span>
        </div>
      )}
    </div>
  );
}
