import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Check, CircleAlert } from "lucide-react";
import {
  ArrowIcon,
  ColorBar,
  Container,
  buttonStyles,
  label,
  lead,
} from "@/components/site/primitives";
import { consultation as c } from "@/content/consultation";
import { mongoConfigured } from "@/lib/mongodb";
import { verifyTransaction } from "@/lib/paystack";
import { applyTransaction, findRegistration } from "@/lib/registrations";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "Book your consultation",
  robots: { index: false, follow: false },
};
type Params = Promise<{ reference?: string }>;
// Only a paid Author Business Consultation unlocks the scheduler.
async function paidBooking(reference: string) {
  if (!/^OGJ-AUTHOR-CONSULTATION-[A-Z0-9-]{4,60}$/.test(reference)) return null;
  if (!mongoConfigured()) return null;
  let registration = await findRegistration(reference);
  if (registration && registration.status !== "paid") {
    try {
      registration =
        (await applyTransaction(
          await verifyTransaction(reference),
          "callback",
        )) ?? registration;
    } catch {}
  }
  return registration?.status === "paid" ? registration : null;
}
const steps = ["Payment received", "Choose your time", "Short questionnaire"];
async function Booking({ searchParams }: { searchParams: Params }) {
  // Payment state is per request and time-dependent.
  await connection();
  const { reference = "" } = await searchParams;
  const booking = await paidBooking(reference);
  if (!booking)
    return (
      <Container className="max-w-2xl py-20">
        <CircleAlert size={36} aria-hidden="true" className="text-rust" />
        <h1 className="mt-6 font-heading text-[2rem] leading-tight tracking-[-0.02em]">
          We couldn&apos;t find a paid booking for this link.
        </h1>
        <p className={cn(lead, "mt-5 text-ink/80")}>
          Use the link from your payment confirmation page. If you&apos;ve paid
          and still see this, email sayhi@onegoodjune.com with your payment
          reference and we&apos;ll send your booking link.
        </p>
        <Link
          href="/author-consultation"
          className={buttonStyles("ink", "mt-8")}
        >
          About the consultation
          <ArrowIcon />
        </Link>
      </Container>
    );
  const firstName = booking.name.split(" ")[0];
  return (
    <>
      <section className="bg-earth text-white [--focus-ring:var(--color-straw)]">
        <Container className="py-12 md:py-16">
          <p className={cn(label, "text-straw")}>
            Author Business Consultation
          </p>
          <h1 className="mt-4 font-heading text-[2.25rem] leading-[1.05] tracking-[-0.03em] md:text-[3.25rem]">
            You&apos;re in, {firstName}. Let&apos;s find a time.
          </h1>
          <p className={cn(lead, "mt-5 max-w-2xl text-white/85")}>
            {c.steps[0].text}
          </p>
          <ol className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-sans text-sm">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-7 place-items-center text-xs font-semibold",
                    i === 0 ? "bg-straw text-ink" : "border border-white/40",
                  )}
                >
                  {i === 0 ? <Check size={14} aria-hidden="true" /> : i + 1}
                </span>
                {step}
                {i === 0 && <span className="sr-only"> (done)</span>}
              </li>
            ))}
          </ol>
        </Container>
        <ColorBar />
      </section>
      {/* Zoom's scheduler only renders as a top-level page (it stays blank
          inside an iframe), so the calendar opens on its own. */}
      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <h2 className="font-heading text-[1.75rem] leading-tight tracking-[-0.015em] md:text-[2.25rem]">
            Pick a time that works for you
          </h2>
          <p className={cn(lead, "mt-4 text-ink/80")}>
            The calendar opens in Zoom Scheduler. Choose an available hour,
            answer the short questionnaire, and you&apos;ll get a calendar
            invite with the meeting link.
          </p>
          <a
            href={c.scheduler}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles("ink", "mt-8 w-full sm:w-auto")}
          >
            Choose your session time
            <ArrowIcon />
          </a>
          <p className="mt-5 font-sans text-sm text-ink/70">
            Need help? Email sayhi@onegoodjune.com with your reference:{" "}
            <span className="font-mono text-[0.8125rem] text-ink">
              {booking.reference}
            </span>
          </p>
        </div>
        <ol className="grid gap-px self-start bg-ink/15 lg:col-span-5 lg:col-start-8">
          {c.steps.map((step, i) => (
            <li key={step.title} className="bg-white p-6">
              <p className={cn(label, "text-earth")}>
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 font-serif text-[1.0625rem] leading-relaxed text-ink/80">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
export default function BookConsultation({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <main id="main-content" className="min-h-dvh bg-paper">
      <Suspense
        fallback={
          <Container className="py-24">
            <p role="status" className={cn(lead, "text-ink/70")}>
              Confirming your booking…
            </p>
          </Container>
        }
      >
        <Booking searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
