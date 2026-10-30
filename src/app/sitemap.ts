import type { MetadataRoute } from "next";
import { getSitemapAuthors, getSitemapPosts } from "@/sanity/client";
import { site } from "@/lib/site-config";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/about",
    "/read-pubs",
    "/submissions",
    "/school-of-growth",
    "/fiction-writing",
    "/contact",
    "/privacy-policy",
    "/events",
    "/author-consultation",
    "/launch-spotlight",
  ];
  const [posts, authors] = await Promise.all([
    getSitemapPosts(),
    getSitemapAuthors(),
  ]);
  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      changeFrequency:
        route === "/read-pubs" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/read-pubs/${post.slug}`,
      lastModified: post._updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...authors.map((author) => ({
      url: `${site.url}/contributors/${author.slug}`,
      lastModified: author._updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
