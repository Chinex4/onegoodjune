import type { Post } from "@/sanity/types";
import type { Metadata } from "next";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ONEGOODJUNE`,
      description,
      url: path,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ONEGOODJUNE`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function articleSearchCopy(post: Post) {
  return {
    title: post.seo?.title?.trim() || post.title,
    description: post.seo?.description?.trim() || post.excerpt || "A ONEGOODJUNE literary publication.",
  };
}
