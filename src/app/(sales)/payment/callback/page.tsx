import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CircleAlert, CircleCheck, Clock } from "lucide-react";
import {
  ArrowIcon,
  ColorBar,
  buttonStyles,
  label,
  lead,
} from "@/components/site/primitives";
import { verifyTransaction } from "@/lib/paystack";
import { applyTransaction, findRegistration } from "@/lib/registrations";
import { getProgram } from "@/lib/programs";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false },
};
type Params = Promise<{ reference?: string; trxref?: string }>;
async function Status({ searchParams }: { searchParams: Params }) {
  // Payment state is per request and time-dependent.
  await connection();
  const params = await searchParams;
  const reference = params.reference || params.trxref || "";
  let state: "paid" | "pending" | "failed" | "unknown" = "unknown";
  let returnPath = "/";
  let programName = "";
  let next: string | undefined;
  if (/^OGJ-[A-Z0-9-]{6,80}$/.test(reference)) {
    try {
      const tx = await verifyTransaction(reference);
      const registration =
        (await applyTransaction(tx, "callback")) ??
        (await findRegistration(reference));
      const program = registration && getProgram(registration.program);
      returnPath = program?.returnPath ?? "/";
      programName = program?.name ?? "";
      next = program?.successPath;
      state =
        registration?.status === "paid"
          ? "paid"
          : registration?.status === "failed"
            ? "failed"
            : "pending";
    } catch {
      state = "unknown";
    }
  }
  const content = {
    paid: {
      Icon: CircleCheck,
      tone: "text-forest",
      title: "Payment received. Welcome aboard!",
      body: next
        ? `Your ${programName} is paid for. Your receipt is on its way by email. Now choose a time for your session.`
        : `Your registration for ${programName} is confirmed. We've sent a receipt to your email and we'll be in touch with your next steps shortly.`,
    },
    pending: {
      Icon: Clock,
      tone: "text-earth",
      title: "Your payment is still processing.",
      body: "We haven't received a confirmation yet. If you completed the payment, you'll get an email once it clears. You can also try again.",
    },
    failed: {
      Icon: CircleAlert,
      tone: "text-rust",
      title: "Your payment didn't go through.",
      body: "No charge was completed. Please try again, or use a different card or payment method.",
    },
    unknown: {
      Icon: CircleAlert,
      tone: "text-rust",
      title: "We couldn't confirm this payment.",
      body: "Please check the link from your payment page, or email sayhi@onegoodjune.com with your payment reference.",
    },
  }[state];
  return (
    <>
      <content.Icon
        size={40}
        strokeWidth={1.5}
        aria-hidden="true"
        className={content.tone}
      />
      <h1 className="mt-6 font-heading text-[2rem] leading-[1.1] tracking-[-0.02em] md:text-[2.5rem]">
        {content.title}
      </h1>
      <p className={cn(lead, "mt-5 text-ink/80")}>{content.body}</p>
      {reference && (
        <p className={cn(label, "mt-6 break-all text-ink/70")}>
          Reference: {reference}
        </p>
      )}
      {state === "paid" && next ? (
        <Link
          href={`${next}?reference=${encodeURIComponent(reference)}`}
          className={buttonStyles("ink", "mt-10")}
        >
          Choose your session time
          <ArrowIcon />
        </Link>
      ) : (
        <Link href={returnPath} className={buttonStyles("ink", "mt-10")}>
          {state === "paid" ? "Back to the program" : "Try again"}
          <ArrowIcon />
        </Link>
      )}
    </>
  );
}
export default function PaymentCallback({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <main
      id="main-content"
      role="status"
      className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-20"
    >
      <p className="font-heading text-[1.5rem] leading-none tracking-[-0.03em]">
        ONEGOODJUNE
      </p>
      <ColorBar className="mb-14 mt-4 h-1.5 w-40" />
      <Suspense
        fallback={
          <p className={cn(lead, "text-ink/70")}>Confirming your payment…</p>
        }
      >
        <Status searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
