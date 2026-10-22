import type { PortableTextBlock } from "@portabletext/react";
export type EditorialImage = {
  _type: "editorialImage";
  alt?: string;
  caption?: string;
  credit?: string;
  asset?: { _ref?: string };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
};
export type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};
export type Author = {
  _id: string;
  name: string;
  slug?: string;
  bio?: string;
  image?: EditorialImage;
};
export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: (PortableTextBlock | EditorialImage)[];
  author?: Author;
  publishedAt?: string;
  _updatedAt?: string;
  mainImage?: EditorialImage;
  category?: Category;
  tags?: { _id: string; title: string; slug: string }[];
  text?: string;
};
export type EditorialSection = {
  _key: string;
  title: string;
  slug: string;
  posts: Post[];
};
