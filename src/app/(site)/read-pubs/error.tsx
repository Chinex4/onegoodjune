"use client";
import { RotateCcw } from "lucide-react";
import {
  ArrowIcon,
  buttonStyles,
  label,
  lead,
} from "@/components/site/primitives";
import { cn } from "@/lib/utils";
export default function MagazineError({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-24">
      <p className={cn(label, "text-rust")}>Read Pubs</p>
      <h1 className="mt-6 font-heading text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
        We couldn&apos;t open the magazine.
      </h1>
      <p className={cn(lead, "my-6 text-ink/80")}>
        Please try again in a moment.
      </p>
      <button onClick={reset} className={buttonStyles("ink")}>
        Try again
        <ArrowIcon Icon={RotateCcw} />
      </button>
    </main>
  );
}
