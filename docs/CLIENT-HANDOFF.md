# ONEGOODJUNE cross-check and launch handoff

Updated November 3, 2026. This is the current checklist; it supersedes outstanding-input lists in the older video review notes. Changes are local until deployed. No real charge, subscription, customer email or CMS publication was created during verification.

## Pages to cross-check

| Page | Current route | What to check |
| --- | --- | --- |
| Home | `/home` | Two-part School of Growth/Fiction CTA banner appears only here; compact all-caps wordmark; image-led introduction; white/black sections; numbered services; compact stacked experience title/CTA cards without pictures/descriptions; newsletter; compact white footer wordmark on black. |
| About | `/about` | Smaller/lighter opening statements; mission; **Our Creed / Guiding Philosophies** immediately after mission with all four supplied principles; Adventure Builders; four supplied profiles and portraits; Olabiyi spelling; publications/SOG CTAs. |
| Magazine | `/pubs` | Literary-magazine header; image-led hero, controls below; categories from Sanity; Newcomer/Spotlight sections; filtering and pagination. |
| Articles | `/pubs/[slug]` | Opens at the beginning; `Nov 03, 2026` date style; readable 1.5 paragraph line spacing; rich text/images/byline; related articles; no repeated bottom author panel. |
| Contributors | `/contributors/[slug]` | Approved Chidinma portrait; biography, social links, other published works. Edit in `/studio` → Contributors, including profile and works headings. CMS values/portraits take priority over supplied initial fallbacks. |
| Submissions | `/submissions` | New Word-only formatting and grammar rules; unchanged document naming; “Submissions – Your Name” email subject; “Other style matters: Follow the guidelines on this submission page.” is plain text; mailto submission button. |
| School of Growth | `/sog` | Supplied sales copy/video, three tiers, enrollment dialog; Builder annual price plus approved **$14 / ₦18,750 per quarter**, four payments, ₦75,000 total. Quarterly checkout appears only with both server environment values configured. |
| Fiction course | `/fiction-course` | Standalone landing page; February 5, 2027 Lagos countdown; introduction begins “You have learned the basics”; divider; sixteen teaching modules plus highlighted assignment; benefits checklist; crossed-out launch/original prices; Course Instructor label; sticky waitlist CTA. |
| Consultation | `/consult` | Standalone landing page; one-line session metadata/CTA; payment followed by protected `/consult/book` booking page and client-provided Calendly destination. |
| Launch Spotlight | `/spotlight` | Standalone landing page; packages; all eighteen exact client terms before FAQs, body collapsible and title always visible; book details in registration form. |
| Events | `/events` | CMS events; registration for future open events; “No past events yet” when empty; design-only sample hidden without deleting it in Studio. |
| Contact | `/contact` | First/last name, email, inquiry type and message; validation, error/success states, abuse protection; existing Resend contact delivery. |
| Privacy | `/privacy-policy` | Complete supplied policy and effective date preserved. |
| Editor | `/studio` | Posts, contributors, categories, tags, editorial selections, images, events; drafts/publishing. |
| Registration admin | `/silencekeepsitgoingonegoodjune` | Login, paid/pending/failed registration records, filters/search/CSV and event registrations. |

Navigation, footer and payment return paths use the new URLs. `/` redirects to `/home`; old magazine/program URLs and `/blog` redirect permanently to their replacements, preserving article suffixes and query strings.

Spotlight main/additional-category posts automatically show **Sponsored launch announcement** on cards, hero slides and article pages. The Sponsored post switch also supports sponsorship outside Spotlight.

## Payments and emails already implemented

- Server-side program pricing, MongoDB registrations, Paystack redirect checkout and verified callback.
- Signed webhook with payment re-verification; amount/currency/plan checks for quarterly Builder; idempotent paid-state updates.
- Optional four-payment Builder quarterly schedule, with provider plan validated before registration/checkout. Full annual Builder remains available.
- Four branded welcome-email variants using the client's supplied copy: School of Growth, Fiction, Author Consultation and Launch Spotlight. HTML plus plain text, server-only SMTP, TLS, retry locking/delivery tracking.
- Contact emails remain on Resend; welcome-email SMTP is separate.
- Server metadata, canonicals, social previews, article structured data, sitemap and robots. Responsive Tailwind components, supplied fonts, Motion reveals, visible focus and reduced-motion support.

## Important Paystack plan check

Client-approved Builder amount: **₦18,750** quarterly (display reference **$14**), four payments.

Supplied code: **`PLN_2hkiiw25mmhu1a3`**.

A read-only lookup with the currently configured **test** secret key returned HTTP 404. This establishes only that the plan is not accessible with that key; it does not establish that the plan is invalid in Live mode. Confirm the plan's account and Test/Live mode. Do not copy a Live plan into the test environment. No plan was created or edited.

The approved amount is set locally. The quarterly plan code remains unset locally to avoid offering a known failing test checkout. The supplied code is recorded here for the matching Vercel environment. Once a matching plan is configured, the existing enrollment option is enabled automatically after rebuild/deployment.

## What to do in Vercel

1. Open the ONEGOODJUNE project → Settings → Environment Variables. Update the existing variables rather than adding duplicate names.
2. For **Preview testing**, use the Paystack test secret and a matching Test-mode NGN quarterly plan at ₦18,750. For **Production live billing**, use the live secret and matching Live-mode plan. Confirm whether the supplied code is Live before using it there.
3. Add these server-only values to the appropriate environment:

```dotenv
SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA=18750
PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY=PLN_2hkiiw25mmhu1a3
```

Use the supplied plan code only in the environment whose key can access it. The amount is **naira**, not kobo: do not enter 1875000. Checkout converts to kobo itself. The USD price is display copy; checkout charges NGN.

4. Add welcome-email SMTP credentials directly in Vercel:

```dotenv
SMTP_HOST=your-provider-host
SMTP_PORT=587
SMTP_USER=your-provider-user
SMTP_PASSWORD=your-provider-password
SMTP_FROM_EMAIL=your-verified-sender-address
SMTP_REPLY_TO=sayhi@onegoodjune.com
```

Port 587 uses required STARTTLS; use 465 if your provider requires implicit TLS. `SMTP_FROM_EMAIL` must be a bare verified email address. Passwords/API keys should be Secret variables, never `NEXT_PUBLIC_` variables. Do not paste credentials into chat or the repository.

5. Confirm these existing settings are present in the environment you are deploying:

| Purpose | Variables |
| --- | --- |
| Site address | `NEXT_PUBLIC_SITE_URL` = actual public URL for that environment |
| Paystack | `PAYSTACK_SECRET_KEY` (matching Test/Live mode); existing Riser/annual Builder/Visionary plan variables if recurring subscriptions are intended |
| Database | `MONGODB_URI`, `MONGODB_DB` |
| Admin | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` |
| CMS | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`; `SANITY_API_READ_TOKEN` and `SANITY_PREVIEW_SECRET` if draft preview is used |
| Contact email | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` |
| Contact abuse protection | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`; set `CONTACT_TRUST_PROXY=true` only behind a proxy which overwrites forwarded IP headers |

The current redirect checkout does not require `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`. Do not replace a working annual `PAYSTACK_PLAN_SOG_BUILDER` with the new quarterly code: quarterly has its own variable.

6. Deploy the updated code and redeploy after environment changes. Existing deployments do not pick up changed values automatically. Configure Paystack's webhook in the matching mode:

```text
https://YOUR-DEPLOYED-DOMAIN/api/paystack/webhook
```

Paystack must reach that public endpoint. Preview authentication must not block it. The callback is supplied by the app as `/payment/callback` automatically.

7. Test a payment with Test-mode credentials. Cross-check the Paystack transaction, confirmation page, paid registration in admin and welcome email. Test the consultation booking continuation as well. No real purchase is needed for acceptance testing. Do not use a Live-mode charge as a substitute for a missing Test plan.

Official references: [Vercel environment variables](https://vercel.com/docs/environment-variables), [Paystack subscriptions](https://paystack.com/docs/payments/subscriptions/), [Paystack webhooks](https://paystack.com/docs/payments/webhooks/).

## What remains from the client / account owner

- Confirm the supplied plan's Paystack mode/account and provide a matching **Test** plan code for testing if it is a Live plan. Also confirm other SOG recurring plan codes if automatic renewals are wanted.
- SMTP provider credentials and verified sender, entered directly into Vercel; sender-domain verification/DNS as required by that provider.
- Actual SOG welcome-kit/community access fulfillment: the approved welcome promises delivery within 12 hours. Sending the welcome does not itself deliver the kit.
- Confirm the current Calendly and Spotlight materials-form destinations are the intended working client-owned destinations.
- Sanity membership for the client's own account, if not already accepted; she can edit contributors herself.
- SEO preferences: final production-domain confirmation, approved studio/publication description and search topics, optional preferred page titles/descriptions and sharing image, and Search Console ownership/access for post-launch indexing checks.

Creed, Spotlight terms, Chidinma portrait, submission style wording and requested page slugs are now supplied and implemented; they are no longer outstanding inputs. Payment/email acceptance testing and deployment remain operational steps.

## Latest validation

37 automated tests pass. ESLint, TypeScript, production build and whitespace checks pass. Browser checks at 320px, 390px and 1440px confirm four creed principles after Mission and before Adventure Builders, visible quarterly pricing, no horizontal overflow and no browser errors. No real provider checkout or email was submitted; Paystack plan lookup was read-only.
