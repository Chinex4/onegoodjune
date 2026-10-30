import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { imageUrl } from "@/sanity/images";
import type { Post, EditorialImage } from "@/sanity/types";
export function safeHref(href?: string) {
  return href &&
    (/^(https?:\/\/|mailto:)/i.test(href) ||
      (href.startsWith("/") && !href.startsWith("//")))
    ? href
    : undefined;
}
export function RichText({ body }: { body: Post["body"] }) {
  return (
    <PortableText
      value={body || []}
      components={{
        block: {
          normal: ({ children }) => (
            <p className="my-6 font-serif text-[1.1875rem] leading-[1.8] md:text-[1.3125rem]">
              {children}
            </p>
          ),
          h2: ({ children }) => (
            <h2 className="mb-6 mt-14 font-serif text-[1.75rem] font-semibold leading-snug md:text-[2rem]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-5 mt-12 font-serif text-[1.5rem] font-semibold leading-snug">
              {children}
            </h3>
          ),
          // Section markers such as "II" or "★" between parts of a story.
          h4: ({ children }) => (
            <p
              role="separator"
              className="my-12 text-center font-heading text-[1.25rem] tracking-[0.2em] text-rust"
            >
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-12 border-l-4 border-orange pl-7 font-serif text-[1.625rem] italic leading-[1.5]">
              {children}
            </blockquote>
          ),
        },
        list: {
          bullet: ({ children }) => (
            <ul className="my-7 list-disc space-y-3 pl-6 text-lg leading-relaxed">
              {children}
            </ul>
          ),
          number: ({ children }) => (
            <ol className="my-7 list-decimal space-y-3 pl-6 text-lg leading-relaxed">
              {children}
            </ol>
          ),
        },
        marks: {
          link: ({ value, children }) => {
            const href = safeHref(value?.href);
            return href ? (
              <a
                href={href}
                className="break-words text-forest underline decoration-forest/40 underline-offset-4 hover:decoration-forest"
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                {children}
              </a>
            ) : (
              <span>{children}</span>
            );
          },
        },
        types: {
          editorialImage: ({ value }: { value: EditorialImage }) => {
            const url = imageUrl(value, 1600);
            return url ? (
              <figure className="my-12">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={url}
                    alt={value.alt || "Article illustration"}
                    fill
                    sizes="(max-width: 768px) 100vw, 760px"
                    className="object-contain"
                  />
                </div>
                {(value.caption || value.credit) && (
                  <figcaption className="mt-4 font-sans text-xs leading-relaxed text-ink/70">
                    {value.caption}
                    {value.credit && ` — ${value.credit}`}
                  </figcaption>
                )}
              </figure>
            ) : null;
          },
        },
      }}
    />
  );
}
