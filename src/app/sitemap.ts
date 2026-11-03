import type { MetadataRoute } from "next";
import { getSitemapAuthors, getSitemapPosts } from "@/sanity/client";
import { site } from "@/lib/site-config";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "/home",
    "/about",
    "/pubs",
    "/submissions",
    "/sog",
    "/fiction-course",
    "/contact",
    "/privacy-policy",
    "/events",
    "/consult",
    "/spotlight",
  ];
  const [posts, authors] = await Promise.all([
    getSitemapPosts(),
    getSitemapAuthors(),
  ]);
  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      changeFrequency:
        route === "/pubs" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/home" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/pubs/${post.slug}`,
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
