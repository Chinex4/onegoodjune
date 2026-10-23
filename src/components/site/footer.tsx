import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site-config";
import { Container } from "./primitives";
export function SocialLinks({ dark = false }: { dark?: boolean }) {
  return (
    <div
      aria-label="Social media"
      className="flex flex-wrap gap-6 font-sans text-sm"
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
            className={`inline-flex min-h-11 items-center gap-2 ${dark ? "hover:text-lime" : "hover:text-forest"}`}
          >
            {name}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ) : (
          <span
            key={name}
            className="inline-flex min-h-11 items-center"
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
    <footer className="bg-black pb-7 pt-14 text-white">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <p className="text-base leading-relaxed">
            Raising the bar in faith-based African fiction.
            <br />
            Helping creative minds flourish.
          </p>
          <SocialLinks dark />
        </div>
        <Link
          href="/"
          aria-label="ONEGOODJUNE home"
          className="my-8 block whitespace-nowrap font-heading text-[14px] leading-[2.1] tracking-[-0.055em] sm:text-[20px] lg:text-[28px]"
        >
          ONEGOODJUNE
        </Link>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 font-sans text-sm">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center hover:text-lime"
          >
            Get in touch
          </Link>
          <Link
            href="/privacy-policy"
            className="inline-flex min-h-11 items-center hover:text-lime"
          >
            Privacy Policy
          </Link>
          <a
            href={site.links.newsletter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 hover:text-lime"
          >
            Read the Newsletter
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center hover:text-lime md:ml-auto"
          >
            Back to top ↑
          </a>
        </div>
        <div className="mt-8 flex flex-col-reverse justify-between gap-3 font-sans text-[13px] leading-relaxed md:flex-row">
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
