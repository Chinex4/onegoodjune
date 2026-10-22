import { Suspense } from "react";
import Link from "next/link";
import { Studio } from "./studio";
import { sanityConfigured } from "@/sanity/env";
export const metadata = {
  title: "Editorial Studio | OneGoodJune",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  return sanityConfigured ? (
    <Suspense
      fallback={<p className="p-10 font-sans">Opening editorial studio…</p>}
    >
      <Studio />
    </Suspense>
  ) : (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-heading text-2xl leading-[2]">
        OneGoodJune Editorial Studio
      </h1>
      <p className="mt-8 text-xl leading-relaxed">
        Sanity has not been connected yet. Add your project ID and dataset to
        the environment configuration, then restart the application.
      </p>
      <Link className="mt-8 inline-block underline" href="/read-pubs">
        Return to the magazine
      </Link>
    </main>
  );
}
