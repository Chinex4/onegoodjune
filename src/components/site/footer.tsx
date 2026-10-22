import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site-config";
import { ActionLink } from "./action-link";
import { Container } from "./primitives";
export function SocialLinks() {
  return (
    <div
      aria-label="Social media"
      className="flex flex-wrap gap-6 font-sans text-xs"
    >
      {(
        [
          ["LinkedIn", site.links.linkedin],
          ["Instagram", site.links.instagram],
          ["YouTube", site.links.youtube],
        ] as const
      ).map(([name, href]) =>
        href ? (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 hover:text-forest"
          >
            {name}
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <span
            key={name}
            className="inline-flex min-h-11 items-center border-b border-dotted border-ink/40 text-ink/70"
            title={`${name} URL to be supplied`}
          >
            {name}
            <span className="sr-only"> — link coming soon</span>
          </span>
        ),
      )}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="bg-paper pb-6 pt-16">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <p className="text-xl leading-relaxed">
            Raising the bar in faith-based African fiction.
            <br />
            Helping creative minds flourish.
          </p>
          <SocialLinks />
        </div>
        <div
          aria-label="OneGoodJune"
          className="my-10 whitespace-nowrap font-heading text-[6.6vw] leading-[2] tracking-[-0.065em] xl:text-[35px]"
        >
          OneGoodJune
        </div>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-y border-ink/15 py-4">
          <ActionLink href="/contact" variant="plain">
            Get In Touch
          </ActionLink>
          <ActionLink href="/privacy-policy" variant="plain">
            Privacy Policy
          </ActionLink>
          <a
            href={site.links.newsletter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-sans text-xs hover:text-forest"
          >
            Read the Newsletter
            <ArrowUpRight size={14} />
          </a>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center font-sans text-xs md:ml-auto"
          >
            Back to top ↑
          </a>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-between gap-3 font-sans text-[10px] leading-relaxed text-ink/70 md:flex-row">
          <p>
            © 2026 OneGoodJune Studios (OneGoodJune Limited). All Rights
            Reserved.
          </p>
          <p>Lagos, Nigeria</p>
        </div>
      </Container>
    </footer>
  );
}
