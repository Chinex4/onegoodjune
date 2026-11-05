import { SponsoredLabel } from "@/components/editorial/sponsored-label";
import { ArticleStart } from "@/components/editorial/article-start";
import { Fragment, Suspense } from "react";
import { NewsletterSection } from "@/components/site/newsletter";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getRelated } from "@/sanity/client";
import { imageUrl } from "@/sanity/images";
import {
  ArticleCard,
  articleDate,
  readingMinutes,
} from "@/components/editorial/article-card";
import { RichText } from "@/components/editorial/rich-text";
import { ShareLinks } from "@/components/editorial/share-links";
import { ArticleSkeleton } from "@/components/editorial/skeletons";
import { DraftNotice } from "@/components/editorial/draft-notice";
import {
  ColorBar,
  Container,
  label,
  subheading,
} from "@/components/site/primitives";
import { postAuthors } from "@/lib/editorial-format";
import { cn } from "@/lib/utils";
import { articleSearchCopy, pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-config";
import type { Metadata } from "next";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post)
    return { title: "Publication not found", robots: { index: false } };
  const image = imageUrl(post.seo?.image, 1200) || imageUrl(post.mainImage, 1200);
  const { title: searchTitle, description: searchDescription } = articleSearchCopy(post);
  return {
    ...pageMetadata(
      searchTitle,
      searchDescription,
      `/pubs/${post.slug}`,
    ),
    twitter: {
      card: "summary_large_image",
      title: searchTitle,
      description: searchDescription,
      images: [image || "/opengraph-image"],
    },
    openGraph: {
      type: "article",
      title: searchTitle,
      description: searchDescription,
      url: `/pubs/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author ? [post.author.name] : [],
      images: image ? [{ url: image }] : [{ url: "/opengraph-image" }],
    },
  };
}
async function Article({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelated(post);
  const image = imageUrl(post.mainImage, 2400);
  const authors = postAuthors(post);
  const articleUrl = `${site.url}/pubs/${post.slug}`;
  const person = (author: (typeof authors)[number]) => ({
    "@type": "Person",
    name: author.name,
    ...(author.slug && {
      url: `${site.url}/contributors/${author.slug}`,
    }),
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    image: image ? [image] : undefined,
    author: authors.length ? authors.map(person) : undefined,
    publisher: { "@type": "Organization", name: "ONEGOODJUNE" },
    mainEntityOfPage: articleUrl,
  };
  return (
    <>
      <ArticleStart slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* The image stays pinned while the article slides up over it. */}
      <div className="relative">
        {image && (
          <div className="sticky top-[4.5rem] h-[66vw] max-h-[calc(100dvh-4.5rem)] md:top-20 md:h-[70vh] md:max-h-none">
            <Image
              src={image}
              alt={post.mainImage?.alt || post.title}
              fill
              sizes="100vw"
              loading="eager"
              className="object-cover"
              style={
                post.mainImage?.hotspot && {
                  objectPosition: `${post.mainImage.hotspot.x * 100}% ${post.mainImage.hotspot.y * 100}%`,
                }
              }
            />
          </div>
        )}
        <div className="relative bg-white">
          <Container>
            <DraftNotice />
            <header className="mx-auto max-w-3xl pb-6 pt-6 text-center md:pb-8 md:pt-8">
              <a
                href={
                  post.category
                    ? `/pubs?category=${post.category.slug}`
                    : "/pubs"
                }
                className={cn(
                  label,
                  "inline-flex min-h-11 items-center text-rust hover:text-ink",
                )}
              >
                {post.category?.title || "Publication"}
              </a>
              <div><SponsoredLabel post={post} /></div>
              <h1 className="mt-1 font-serif text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] md:text-[2.75rem]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mx-auto mt-4 max-w-2xl font-serif text-[1.1875rem] italic leading-[1.15] text-ink/80 md:text-[1.3125rem]">
                  {post.excerpt}
                </p>
              )}
              <p className="mt-5 font-sans text-[0.875rem] font-semibold leading-[1.35] text-ink">
                {authors.length ? (
                  authors.map((author, index) => (
                    <Fragment key={author._id}>
                      {index > 0 &&
                        (index === authors.length - 1 ? " and " : ", ")}
                      {author.slug ? (
                        <Link
                          href={`/contributors/${author.slug}`}
                          className="underline decoration-ink/30 underline-offset-4 hover:text-forest hover:decoration-forest"
                        >
                          {author.name}
                        </Link>
                      ) : (
                        author.name
                      )}
                    </Fragment>
                  ))
                ) : (
                  "ONEGOODJUNE"
                )}
              </p>
              <p className="mt-2 font-sans text-[0.8125rem] leading-normal text-ink/75">
                <time dateTime={post.publishedAt}>
                  {articleDate(post.publishedAt)}
                </time>{" "}
                · {readingMinutes(post.text)} min read
              </p>
              {(post.mainImage?.caption || post.mainImage?.credit) && (
                <p className="mx-auto mt-2 max-w-2xl font-serif text-[0.9375rem] italic leading-[1.25] text-ink/70">
                  {post.mainImage.caption}
                  {post.mainImage.caption && post.mainImage.credit && " — "}
                  {post.mainImage.credit}
                </p>
              )}
              <ShareLinks url={articleUrl} title={post.title} />
              <ColorBar className="mx-auto mt-3 h-1 max-w-40" />
            </header>
            <article className="drop-cap mx-auto max-w-[720px] break-words pb-12 md:pb-16">
              <RichText body={post.body} />
            </article>
            {related.length > 0 && (
              <section className="border-t border-ink/20 py-16">
                <h2 className={`${subheading} mb-10`}>Keep reading</h2>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <ArticleCard key={p._id} post={p} />
                  ))}
                </div>
              </section>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}
export default function ArticlePage(props: Props) {
  return (
    <main id="main-content">
      <Suspense
        fallback={<ArticleSkeleton />}
      >
        <Article {...props} />
      </Suspense>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
