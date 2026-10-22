"use client";
export default function MagazineError({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl">
        We couldn&apos;t open the magazine.
      </h1>
      <p className="my-6 text-xl leading-relaxed">
        Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="min-h-12 bg-ink px-6 py-3 font-sans text-sm text-white hover:bg-forest"
      >
        Try again
      </button>
    </main>
  );
}
