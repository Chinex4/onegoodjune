import "server-only";
import { z } from "zod";
import { getDb } from "./mongodb";
export const eventRegistrationSchema = z.object({
  event: z.string().regex(/^[a-z0-9-]{1,96}$/, "Unknown event."),
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Use 120 characters or fewer.")
    .regex(/^[^\u0000-\u001f\u007f<>]+$/, "Please use a valid name."),
  email: z.email("Please enter a valid email address.").trim().max(254),
  answer: z.string().trim().max(300, "Use 300 characters or fewer.").optional(),
  website: z.string().max(200).optional(),
});
export type EventRegistration = {
  event: string;
  eventTitle: string;
  eventStartsAt: Date;
  question?: string;
  name: string;
  email: string;
  answer?: string;
  createdAt: Date;
};
// Open until the event starts, unless editors close it earlier.
export function registrationIsOpen(
  event: { startsAt: string; registrationOpen?: boolean },
  now = Date.now(),
) {
  return event.registrationOpen !== false && Date.parse(event.startsAt) > now;
}
const collection = async () => {
  const col = (await getDb()).collection<EventRegistration>(
    "eventRegistrations",
  );
  await col.createIndex({ event: 1, email: 1 }, { unique: true });
  return col;
};
// Returns false when this email is already registered for the event.
export async function saveEventRegistration(doc: EventRegistration) {
  try {
    await (await collection()).insertOne(doc);
    return true;
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return false;
    throw error;
  }
}
export async function listEventRegistrations(filters: {
  event?: string;
  q?: string;
}) {
  const query: Record<string, unknown> = {};
  if (filters.event) query.event = filters.event;
  if (filters.q) {
    const pattern = new RegExp(
      filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    query.$or = [{ name: pattern }, { email: pattern }, { answer: pattern }];
  }
  return (await collection())
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(2000)
    .toArray();
}
export async function eventRegistrationCounts() {
  return (await collection())
    .aggregate<{ _id: string; title: string; count: number }>([
      {
        $group: {
          _id: "$event",
          title: { $last: "$eventTitle" },
          count: { $sum: 1 },
        },
      },
      { $sort: { title: 1 } },
    ])
    .toArray();
}
