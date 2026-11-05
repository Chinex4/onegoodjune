import { toPlainText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import type { Event } from "@/sanity/types";
import { heroDate } from "./editorial-format";
// Events are scheduled in Lagos time (WAT); show them that way everywhere.
const zone = { timeZone: "Africa/Lagos" } as const;
export const eventDate = heroDate;
export const eventTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    ...zone,
    hour: "numeric",
    minute: "2-digit",
  })
    .format(new Date(iso))
    .replace(":00", "") + " WAT";
export const eventDay = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { ...zone, day: "2-digit" }).format(
    new Date(iso),
  );
export const eventMonth = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { ...zone, month: "short" }).format(
    new Date(iso),
  );
const eventYear = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { ...zone, year: "numeric" }).format(
    new Date(iso),
  );
// Dec 12 – 14, 2026; Nov 30 – Dec 02, 2026; Dec 30, 2026 – Jan 02, 2027.
export function eventDates({ startsAt, endsAt }: Pick<Event, "startsAt" | "endsAt">) {
  const start = eventDate(startsAt);
  if (!endsAt || !(Date.parse(endsAt) > Date.parse(startsAt))) return start;
  const end = eventDate(endsAt);
  if (end === start) return start;
  const year = eventYear(endsAt);
  if (eventYear(startsAt) !== year) return `${start} – ${end}`;
  const from = `${eventMonth(startsAt)} ${eventDay(startsAt)}`;
  const to =
    eventMonth(startsAt) === eventMonth(endsAt)
      ? eventDay(endsAt)
      : `${eventMonth(endsAt)} ${eventDay(endsAt)}`;
  return `${from} – ${to}, ${year}`;
}
export const isUpcoming = (iso: string, now = Date.now()) =>
  Date.parse(iso) > now;
// Multi-day events stay upcoming until they finish.
export const eventIsUpcoming = (
  { startsAt, endsAt }: Pick<Event, "startsAt" | "endsAt">,
  now = Date.now(),
) => isUpcoming(endsAt || startsAt, now);
// Rich description as plain text for metadata; older events only have plain text.
export const eventSummary = ({ details, description }: Pick<Event, "details" | "description">) =>
  (details?.length
    ? toPlainText(details.filter((block) => block._type === "block") as PortableTextBlock[])
    : description || ""
  ).trim();
