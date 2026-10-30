import {
  eventRegistrationSchema,
  registrationIsOpen,
  saveEventRegistration,
} from "@/lib/event-registrations";
import { mongoConfigured } from "@/lib/mongodb";
import { site } from "@/lib/site-config";
import { getEvent } from "@/sanity/client";
const headers = { "Cache-Control": "no-store" };
const reply = (message: string, status: number) =>
  Response.json({ message }, { status, headers });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    ![new URL(site.url).origin, new URL(request.url).origin].includes(origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return reply(
      "This request could not be verified. Please refresh and try again.",
      403,
    );
  if (Number(request.headers.get("content-length") || 0) > 8000)
    return reply("Your submission is too large.", 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply("Please send a valid form submission.", 400);
  }
  const parsed = eventRegistrationSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        message: "Please check the highlighted fields.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers },
    );
  if (parsed.data.website) return reply("Thank you.", 200);
  if (!mongoConfigured())
    return reply(
      "Registration is temporarily unavailable. Please email sayhi@onegoodjune.com.",
      503,
    );
  try {
    const event = await getEvent(parsed.data.event);
    if (!event) return reply("We couldn't find this event.", 404);
    if (!registrationIsOpen(event))
      return reply("Registration for this event has closed.", 410);
    const saved = await saveEventRegistration({
      event: event.slug,
      eventTitle: event.title,
      eventStartsAt: new Date(event.startsAt),
      question: event.question || undefined,
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      answer: parsed.data.answer || undefined,
      createdAt: new Date(),
    });
    return reply(
      saved
        ? "You're registered! We'll email you the link before the session."
        : "You're already registered with this email. We'll send the link before the session.",
      200,
    );
  } catch (error) {
    console.error(
      "Event registration failed:",
      error instanceof Error ? error.message : error,
    );
    return reply("We couldn't save your registration. Please try again.", 502);
  }
}
