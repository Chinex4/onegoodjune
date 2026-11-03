import { SponsoredLabel } from "@/components/editorial/sponsored-label";
import { ArticleStart } from "@/components/editorial/article-start";
import { Suspense } from "react";
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
import { DraftNotice } from "@/components/editorial/draft-notice";
import {
  ColorBar,
  Container,
  label,
  subheading,
} from "@/components/site/primitives";
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
  const image = imageUrl(post.mainImage, 1800);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    image: image ? [image] : undefined,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.slug && {
            url: `${site.url}/contributors/${post.author.slug}`,
          }),
        }
      : undefined,
    publisher: { "@type": "Organization", name: "ONEGOODJUNE" },
    mainEntityOfPage: `${site.url}/pubs/${post.slug}`,
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
      <Container>
        <DraftNotice />
        <header className="mx-auto max-w-4xl py-8 text-center md:py-12">
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
          <h1 className="mt-4 font-serif text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.015em] md:text-[4rem]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mx-auto mt-7 max-w-2xl font-serif text-[1.375rem] italic leading-[1.5] text-ink/80 md:text-[1.5rem]">
              {post.excerpt}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3 font-sans text-[0.8125rem] leading-normal text-ink/75">
            {post.author?.slug ? (
              <Link
                href={`/contributors/${post.author.slug}`}
                className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:text-forest hover:decoration-forest"
              >
                {post.author.name}
              </Link>
            ) : (
              <span className="font-medium text-ink">
                {post.author?.name || "ONEGOODJUNE"}
              </span>
            )}
            <span>·</span>
            <time dateTime={post.publishedAt}>
              {articleDate(post.publishedAt)}
            </time>
            <span>· {readingMinutes(post.text)} min read</span>
          </div>
          <ColorBar className="mx-auto mt-5 h-1 max-w-40" />
        </header>
        {image && (
          <figure>
            <div className="relative aspect-[16/10] md:aspect-[2/1]">
              <Image
                src={image}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="100vw"
                loading="eager"
                className="object-cover"
              />
            </div>
            {(post.mainImage?.caption || post.mainImage?.credit) && (
              <figcaption className="mt-4 font-sans text-xs leading-normal text-ink/70">
                {post.mainImage.caption}
                {post.mainImage.credit && ` — ${post.mainImage.credit}`}
              </figcaption>
            )}
          </figure>
        )}
        <article
          className={cn(
            "mx-auto max-w-[720px] break-words pb-12 md:pb-16",
            image ? "pt-6 md:pt-8" : "pt-0",
          )}
        >
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
    </>
  );
}
export default function ArticlePage(props: Props) {
  return (
    <main id="main-content">
      <Suspense
        fallback={
          <Container className="py-24">
            <p role="status" className="font-serif text-xl text-ink/70">
              Opening this story…
            </p>
          </Container>
        }
      >
        <Article {...props} />
      </Suspense>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
