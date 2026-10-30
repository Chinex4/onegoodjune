import "server-only";
import { createClient } from "next-sanity";
import { draftMode } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import {
  sanityApiVersion,
  sanityConfigured,
  sanityDataset,
  sanityProjectId,
} from "./env";
import {
  AUTHOR_QUERY,
  AUTHORS_SITEMAP_QUERY,
  CATEGORIES_QUERY,
  EVENT_QUERY,
  EVENTS_QUERY,
  MAGAZINE_QUERY,
  POST_QUERY,
  RELATED_QUERY,
  SITEMAP_QUERY,
} from "./queries";
import type { Author, Category, EditorialSection, Event, Post } from "./types";
export function getPublicClient() {
  return sanityConfigured
    ? createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: sanityApiVersion,
        useCdn: true,
        perspective: "published",
        // The dataset is public: published reads need no token, and a token
        // from another project would turn every request into a 401.
        timeout: 10000,
        maxRetries: 1,
      })
    : null;
}
async function context() {
  // Reads are always fresh and filter by the current time, so run per request.
  await connection();
  const publicClient = getPublicClient();
  if (!publicClient) return null;
  const preview = (await draftMode()).isEnabled;
  if (preview) {
    if (!process.env.SANITY_API_READ_TOKEN)
      throw new Error("Draft preview is not configured");
    return {
      client: publicClient.withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
        perspective: "drafts",
        useCdn: false,
      }),
      preview: true,
    };
  }
  return { client: publicClient, preview: false };
}
export const getCategories = cache(async () => {
  const ctx = await context();
  return ctx
    ? ctx.client.fetch<Category[]>(CATEGORIES_QUERY, {}, { cache: "no-store" })
    : [];
});
export type MagazineData = {
  latest: Post[];
  listing: Post[];
  total: number;
  featured: Post | null;
  hero: Post[];
  heroFallback: Post[];
  newcomer: Post[];
  spotlight: Post[];
  sections: EditorialSection[] | null;
  configured: boolean;
};
export const getMagazine = cache(
  async (category = "", page = 1): Promise<MagazineData> => {
    const ctx = await context();
    if (!ctx)
      return {
        latest: [],
        listing: [],
        total: 0,
        featured: null,
        hero: [],
        heroFallback: [],
        newcomer: [],
        spotlight: [],
        sections: [],
        configured: false,
      };
    const data = await ctx.client.fetch<Omit<MagazineData, "configured">>(
      MAGAZINE_QUERY,
      {
        category,
        start: (page - 1) * 12,
        end: page * 12,
        preview: ctx.preview,
      },
      { cache: "no-store" },
    );
    const isVisible = (post: Post | null) =>
      !!post &&
      (ctx.preview ||
        (!!post.publishedAt && Date.parse(post.publishedAt) <= Date.now()));
    return {
      ...data,
      featured: isVisible(data.featured) ? data.featured : null,
      hero: (data.hero || []).filter((p): p is Post => isVisible(p)),
      sections: (data.sections || []).map((s) => ({
        ...s,
        posts: (s.posts || []).filter((p): p is Post => isVisible(p)),
      })),
      configured: true,
    };
  },
);
export const getPost = cache(async (slug: string) => {
  const ctx = await context();
  return ctx
    ? ctx.client.fetch<Post | null>(
        POST_QUERY,
        { slug, preview: ctx.preview },
        { cache: "no-store" },
      )
    : null;
});
export const getRelated = cache(async (post: Post) => {
  const ctx = await context();
  return ctx
    ? ctx.client.fetch<Post[]>(
        RELATED_QUERY,
        {
          slug: post.slug,
          categoryId: post.category?._id || "",
          tagIds: (post.tags || []).map((t) => t._id),
          preview: ctx.preview,
        },
        { cache: "no-store" },
      )
    : [];
});
export async function getSitemapPosts() {
  const client = getPublicClient();
  return client
    ? client.fetch<{ slug: string; _updatedAt: string }[]>(
        SITEMAP_QUERY,
        { preview: false },
        { cache: "no-store" },
      )
    : [];
}
export const getAuthor = cache(async (slug: string) => {
  const ctx = await context();
  return ctx
    ? ctx.client.fetch<(Author & { posts: Post[] }) | null>(
        AUTHOR_QUERY,
        { slug, preview: ctx.preview },
        { cache: "no-store" },
      )
    : null;
});
export async function getSitemapAuthors() {
  const client = getPublicClient();
  return client
    ? client.fetch<{ slug: string; _updatedAt: string }[]>(
        AUTHORS_SITEMAP_QUERY,
        { preview: false },
        { cache: "no-store" },
      )
    : [];
}
export const getEvents = cache(async () => {
  const ctx = await context();
  return ctx
    ? ctx.client.fetch<Event[]>(EVENTS_QUERY, {}, { cache: "no-store" })
    : [];
});
export const getEvent = cache(async (slug: string) => {
  const ctx = await context();
  return ctx
    ? ctx.client.fetch<Event | null>(
        EVENT_QUERY,
        { slug },
        { cache: "no-store" },
      )
    : null;
});
