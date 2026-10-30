import { registrationSchema } from "@/lib/registration-schema";
import { getProgram } from "@/lib/programs";
import { mongoConfigured } from "@/lib/mongodb";
import { initializeTransaction } from "@/lib/paystack";
import { attachCheckout, createRegistration } from "@/lib/registrations";
import { site } from "@/lib/site-config";
const headers = { "Cache-Control": "no-store" };
const reply = (message: string, status: number) =>
  Response.json({ message }, { status, headers });
// Saves the learner, then starts a Paystack checkout. The client redirects to
// the returned authorization URL; Paystack returns them to /payment/callback.
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const self = new URL(request.url).origin;
  if (
    !origin ||
    ![new URL(site.url).origin, self].includes(origin) ||
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
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        message: "Please check the highlighted fields.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400, headers },
    );
  // Bots fill the hidden field; give them nothing to retry against.
  if (parsed.data.website) return reply("Thank you.", 200);
  const program = getProgram(parsed.data.program)!;
  if (!mongoConfigured() || !process.env.PAYSTACK_SECRET_KEY)
    return reply(
      "Registration is temporarily unavailable. Please email sayhi@onegoodjune.com.",
      503,
    );
  try {
    const registration = await createRegistration(parsed.data, program);
    const plan = program.planEnv ? process.env[program.planEnv] : undefined;
    const checkout = await initializeTransaction({
      email: registration.email,
      amount: program.amount,
      reference: registration.reference,
      callbackUrl: `${self}/payment/callback`,
      plan,
      metadata: {
        program: program.id,
        name: registration.name,
        phone: registration.phone,
        custom_fields: [
          {
            display_name: "Program",
            variable_name: "program",
            value: program.name,
          },
          {
            display_name: "Phone",
            variable_name: "phone",
            value: registration.phone,
          },
          ...(registration.bookTitle
            ? [
                {
                  display_name: "Book",
                  variable_name: "book_title",
                  value: registration.bookTitle,
                },
              ]
            : []),
        ],
      },
    });
    await attachCheckout(registration.reference, checkout.access_code);
    return Response.json(
      {
        authorizationUrl: checkout.authorization_url,
        reference: registration.reference,
      },
      { headers },
    );
  } catch (error) {
    console.error(
      "Registration failed:",
      error instanceof Error ? error.message : error,
    );
    return reply(
      "We couldn't start your payment. Please try again in a moment.",
      502,
    );
  }
}
