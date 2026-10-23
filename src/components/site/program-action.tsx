import Link from "next/link";
import { Clock } from "lucide-react";
import { ActionLink } from "./action-link";
import type { ButtonVariant } from "./primitives";
// Without a configured destination the action shows an honest "opening soon"
// state instead of a dead button.
export function ProgramAction({
  href,
  label,
  kind,
  variant = "orange",
}: {
  href: string | null;
  label: string;
  kind: "waitlist" | "enrollment";
  variant?: ButtonVariant;
}) {
  if (href)
    return (
      <ActionLink href={href} variant={variant}>
        {label}
      </ActionLink>
    );
  return (
    <div>
      <p
        aria-disabled="true"
        className="inline-flex min-h-12 items-center gap-3 border border-dashed border-current/50 px-5 py-3 font-sans text-[0.8125rem] font-medium"
      >
        <Clock size={16} aria-hidden="true" className="shrink-0 text-orange" />
        {label} · opening soon
      </p>
      <p className="mt-4 max-w-md font-sans text-[0.8125rem] leading-relaxed opacity-75">
        {kind === "waitlist"
          ? "Waitlist registration will be available here soon."
          : "Enrollment details are being prepared."}{" "}
        <Link
          href="/contact"
          className="underline underline-offset-4 hover:text-orange"
        >
          Get in touch
        </Link>{" "}
        for updates.
      </p>
    </div>
  );
}
