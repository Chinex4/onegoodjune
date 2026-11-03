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
  const photo = imageUrl(author.image, 1800) || (author.name.trim().toLowerCase() === "chidinma nnalue" ? "/images/chidinma-nnalue.jpg" : null);
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
        <header className="border-b border-ink/15 pb-6 pt-0 md:pb-8">
          {photo && (
            <div className="relative left-1/2 aspect-[16/9] w-screen -translate-x-1/2 overflow-hidden bg-paper md:max-h-[520px]">
              <Image
                src={photo}
                alt={author.image?.alt || author.name}
                fill
                sizes="100vw"
                className="object-cover object-[center_30%]"
                priority
              />
            </div>
          )}
          <div className="mt-6 max-w-3xl">
            <p className={cn(label, "text-rust")}>{author.profileHeading || "About the contributor"}</p>
            <h1 className="mt-3 font-serif text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] md:text-[2.25rem]">
              {author.name}
            </h1>
            {author.role && (
              <p className="mt-2 font-sans text-sm text-ink/70">
                {author.role}
              </p>
            )}
            {author.bio && (
              <p className="mt-5 max-w-2xl whitespace-pre-line font-serif text-[1.0625rem] leading-[1.5] text-ink/85 md:text-lg">
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
          <h2 className={cn(subheading, "mb-8")}>{author.worksHeading || "Other published works"}</h2>
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
