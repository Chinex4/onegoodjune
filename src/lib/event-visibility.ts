import type { Event } from "@/sanity/types";
// This exact brief example was confirmed never to have happened in the review.
// An editor can explicitly set isExample=false for a genuine future edition.
export function isExampleEvent(event: Pick<Event, "title" | "isExample">) {
  return (
    event.isExample === true ||
    (event.isExample !== false &&
      /Manny.*Ada.*Sesan.*Untold Woes/i.test(event.title))
  );
}
