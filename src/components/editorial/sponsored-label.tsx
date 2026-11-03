import type { Post } from "@/sanity/types";
import { isSponsored } from "@/lib/sponsored";
import { cn } from "@/lib/utils";
export function SponsoredLabel({ post, dark = false }: { post: Post; dark?: boolean }) {
  if (!isSponsored(post)) return null;
  return <p className={cn("mb-3 inline-block border px-2.5 py-1 font-sans text-[0.625rem] font-semibold uppercase tracking-wide", dark ? "border-white/40 text-white" : "border-ink/30 text-ink")}>Sponsored launch announcement</p>;
}
