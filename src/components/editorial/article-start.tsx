"use client";
import { useLayoutEffect } from "react";
// Runs when the streamed article has actually arrived, rather than against its
// short loading fallback. Otherwise a previous listing scroll can land below it.
export function ArticleStart({ slug }: { slug: string }) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);
  return null;
}
