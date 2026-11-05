import assert from "node:assert/strict";
import { test } from "node:test";
import {
  eventDates,
  eventIsUpcoming,
  eventSummary,
} from "../src/lib/event-format";
import { imageSize } from "../src/sanity/images";
import type { EditorialImage, Event } from "../src/sanity/types";

const dates = (startsAt: string, endsAt?: string | null) =>
  eventDates({ startsAt, endsAt });

test("event dates show one day or a range in Lagos time", () => {
  assert.equal(dates("2026-12-12T09:00:00Z"), "Dec 12, 2026");
  assert.equal(
    dates("2026-12-12T09:00:00Z", "2026-12-14T17:00:00Z"),
    "Dec 12 – 14, 2026",
  );
  assert.equal(
    dates("2026-11-30T09:00:00Z", "2026-12-02T17:00:00Z"),
    "Nov 30 – Dec 02, 2026",
  );
  assert.equal(
    dates("2026-12-30T09:00:00Z", "2027-01-02T17:00:00Z"),
    "Dec 30, 2026 – Jan 02, 2027",
  );
});

test("an end on the same Lagos day, or before the start, shows one date", () => {
  assert.equal(
    dates("2026-12-12T09:00:00Z", "2026-12-12T22:30:00Z"),
    "Dec 12, 2026",
  );
  assert.equal(
    dates("2026-12-12T09:00:00Z", "2026-12-10T09:00:00Z"),
    "Dec 12, 2026",
  );
});

test("a multi-day event stays upcoming until it finishes", () => {
  const event = {
    startsAt: "2026-12-12T09:00:00Z",
    endsAt: "2026-12-14T17:00:00Z",
  };
  assert.equal(eventIsUpcoming(event, Date.parse("2026-12-13T09:00:00Z")), true);
  assert.equal(eventIsUpcoming(event, Date.parse("2026-12-15T09:00:00Z")), false);
  assert.equal(
    eventIsUpcoming(
      { startsAt: event.startsAt },
      Date.parse("2026-12-13T09:00:00Z"),
    ),
    false,
  );
});

test("event summaries read rich text and fall back to older plain text", () => {
  const details = [
    { _type: "block", _key: "a", children: [{ _type: "span", _key: "b", text: "Join us." }] },
    { _type: "editorialImage", asset: { _ref: "image-abc-10x10-jpg" } },
  ] as Event["details"];
  assert.equal(eventSummary({ details, description: "Old" }), "Join us.");
  assert.equal(eventSummary({ details: [], description: " Old " }), "Old");
  assert.equal(eventSummary({}), "");
});

test("flyer size comes from the asset and respects a crop", () => {
  const image = {
    _type: "editorialImage",
    asset: { _ref: "image-abc-1800x1200-jpg" },
  } as EditorialImage;
  assert.deepEqual(imageSize(image), { width: 1800, height: 1200 });
  assert.deepEqual(
    imageSize({ ...image, crop: { top: 0.25, bottom: 0.25, left: 0, right: 0 } }),
    { width: 1800, height: 600 },
  );
  assert.equal(imageSize(undefined), null);
});
