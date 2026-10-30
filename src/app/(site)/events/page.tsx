import Link from "next/link";
import { Suspense } from "react";
import { getEvents } from "@/sanity/client";
import type { Event } from "@/sanity/types";
import { EventFlyer } from "@/components/editorial/event-flyer";
import { NewsletterSection } from "@/components/site/newsletter";
import {
  Container,
  PageIntro,
  label,
  lead,
  subheading,
} from "@/components/site/primitives";
import { eventDate, eventTime, isUpcoming } from "@/lib/event-format";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
export const metadata = pageMetadata(
  "Events",
  "Virtual sessions, conversations and gatherings for faith-based African writers and creative visionaries.",
  "/events",
);
function EventCard({ event, past }: { event: Event; past?: boolean }) {
  return (
    <article className="group">
      <Link href={`/events/${event.slug}`} className="block">
        <EventFlyer
          event={event}
          sizes="(max-width: 768px) 100vw, 45vw"
          className={cn(past && "grayscale-[60%]")}
        />
        <p className={cn(label, "mt-5", past ? "text-ink/60" : "text-forest")}>
          {eventDate(event.startsAt)} · {eventTime(event.startsAt)}
        </p>
        <h3 className="mt-2 font-serif text-[1.5rem] font-semibold leading-tight transition-colors group-hover:text-forest">
          {event.title}
        </h3>
        <p className="mt-2 font-sans text-sm text-ink/70">
          {event.location}
          {event.admission && ` · ${event.admission}`}
        </p>
      </Link>
    </article>
  );
}
async function EventList() {
  const events = await getEvents();
  // Soonest first for upcoming; most recent first for past.
  const upcoming = events.filter((e) => isUpcoming(e.startsAt)).reverse();
  const past = events.filter((e) => !upcoming.includes(e));
  return (
    <>
      <section className="py-14 md:py-20">
        <h2 className={cn(subheading, "mb-8")}>Upcoming</h2>
        {upcoming.length ? (
          <div className="grid gap-12 md:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className={cn(lead, "max-w-xl text-ink/75")}>
            Our next session is being planned. Join the newsletter below to hear
            about it first.
          </p>
        )}
      </section>
      {past.length > 0 && (
        <section className="border-t border-ink/15 py-14 md:py-20">
          <h2 className={cn(subheading, "mb-8")}>Past events</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event._id} event={event} past />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
export default function Events() {
  return (
    <main id="main-content">
      <Container>
        <PageIntro
          eyebrow="Events & Community"
          title="Events"
          description="From virtual sessions and conversations to in-person events, we create spaces for connection, knowledge exchange, and collaboration for our growing community of writers and creative visionaries."
        />
        <Suspense
          fallback={
            <p role="status" className={cn(lead, "py-20 text-ink/70")}>
              Loading events…
            </p>
          }
        >
          <EventList />
        </Suspense>
      </Container>
      <NewsletterSection className="pt-4" />
    </main>
  );
}
