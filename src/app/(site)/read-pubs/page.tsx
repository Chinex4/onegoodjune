import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCategories, getMagazine } from "@/sanity/client";
import { ArticleCard } from "@/components/editorial/article-card";
import { DraftNotice } from "@/components/editorial/draft-notice";
import {
  ColorBar,
  Container,
  TextLink,
  buttonStyles,
  ArrowIcon,
  label,
  lead as leadText,
  subheading,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { pageMetadata } from "@/lib/metadata";
import { between } from "@/content/pages";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "Read Pubs",
  "Fiction, poetry, essays, creative nonfiction and moving pieces on industry shifts by contemporary faith-based voices in Africa.",
  "/read-pubs",
);
type Params = Promise<{ category?: string; page?: string }>;
// From the brief: the masthead line and the five editorial segments. Each
// segment's note names the categories it draws from; those become the labels.
const [masthead, , ...segmentNotes] = between("BLOG PAGE", "CONTACT PAGE");
const segmentSources: Record<string, string> = {
  "Big Story": "News",
  "Rising Voices": "Essays & stories",
  "Cozy Corner": "Fiction",
  Spotlight: "Archive",
  Craft: "Craft",
};
const segments = segmentNotes.map((note) => {
  const name = note.split(" (")[0];
  return { name, source: segmentSources[name] ?? "" };
});
const tab =
  "inline-flex min-h-12 shrink-0 items-center border-b-2 font-sans text-sm font-medium transition-colors";
function magazineLink(category: string, page = 1) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  return `/read-pubs${params.size ? `?${params}` : ""}`;
}
async function Magazine({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" &&
    /^[a-z0-9-]{1,96}$/.test(params.category)
      ? params.category
      : "";
  const page = Math.min(
    10000,
    Math.max(1, Number.parseInt(params.page || "1", 10) || 1),
  );
  const [categories, data] = await Promise.all([
    getCategories(),
    getMagazine(category, page),
  ]);
  const lastPage = Math.max(1, Math.ceil(data.total / 12));
  if (page > lastPage) redirect(magazineLink(category, lastPage));
  const active = categories.find((c) => c.slug === category);
  const lead = data.featured || data.latest[0];
  return (
    <>
      <DraftNotice />
      {categories.length > 0 && (
        <nav
          aria-label="Publication categories"
          className="-mx-5 mb-4 flex gap-7 overflow-x-auto border-b border-ink/15 px-5 sm:mx-0 sm:px-0"
        >
          <Link
            href="/read-pubs"
            aria-current={!category ? "page" : undefined}
            className={cn(
              tab,
              !category
                ? "border-rust text-ink"
                : "border-transparent text-ink/65 hover:text-ink",
            )}
          >
            All publications
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={magazineLink(c.slug)}
              aria-current={category === c.slug ? "page" : undefined}
              className={cn(
                tab,
                category === c.slug
                  ? "border-rust text-ink"
                  : "border-transparent text-ink/65 hover:text-ink",
              )}
            >
              {c.title}
            </Link>
          ))}
        </nav>
      )}
      {!category && page === 1 && lead && (
        <section
          className="border-b border-ink/20 py-8 pb-14"
          aria-label="Featured article"
        >
          <h2 className={cn(label, "mb-7 text-rust")}>Featured story</h2>
          <ArticleCard post={lead} featured />
        </section>
      )}
      {!category && page === 1 && data.latest.length > 0 && (
        <section className="py-12">
          <h2 className={`${subheading} mb-10`}>Latest publications</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {data.latest
              .filter((p) => p._id !== lead?._id)
              .map((post) => (
                <ArticleCard post={post} key={post._id} />
              ))}
          </div>
        </section>
      )}
      {!data.latest.length && !category ? (
        <section className="my-10 grid gap-px bg-ink/15 md:my-14 lg:grid-cols-12">
          <div className="bg-paper p-7 sm:p-10 lg:col-span-7 lg:p-12">
            <p className={cn(label, "text-rust")}>Coming soon</p>
            <h2 className={cn(subheading, "mt-5")}>
              The next story is on its way.
            </h2>
            <p className={cn(leadText, "mt-5 max-w-xl text-ink/80")}>
              Our literary publications will appear here once they are
              published. In the meantime, explore our submission guidelines or
              read the newsletter.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/submissions" className={buttonStyles("ink")}>
                Submission guidelines
                <ArrowIcon />
              </Link>
              <TextLink href={site.links.newsletter}>
                Read the Newsletter
              </TextLink>
            </div>
          </div>
          <div className="ground-dark p-7 sm:p-10 lg:col-span-5 lg:p-12">
            <p className={cn(label, "text-sunshine")}>In every issue</p>
            <ol className="mt-6">
              {segments.map((segment, i) => (
                <li
                  key={segment.name}
                  className="flex items-baseline gap-5 border-b border-white/15 py-4 last:border-0"
                >
                  <span className={cn(label, "w-6 text-white/60")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-[1.375rem] leading-tight">
                    {segment.name}
                  </span>
                  <span className="ml-auto text-right font-sans text-xs text-white/55">
                    {segment.source}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
      {category || page > 1 ? (
        <section className="py-10">
          <h2 className={`${subheading} mb-8`}>
            {active?.title || "Publications"}
          </h2>
          {data.listing.length ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {data.listing.map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="py-8 font-serif text-lg leading-[1.8] text-ink/75">
              No publications have been published in this selection yet.
            </p>
          )}
        </section>
      ) : (
        <>
          {(data.sections || []).map((section) => (
            <Reveal key={section._key}>
              <section
                id={section.slug}
                className="border-t border-ink/20 py-12"
              >
                <h2 className={`${subheading} mb-10`}>{section.title}</h2>
                {section.posts.length ? (
                  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {section.posts.map((post) => (
                      <ArticleCard key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="font-serif text-lg text-ink/70">
                    New writing will appear in this section once it is
                    published.
                  </p>
                )}
              </section>
            </Reveal>
          ))}
          {data.listing.some(
            (post) => !data.latest.some((latest) => latest._id === post._id),
          ) && (
            <section className="border-t border-ink/20 py-12">
              <h2 className={`${subheading} mb-10`}>More to read</h2>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {data.listing
                  .filter(
                    (post) =>
                      !data.latest.some((latest) => latest._id === post._id),
                  )
                  .map((post) => (
                    <ArticleCard key={post._id} post={post} />
                  ))}
              </div>
            </section>
          )}
        </>
      )}
      {data.total > 12 && (
        <nav
          aria-label="Publication pages"
          className="flex items-center justify-between border-t border-ink/20 py-8 font-sans text-sm"
        >
          {page > 1 ? (
            <Link
              href={magazineLink(category, page - 1)}
              className="inline-flex min-h-11 items-center hover:text-forest"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span>
            Page {page} of {Math.ceil(data.total / 12)}
          </span>
          {page * 12 < data.total ? (
            <Link
              href={magazineLink(category, page + 1)}
              className="inline-flex min-h-11 items-center hover:text-forest"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
export default function Publications({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <main id="main-content" className="bg-white">
      <Container>
        <header className="pb-10 pt-14 md:pb-14 md:pt-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <p className={cn(label, "text-rust")}>
                The ONEGOODJUNE literary magazine
              </p>
              <h1 className="mt-5 font-heading text-[3.25rem] leading-none tracking-[-0.03em] sm:text-[4.5rem] lg:text-[5.5rem]">
                Read Pubs
              </h1>
            </div>
            <p className={cn(leadText, "max-w-xl text-ink/80 lg:col-span-6")}>
              Fiction, poetry, essays, creative nonfiction and moving pieces on
              industry shifts by contemporary faith-based voices in Africa.
            </p>
          </div>
          <ColorBar className="mt-10 h-1.5 md:mt-12" />
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-heading text-[1.25rem] tracking-[-0.01em] text-ink/80 md:text-[1.5rem]">
            {masthead.split(/\s{2,}/).map((word) => (
              <span key={word}>{word}</span>
            ))}
          </p>
        </header>
        <Suspense
          fallback={
            <p className={cn(leadText, "py-20 text-ink/70")} role="status">
              Opening the magazine…
            </p>
          }
        >
          <Magazine searchParams={searchParams} />
        </Suspense>
      </Container>
    </main>
  );
}
