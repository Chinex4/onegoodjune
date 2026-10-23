import Link from "next/link";
import { ArrowIcon, ColorBar, Container, buttonStyles } from "./primitives";
import type { ButtonVariant } from "./primitives";
import { cn } from "@/lib/utils";
// Sales pages run without the site navigation; this bar keeps a route home
// and the page's one primary action in view at the top.
export function SalesTopBar({
  cta,
  variant = "lime",
  className = "",
}: {
  cta: { href: string; label: string; newTab?: boolean };
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <div
      className={cn("flex h-20 items-center justify-between gap-6", className)}
    >
      <Link
        href="/"
        aria-label="OneGoodJune home"
        className="font-heading text-[1.375rem] leading-none tracking-[-0.03em] transition-opacity hover:opacity-75 md:text-[1.5rem]"
      >
        ONEGOODJUNE
      </Link>
      <a
        href={cta.href}
        {...(cta.newTab && { target: "_blank", rel: "noopener noreferrer" })}
        className={buttonStyles(
          variant,
          "hidden min-h-11 gap-4 px-5 sm:inline-flex",
        )}
      >
        {cta.label}
        <ArrowIcon size={15} />
      </a>
    </div>
  );
}
export function SalesFooter() {
  return (
    <footer className="ground-dark">
      <ColorBar />
      <Container className="flex flex-col gap-4 py-10 font-sans text-[0.8125rem] leading-relaxed text-white/70 md:flex-row md:items-center md:gap-8">
        <Link
          href="/"
          className="font-heading text-[1.375rem] leading-none tracking-[-0.03em] text-white hover:text-lime"
        >
          ONEGOODJUNE
        </Link>
        <p className="md:mr-auto">
          © 2026 OneGoodJune Studios (OneGoodJune Limited). All Rights Reserved.
        </p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center hover:text-lime"
          >
            Get in touch
          </Link>
          <Link
            href="/privacy-policy"
            className="inline-flex min-h-10 items-center hover:text-lime"
          >
            Privacy Policy
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
