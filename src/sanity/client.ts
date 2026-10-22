import "server-only";
import { createClient } from "next-sanity";
import { draftMode } from "next/headers";
import { cache } from "react";
import {
  sanityApiVersion,
  sanityConfigured,
  sanityDataset,
  sanityProjectId,
} from "./env";
import {
  CATEGORIES_QUERY,
  MAGAZINE_QUERY,
  POST_QUERY,
  RELATED_QUERY,
  SITEMAP_QUERY,
} from "./queries";
import type { Category, EditorialSection, Post } from "./types";
export function getPublicClient() {
  return sanityConfigured
    ? createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: sanityApiVersion,
        useCdn: true,
        perspective: "published",
        token: process.env.SANITY_API_READ_TOKEN,
        timeout: 10000,
        maxRetries: 1,
      })
    : null;
}
async function context() {
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
