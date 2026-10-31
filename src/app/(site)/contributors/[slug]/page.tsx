import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAuthor } from "@/sanity/client";
import { imageUrl } from "@/sanity/images";
import { ArticleCard } from "@/components/editorial/article-card";
import { NewsletterSection } from "@/components/site/newsletter";
import {
  ArrowIcon,
  ColorBar,
  Container,
  label,
  subheading,
} from "@/components/site/primitives";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author)
    return { title: "Contributor not found", robots: { index: false } };
  return pageMetadata(
    author.name,
    author.bio?.slice(0, 160) ||
      `Read ${author.name}'s writing in Read Pubs, the ONEGOODJUNE literary magazine.`,
    `/contributors/${slug}`,
  );
}
async function Contributor({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();
  const photo = imageUrl(author.image, 600);
  const initials = author.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    url: `${site.url}/contributors/${slug}`,
    sameAs: author.links?.map((link) => link.url),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container>
        <header className="grid gap-8 border-b border-ink/15 pb-12 pt-12 md:grid-cols-12 md:items-center md:gap-10 md:pb-16 md:pt-16">
          <div className="relative aspect-square w-40 overflow-hidden bg-lime md:col-span-3 md:w-full md:max-w-60">
            {photo ? (
              <Image
                src={photo}
                alt={author.image?.alt || author.name}
                fill
                sizes="240px"
                className="object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center font-heading text-[3.5rem] text-ink/80"
              >
                {initials}
              </span>
            )}
          </div>
          <div className="md:col-span-9 md:col-start-4">
            <p className={cn(label, "text-rust")}>Contributor</p>
            <h1 className="mt-3 font-serif text-[2.25rem] font-semibold leading-tight tracking-[-0.01em] md:text-[3rem]">
              {author.name}
            </h1>
            {author.role && (
              <p className="mt-2 font-sans text-sm text-ink/70">
                {author.role}
              </p>
            )}
            {author.bio && (
              <p className="mt-5 max-w-2xl whitespace-pre-line font-serif text-[1.0625rem] leading-[1.7] text-ink/85 md:text-lg">
                {author.bio}
              </p>
            )}
            {author.links && author.links.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-6">
                {author.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-1.5 font-sans text-sm font-medium hover:text-forest"
                    >
                      {link.label}
                      <ArrowIcon size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>
        <ColorBar className="mt-px h-1" />
        <section className="py-12 md:py-16">
          <h2 className={cn(subheading, "mb-8")}>
            {author.posts.length === 1
              ? "Published in Read Pubs"
              : `${author.posts.length} pieces in Read Pubs`}
          </h2>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {author.posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
export default function ContributorPage(props: Props) {
  return (
    <main id="main-content">
      <Suspense
        fallback={
          <Container className="py-24">
            <p role="status" className="font-serif text-xl text-ink/70">
              Opening this profile…
            </p>
          </Container>
        }
      >
        <Contributor {...props} />
      </Suspense>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
