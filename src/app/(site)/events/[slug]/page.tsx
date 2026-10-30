import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { getEvent } from "@/sanity/client";
import { EventFlyer } from "@/components/editorial/event-flyer";
import { EventForm } from "@/components/site/event-form";
import { NewsletterSection } from "@/components/site/newsletter";
import { Container, label, lead } from "@/components/site/primitives";
import { registrationIsOpen } from "@/lib/event-registrations";
import { eventDate, eventTime } from "@/lib/event-format";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found", robots: { index: false } };
  return pageMetadata(
    event.title,
    event.description.slice(0, 160),
    `/events/${slug}`,
  );
}
async function EventDetail({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const open = registrationIsOpen(event);
  const facts = [
    { Icon: CalendarDays, text: eventDate(event.startsAt) },
    { Icon: Clock, text: eventTime(event.startsAt) },
    { Icon: MapPin, text: event.location },
    ...(event.admission ? [{ Icon: Ticket, text: event.admission }] : []),
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    eventAttendanceMode: /virtual|zoom|online/i.test(event.location)
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: `${site.url}/events/${slug}` },
    organizer: { "@type": "Organization", name: "OneGoodJune", url: site.url },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="pb-16 pt-10 md:pb-24 md:pt-14">
        <Link
          href="/events"
          className="inline-flex min-h-11 items-center font-sans text-sm font-medium text-ink/70 hover:text-forest"
        >
          ← All events
        </Link>
        <EventFlyer
          event={event}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="mt-4"
        />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className={cn(label, "text-forest")}>OneGoodJune Events</p>
            <h1 className="mt-4 font-serif text-[2rem] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[2.75rem]">
              {event.title}
            </h1>
            <ul className="mt-6 grid gap-3 border-y border-ink/15 py-5 sm:grid-cols-2">
              {facts.map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 font-sans text-[0.9375rem] font-medium"
                >
                  <Icon
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-forest"
                  />
                  {text}
                </li>
              ))}
            </ul>
            <p className={cn(lead, "mt-8 whitespace-pre-line text-ink/85")}>
              {event.description}
            </p>
          </div>
          <aside
            aria-label="Register"
            className="self-start bg-paper p-6 sm:p-8 lg:sticky lg:top-28 lg:col-span-5"
          >
            <h2 className="font-heading text-[1.5rem] leading-tight tracking-[-0.015em]">
              {open ? "Register for this session" : "Registration has closed"}
            </h2>
            {open ? (
              <div className="mt-6">
                <EventForm event={event.slug} question={event.question} />
              </div>
            ) : (
              <p className="mt-4 font-serif text-lg text-ink/80">
                This event has ended or is no longer taking registrations.{" "}
                <Link
                  href="/events"
                  className="underline underline-offset-4 hover:text-forest"
                >
                  See upcoming events
                </Link>
                .
              </p>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
export default function EventPage(props: Props) {
  return (
    <main id="main-content">
      <Suspense
        fallback={
          <Container className="py-24">
            <p role="status" className={cn(lead, "text-ink/70")}>
              Loading event…
            </p>
          </Container>
        }
      >
        <EventDetail {...props} />
      </Suspense>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
