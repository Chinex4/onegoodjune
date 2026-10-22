import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { contactRateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site-config";
const headers = { "Cache-Control": "no-store" };
function reply(
  message: string,
  status: number,
  extra: Record<string, string> = {},
) {
  return Response.json(
    { message },
    { status, headers: { ...headers, ...extra } },
  );
}
async function readLimitedBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty body");
  let bytes = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 24000) {
      await reader.cancel();
      throw new RangeError("Body too large");
    }
    parts.push(value);
  }
  const result = new Uint8Array(bytes);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(result)) as unknown;
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = [new URL(site.url).origin, new URL(request.url).origin];
  if (
    !origin ||
    !allowed.includes(origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return reply(
      "This request could not be verified. Please refresh and try again.",
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply("Please send a valid form submission.", 415);
  if (Number(request.headers.get("content-length") || 0) > 24000)
    return reply("Your message is too large.", 413);
  let body: unknown;
  try {
    body = await readLimitedBody(request);
  } catch (error) {
    return reply(
      error instanceof RangeError
        ? "Your message is too large."
        : "Please send a valid form submission.",
      error instanceof RangeError ? 413 : 400,
    );
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        message: "Please check the highlighted fields.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers },
    );
  const input = parsed.data;
  if (input.website) return reply("Thank you for getting in touch.", 200);
  try {
    if (!(await contactRateLimit(request)))
      return reply("Too many attempts. Please try again in 15 minutes.", 429, {
        "Retry-After": "900",
      });
  } catch {
    return reply(
      "The contact form is temporarily unavailable. Please email admin@onegoodjune.com.",
      503,
    );
  }
  const key = process.env.RESEND_API_KEY,
    from = process.env.CONTACT_FROM_EMAIL,
    to = process.env.CONTACT_TO_EMAIL;
  if (!key || !from || !to)
    return reply(
      "The contact form is temporarily unavailable. Please email admin@onegoodjune.com.",
      503,
    );
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: input.email,
      subject: `OneGoodJune enquiry: ${input.inquiryType}`,
      text: `Name: ${input.firstName} ${input.lastName}\nEmail: ${input.email}\nInquiry: ${input.inquiryType}\n\n${input.message}`,
    });
    if (error || !data)
      return reply(
        "We couldn't send your message. Please try again or email admin@onegoodjune.com.",
        502,
      );
    return reply(
      "Thank you for getting in touch. Your message has been sent.",
      200,
    );
  } catch {
    return reply(
      "We couldn't send your message. Please try again or email admin@onegoodjune.com.",
      502,
    );
  }
}
