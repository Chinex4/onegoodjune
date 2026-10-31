import copy from "./client-email-revisions.json";
import type { Author } from "@/sanity/types";
// Client-provided profile copy supplements the CMS until the editor updates it.
// The portrait stays CMS-managed; no other person's photograph is substituted.
export function contributorProfile<T extends Author>(author: T): T {
  if (author.name.trim().toLowerCase() !== "chidinma nnalue") return author;
  return {
    ...author,
    bio: author.bio?.trim() || copy[105].trim(),
    links: author.links?.length
      ? author.links
      : [
          { label: "LinkedIn", url: copy[106].replace(/^LINKEDIN: /, "") },
          { label: "Instagram", url: copy[107].replace(/^IG: /, "") },
          { label: "Substack", url: copy[108].replace(/^SUBSTACK: /, "") },
        ],
  };
}
