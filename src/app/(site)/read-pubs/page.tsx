import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCategories, getMagazine } from "@/sanity/client";
import { ArticleCard } from "@/components/editorial/article-card";
import { DraftNotice } from "@/components/editorial/draft-notice";
import { Container, subheading } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Read Pubs",
  "Fiction, poetry, essays, creative nonfiction and moving pieces on industry shifts by contemporary faith-based voices in Africa.",
  "/read-pubs",
);
type Params = Promise<{ category?: string; page?: string }>;
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
      <nav
        aria-label="Publication categories"
        className="my-8 flex flex-wrap gap-x-7 gap-y-1 bg-black px-6 py-3 text-white"
      >
        <Link
          href="/read-pubs"
          aria-current={!category ? "page" : undefined}
          className={`inline-flex min-h-11 items-center font-sans text-sm ${!category ? "text-lime" : "hover:text-lime"}`}
        >
          All publications
        </Link>
        {categories.map((c) => (
          <Link
            key={c._id}
            href={magazineLink(c.slug)}
            aria-current={category === c.slug ? "page" : undefined}
            className={`inline-flex min-h-11 items-center font-sans text-sm ${category === c.slug ? "text-lime" : "hover:text-lime"}`}
          >
            {c.title}
          </Link>
        ))}
      </nav>
      {!category && page === 1 && lead && (
        <section
          className="border-b border-ink/20 py-8 pb-14"
          aria-label="Featured article"
        >
          <h2 className="mb-7 font-sans text-sm">Featured story</h2>
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
        <section className="my-12 bg-neutral-100 p-7 md:p-12">
          <h2 className="font-serif text-3xl">The next story is on its way.</h2>
          <p className="mt-5 max-w-xl text-base leading-[1.8]">
            Our literary publications will appear here once they are published.
            In the meantime, explore our submission guidelines or read the
            newsletter.
          </p>
          <div className="mt-7 flex flex-wrap gap-8">
            <Link
              href="/submissions"
              className="inline-flex min-h-11 items-center border-b border-ink text-sm font-sans"
            >
              Submission guidelines ↗
            </Link>
            <a
              href="https://onegoodjune.substack.com"
              className="inline-flex min-h-11 items-center border-b border-ink text-sm font-sans"
            >
              Read the Newsletter ↗
            </a>
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
            <p className="py-8 text-base leading-[1.8]">
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
                  <p className="text-lg text-ink/70">
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
          className="flex items-center justify-between border-t border-ink/20 py-8 font-sans text-xs"
        >
          {page > 1 ? (
            <Link href={magazineLink(category, page - 1)} className="py-3">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span>
            Page {page} of {Math.ceil(data.total / 12)}
          </span>
          {page * 12 < data.total ? (
            <Link href={magazineLink(category, page + 1)} className="py-3">
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
        <header className="grid items-end gap-8 pb-8 pt-10 md:grid-cols-[1fr_1fr] md:pb-10 md:pt-14">
          <h1 className="font-heading text-[27px] leading-[1.9] tracking-[-0.045em] md:text-[39px]">
            Read Pubs
          </h1>
          <div>
            <p className="font-sans text-sm">
              The ONEGOODJUNE literary magazine
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed">
              Fiction, poetry, essays, creative nonfiction and moving pieces on
              industry shifts by contemporary faith-based voices in Africa.
            </p>
          </div>
        </header>
        <Suspense
          fallback={
            <p className="py-20 text-xl" role="status">
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
