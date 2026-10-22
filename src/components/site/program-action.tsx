import { ActionLink } from "./action-link";
export function ProgramAction({
  href,
  label,
  kind,
}: {
  href: string | null;
  label: string;
  kind: "waitlist" | "enrollment";
}) {
  return (
    <div>
      {href ? (
        <ActionLink href={href}>{label}</ActionLink>
      ) : (
        <>
          <span
            aria-disabled="true"
            className="inline-flex min-h-12 items-center bg-ink/10 px-5 py-4 font-sans text-xs text-ink/65"
          >
            {label}
          </span>
          <p className="mt-4 max-w-md font-sans text-xs leading-relaxed text-ink/75">
            {kind === "waitlist"
              ? "Waitlist registration will be available here soon."
              : "Enrollment details are being prepared."}{" "}
            <a href="/contact" className="underline underline-offset-4">
              Get in touch
            </a>{" "}
            for updates.
          </p>
        </>
      )}
    </div>
  );
}
