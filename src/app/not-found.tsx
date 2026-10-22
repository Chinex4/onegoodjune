import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-sans text-xs uppercase tracking-widest text-forest">
        OneGoodJune · 404
      </p>
      <h1 className="mt-8 font-serif text-4xl leading-snug">
        This page hasn&apos;t found its way here.
      </h1>
      <p className="my-7 text-xl leading-relaxed">
        The page may have moved, or the publication may not be available yet.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center bg-ink px-6 font-sans text-xs text-white hover:bg-forest"
      >
        Return home ↗
      </Link>
    </main>
  );
}
