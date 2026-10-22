import { draftMode } from "next/headers";
import { sanityConfigured } from "@/sanity/env";
export async function DraftNotice() {
  if (!sanityConfigured) return null;
  const { isEnabled } = await draftMode();
  return isEnabled ? (
    <aside
      className="flex flex-wrap items-center justify-between gap-4 bg-straw p-4 font-sans text-xs"
      aria-label="Draft preview"
    >
      <p>
        Draft preview · unpublished content is visible only in this session.
      </p>
      <form action="/api/draft/disable" method="post">
        <button className="min-h-10 border-b border-ink px-2">
          Exit preview
        </button>
      </form>
    </aside>
  ) : null;
}
