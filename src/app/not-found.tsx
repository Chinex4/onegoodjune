import Link from "next/link";
import {
  ArrowIcon,
  ColorBar,
  buttonStyles,
  label,
  lead,
} from "@/components/site/primitives";
import { cn } from "@/lib/utils";
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-24"
    >
      <Link
        href="/"
        className="font-heading text-[1.75rem] leading-none tracking-[-0.03em]"
      >
        ONEGOODJUNE
      </Link>
      <ColorBar className="mt-4 h-1.5 w-44" />
      <p className={cn(label, "mt-16 text-rust")}>404 · Page not found</p>
      <h1 className="mt-6 font-heading text-[2.5rem] leading-[1.08] tracking-[-0.02em] md:text-[3.25rem]">
        This page hasn&apos;t found its way here.
      </h1>
      <p className={cn(lead, "mt-6 text-ink/80")}>
        The page may have moved, or the publication may not be available yet.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className={buttonStyles("ink")}>
          Return home
          <ArrowIcon />
        </Link>
        <Link href="/read-pubs" className={buttonStyles("outline")}>
          Read Pubs
          <ArrowIcon />
        </Link>
      </div>
    </main>
  );
}
