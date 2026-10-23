import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navigation, site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ArrowIcon, ColorBar, Container, label, lead } from "./primitives";
export function SocialLinks({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <ul
      aria-label="Social media"
      className={cn("flex flex-wrap gap-x-7 gap-y-1 font-sans text-sm", className)}
    >
      {(
        [
          ["LinkedIn", site.links.linkedin],
          ["Instagram", site.links.instagram],
          ["YouTube", site.links.youtube],
        ] as const
      ).map(([name, href]) => (
        <li key={name}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-11 items-center gap-1.5 font-medium transition-colors ${dark ? "hover:text-lime" : "hover:text-forest"}`}
            >
              {name}
              <ArrowIcon size={14} />
            </a>
          ) : (
            // Profile URLs are not yet supplied; shown muted so they don't read as links.
            <span
              className={`inline-flex min-h-11 items-center ${dark ? "text-white/55" : "text-ink/65"}`}
              title={`${name} link coming soon`}
            >
              {name}
              <span className="sr-only"> — link coming soon</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
const columns = [
  {
    title: "Studio",
    links: navigation.filter((item) =>
      ["/about", "/read-pubs", "/submissions"].includes(item.href),
    ),
  },
  {
    title: "Programs",
    links: navigation.filter((item) =>
      ["/school-of-growth", "/fiction-writing"].includes(item.href),
    ),
  },
];
const footerLink =
  "inline-flex min-h-10 items-center font-sans text-sm transition-colors hover:text-lime";
export function Footer() {
  return (
    <footer className="ground-dark pt-1">
      <ColorBar />
      <Container className="pb-8 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className={cn(lead, "max-w-md")}>
              Raising the bar in faith-based African fiction. Helping creative
              minds flourish.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex min-h-11 items-center gap-3 border-b border-white/40 font-sans text-sm font-medium transition-colors hover:border-lime hover:text-lime"
            >
              Get in touch
              <ArrowIcon size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className={cn(label, "mb-4 text-white/50")}>
                  {column.title}
                </p>
                <ul>
                  {column.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={footerLink}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <p className={cn(label, "mb-4 text-white/50")}>Follow OGJ</p>
              <SocialLinks dark className="flex-col gap-0" />
              <a
                href={site.links.newsletter}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(footerLink, "group gap-1.5")}
              >
                Read the Newsletter
                <ArrowIcon size={14} />
              </a>
            </div>
          </div>
        </div>
        {/* Sized in container units so the wordmark always spans the column. */}
        <div className="@container mt-16 md:mt-24">
          <Link
            href="/"
            aria-label="OneGoodJune home"
            className="block whitespace-nowrap font-heading text-[16.6cqw] leading-[0.95] tracking-[-0.035em] transition-colors hover:text-lime"
          >
            ONEGOODJUNE
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 font-sans text-[0.8125rem] leading-relaxed text-white/70 md:flex md:gap-8">
          <p className="col-span-2">
            © 2026 OneGoodJune Studios (OneGoodJune Limited). All Rights
            Reserved.
          </p>
          <p className="col-span-2 md:mr-auto">Lagos, Nigeria</p>
          <Link
            href="/privacy-policy"
            className="inline-flex min-h-10 items-center hover:text-lime"
          >
            Privacy Policy
          </Link>
          <a
            href="#top"
            className="group inline-flex min-h-10 items-center gap-2 justify-self-end hover:text-lime"
          >
            Back to top
            <ArrowUp
              size={14}
              aria-hidden="true"
              className="motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </Container>
    </footer>
  );
}
