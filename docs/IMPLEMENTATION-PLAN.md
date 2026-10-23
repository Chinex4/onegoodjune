# OneGoodJune implementation status

## Implemented

- Revised homepage and shared shell restyled using Tailwind utilities. Global CSS contains Tailwind theme tokens and base rules, with no bespoke component selectors.
- Smaller Songbird headings with wider line spacing; desktop/mobile navigation and real internal links.
- Motion wordmark entrance, once-only section reveals, image/card hover effects and a reading-progress line, all respecting reduced motion.
- `/about`: complete origin story, mission, all four Adventure Builders, image slots and calls to action.
- `/submissions`: full original guidelines and mailto submission action, no upload workflow.
- `/privacy-policy`: complete supplied policy, all 14 sections, original wording and effective date Oct 19, 2026.
- `/school-of-growth`: supplied introduction and stewardship copy; missing program information explicitly marked.
- `/fiction-writing`: supplied modules, results, audience, instructor, prices, waitlist benefits, delivery/access details, and countdown to `2027-01-15T00:00:00+01:00`.
- `/contact` and `/api/contact`: React Hook Form/Zod client and server validation, secure Resend delivery, body/origin checks, honeypot, shared production rate limiting, error/success states.
- `/read-pubs`: CMS-backed categories, latest articles, featured selection, editorial sections, category filtering and pagination.
- `/read-pubs/[slug]`: rich-text reading, image captions/credits, author details, related articles and Article structured data.
- `/studio/[[...tool]]`: embedded Sanity Studio, isolated from the marketing shell, with clear setup state until connected.
- Sanity schemas: posts, authors, categories, tags, editorial images, image library, article body and singleton editorial selections.
- Seed file for the supplied taxonomy and section selections only; no invented publication content.
- Secret-protected draft preview and exit action; public/draft perspectives separated server-side.
- Per-page metadata, social previews, branded icon, sitemap and robots rules.

## Component and content architecture

`src/app/(site)` owns public routes and the shared header/footer. Studio remains outside that route group. Shared utility-token strings and small Tailwind primitives live in `src/components/site/primitives.tsx`. Homepage content remains centralized; internal copy is derived directly from the original paragraph extraction. Editorial components render Sanity data without shipping server credentials.

Public magazine queries are deliberately fresh server reads, inside Suspense boundaries where the installed Next.js version requires runtime data. Public queries exclude future publications. The CMS owns category navigation and each section's selection rules. Curated references are filtered for public visibility too. No view counts or most-read claims are fabricated.

## Design system

Supplied local Tan Songbird is self-hosted through next/font/local. Body fallback: Crimson Text → Cardo → Georgia → Times New Roman, with Georgia available locally. Utility labels use Arial/Helvetica. Brand colors are Tailwind theme tokens: forest #2d6e0b, lime #b6e266, sage #abc067, straw #e3df82, earth #7b3622, rust #b82c00, orange #ff751f and sunshine #ffa02e. Main surfaces use warm paper and dark ink. Heading scale and wider leading account for Songbird's extended glyph metrics.

References studied: [Communiqué](https://communiquehq.com), [SocialChain](https://www.socialchain.com), [Pretty Little Marketer](https://www.prettylittlemarketer.com/home), [Ourtalento](https://www.ourtalento.com), and [The Republic](https://rpublc.com/magazine). No reference-site assets were copied.

## Pending external details

1. Sanity project ID/dataset, project CORS configuration and approved real articles/authors. The application is implemented; live CMS read/write verification needs the account configuration.
2. Server-only Sanity Viewer token and preview secret for draft sessions.
3. Resend API key, verified sender and recipient; production shared rate-limiter credentials.
4. Waitlist and School of Growth enrollment destinations; Instagram, LinkedIn and YouTube URLs.
5. Four team photographs and instructor portrait. Current labeled photograph slots do not impersonate people.
6. Full School of Growth program details, schedule, format and any pricing. None has been invented.
7. Body font files, if a supplied licensed body font should replace the temporary Georgia fallback.

## Copy discrepancies retained for client decision

- Homepage says 50% OFF; supplied sales prices imply a different discount. Both are preserved.
- Supplied waitlist price uses `#27,500`; preserved pending authorization to correct it to the naira symbol.
- Supplied policy names Brevo for email delivery; requested implementation uses Resend. Legal text has not been silently rewritten.
- Original document does not specify a launch time. Midnight in Lagos on January 15, 2027 is the documented countdown assumption; all time zones share the same instant.

## Verification

See VALIDATION.md. Functional tests use synthetic test fixtures and mocked email/limiter responses, never real public articles or outbound test emails. Live service setup, real email delivery and authenticated Studio/draft workflows remain unverified until their configuration is supplied.

## October 23 update

The SOG sales copy, founder portrait, video and Mainstack enrollment URL have now been supplied and implemented; they supersede unresolved items 4–6 above for that program and the instructor portrait. Actual waitlist/social URLs and the other team portraits remain pending. Both sales routes use a separate layout. See DESIGN-REVISION.md.
