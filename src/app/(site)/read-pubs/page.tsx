import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCategories, getMagazine } from "@/sanity/client";
import type { Post } from "@/sanity/types";
import {
  ArticleCard,
  articleDate,
  readingMinutes,
} from "@/components/editorial/article-card";
import { CoverImage } from "@/components/editorial/cover-image";
import { HeroSlider } from "@/components/editorial/hero-slider";
import { DraftNotice } from "@/components/editorial/draft-notice";
import { NewsletterSection } from "@/components/site/newsletter";
import {
  ArrowIcon,
  ColorBar,
  Container,
  TextLink,
  buttonStyles,
  label,
  lead,
  subheading,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
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
function HeroSlide({ post, first }: { post: Post; first: boolean }) {
  return (
    <article className="group @container grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
      <Link
        href={`/read-pubs/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="md:col-span-7"
      >
        <CoverImage
          post={post}
          width={1400}
          priority={first}
          sizes="(max-width: 768px) 100vw, 58vw"
          className="aspect-[3/2]"
        />
      </Link>
      <div className="md:col-span-5 md:pb-16">
        <p className={cn(label, "text-rust")}>{post.category?.title}</p>
        <h2 className="mt-3 font-serif text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[2.375rem]">
          <Link href={`/read-pubs/${post.slug}`} className="hover:text-forest">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="mt-4 line-clamp-4 font-serif text-[1.0625rem] leading-[1.6] text-ink/80 md:text-lg">
            {post.excerpt}
          </p>
        )}
        <p className="mt-4 font-sans text-xs text-ink/70">
          {post.author?.name ?? "ONEGOODJUNE"} · {articleDate(post.publishedAt)}{" "}
          · {readingMinutes(post.text)} min read
        </p>
        <Link
          href={`/read-pubs/${post.slug}`}
          className={buttonStyles("ink", "mt-6 min-h-11 gap-8 px-5")}
        >
          Read story
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
function HighlightColumn({
  title,
  slug,
  posts,
  empty,
}: {
  title: string;
  slug: string;
  posts: Post[];
  empty: string;
}) {
  return (
    <div>
      <div className="flex min-h-14 items-center justify-between gap-4 border-b border-white/20">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] font-stretch-expanded">
          {title}
        </h2>
        {posts.length > 0 && (
          <Link
            href={magazineLink(slug)}
            className="inline-flex min-h-11 items-center font-sans text-xs font-medium text-white/75 hover:text-lime"
          >
            See all
          </Link>
        )}
      </div>
      {posts.length ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} tone="dark" compact />
          ))}
        </div>
      ) : (
        <p className="mt-6 font-serif text-lg text-white/70">{empty}</p>
      )}
    </div>
  );
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
  const home = !category && page === 1;
  const hero = (data.hero.length ? data.hero : data.heroFallback).slice(0, 5);
  return (
    <>
      <Container>
        <DraftNotice />
        {categories.length > 0 && (
          // The client's segment line doubles as the magazine navigation.
          <nav
            aria-label="Publication categories"
            className="-mx-5 flex gap-x-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <Link
              href="/read-pubs"
              aria-current={!category ? "page" : undefined}
              className="inline-flex min-h-11 shrink-0 items-center font-heading text-[1.125rem] tracking-[-0.01em] text-ink/70 transition-colors hover:text-ink aria-[current=page]:text-rust md:text-[1.25rem]"
            >
              All.
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                href={magazineLink(c.slug)}
                aria-current={category === c.slug ? "page" : undefined}
                className="inline-flex min-h-11 shrink-0 items-center font-heading text-[1.125rem] tracking-[-0.01em] text-ink/70 transition-colors hover:text-ink aria-[current=page]:text-rust md:text-[1.25rem]"
              >
                {c.title}.
              </Link>
            ))}
          </nav>
        )}
      </Container>
      {home && hero.length > 0 && (
        <Container className="pb-14 pt-8 md:pb-20 md:pt-10">
          <HeroSlider>
            {hero.map((post, i) => (
              <HeroSlide key={post._id} post={post} first={i === 0} />
            ))}
          </HeroSlider>
        </Container>
      )}
      {home && (data.newcomer.length > 0 || data.spotlight.length > 0) && (
        <section
          aria-label="Newcomer and Spotlight"
          className="ground-dark py-14 md:py-20"
        >
          <Container className="grid gap-14 lg:grid-cols-2 lg:gap-12">
            <HighlightColumn
              title="Newcomer"
              slug="newcomer"
              posts={data.newcomer}
              empty="New voices will appear here soon."
            />
            <HighlightColumn
              title="Spotlight"
              slug="spotlight"
              posts={data.spotlight}
              empty="Spotlight features are on their way."
            />
          </Container>
        </section>
      )}
      <Container>
        {!data.latest.length && !category ? (
          <section className="my-10 bg-paper p-7 sm:p-10 md:my-14 lg:p-12">
            <p className={cn(label, "text-rust")}>Coming soon</p>
            <h2 className={cn(subheading, "mt-5")}>
              The next story is on its way.
            </h2>
            <p className={cn(lead, "mt-5 max-w-xl text-ink/80")}>
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
          </section>
        ) : null}
        {!home ? (
          <section className="py-10">
            <h2 className={cn(subheading, "mb-8")}>
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
          (data.sections || [])
            .filter((section) => section.posts.length > 0)
            .map((section, i) => (
              <Reveal key={section._key}>
                <section
                  id={section.slug}
                  className={cn("py-12", i > 0 && "border-t border-ink/15")}
                >
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <h2 className={subheading}>{section.title}</h2>
                    <Link
                      href={magazineLink(section.slug)}
                      className="inline-flex min-h-11 items-center font-sans text-sm font-medium hover:text-forest"
                    >
                      See all
                    </Link>
                  </div>
                  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {section.posts.map((post) => (
                      <ArticleCard key={post._id} post={post} />
                    ))}
                  </div>
                </section>
              </Reveal>
            ))
        )}
        {data.total > 12 && !home && (
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
      </Container>
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
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pb-5 pt-10 md:pt-14">
          <div>
            <p className={cn(label, "text-rust")}>
              The ONEGOODJUNE literary magazine
            </p>
            <h1 className="mt-3 font-heading text-[2.5rem] leading-none tracking-[-0.03em] md:text-[3.25rem]">
              Read Pubs
            </h1>
          </div>
          <p className="max-w-md font-serif text-[1.0625rem] leading-[1.55] text-ink/75">
            Fiction, poetry, essays, creative nonfiction and moving pieces on
            industry shifts by contemporary faith-based voices in Africa.
          </p>
        </header>
        <ColorBar className="mb-3 h-1.5" />
      </Container>
      <Suspense
        fallback={
          <Container>
            <p className={cn(lead, "py-20 text-ink/70")} role="status">
              Opening the magazine…
            </p>
          </Container>
        }
      >
        <Magazine searchParams={searchParams} />
      </Suspense>
      <Container className="pb-16">
        <aside className="flex flex-col gap-6 bg-sunshine/20 p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={cn(label, "text-rust")}>For authors</p>
            <p className="mt-3 max-w-xl font-serif text-[1.375rem] font-semibold leading-snug">
              Your book is coming or it&apos;s already here. Let the right
              readers know.
            </p>
          </div>
          <Link
            href="/launch-spotlight"
            className={buttonStyles("ink", "shrink-0")}
          >
            Feature My Book
            <ArrowIcon />
          </Link>
        </aside>
      </Container>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
