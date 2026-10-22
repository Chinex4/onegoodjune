# OneGoodJune

Next.js App Router, TypeScript, Tailwind CSS, Motion, Sanity, React Hook Form/Zod, and Resend.

The homepage and all requested internal routes are implemented. The magazine and Studio connect to your Sanity project when configured. No sample articles, fabricated authors, fake waitlist capture, or team stock portraits are published.

## Run and verify

Use Node.js 22.12+ (the installed Sanity integration requires a current Node runtime).

```sh
npm install
cp .env.example .env.local
npm run dev
```

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm start
```

The source routes live in `src/app/(site)` so Sanity Studio can use its own full-screen layout at `/studio`. Tailwind theme tokens and base rules are in `src/app/globals.css`; component styling is in Tailwind utilities. Shared heading styles in `src/components/site/primitives.tsx` use the supplied Songbird font at smaller sizes with generous line heights. Motion components handle reveals, hover movement, the staggered wordmark, and reading progress; they honor reduced-motion preferences.

## Content and assets

- `src/content/source-copy.json`: full original document extraction, unchanged.
- `src/content/home.ts`: supplied homepage copy.
- `src/content/pages.ts`: supplied internal-page copy and policy sections derived from the extraction.
- `src/lib/site-config.ts`: links and asset paths, including the four missing team photograph slots.
- `docs/ASSETS.md`: thematic photo and font sources.

Set real social, waitlist and enrollment URLs in `.env.local`. Without them, the UI honestly marks the relevant destinations as unavailable. No form pretends to collect a waitlist. Add approved team images to `public/images` and update `site.assets.team` in the documented order. Georgia remains the temporary body font fallback until body font files are supplied.

## Sanity setup

1. Create/select a Sanity project and a dataset, then set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
2. Add localhost and your deployed website to the project's permitted CORS origins (allow credentials for the embedded Studio).
3. Restart Next.js and visit `/studio`; sign in using a Sanity account with access to the project. The Studio does not use a public write token.
4. On a **new dataset**, import `src/sanity/initial-taxonomy.ndjson` with the Sanity CLI. For example, after authenticating with `npx sanity login`:

```sh
npx sanity dataset import src/sanity/initial-taxonomy.ndjson production
```

Use your actual dataset name. This file contains only the five supplied categories, the Fiction tag, and editorial section configuration. Review existing document IDs before importing into a dataset that already contains content. It contains no articles or authors.

5. Create authors and publish real articles. Every article supports title, slug, excerpt, author, date, main image/alt/caption/credit, category, tags and rich text with embedded images.
6. Use **Editorial selections** to choose the featured post and configure Big Story, Rising Voices, Cozy Corner, Spotlight and Craft. Curated selections take priority; category/tag rules select current published posts otherwise. Cozy Corner makes no fabricated popularity claim—curate it using real readership information.

Public queries use the published perspective and omit future publication dates. All category links and editorial section definitions come from Sanity. Server-rendered listings support category filters, 12-article pagination, related articles, and readable empty/error states. No server token enters client code. Sanity images use Next Image with a restricted remote host.

## Draft preview

Set a server-only Viewer token in `SANITY_API_READ_TOKEN` and a long random `SANITY_PREVIEW_SECRET`. Open this authenticated preview URL, replacing both values:

```text
/api/draft/enable?secret=YOUR_SECRET&slug=YOUR_ARTICLE_SLUG
```

Omit `slug` to preview the magazine. The endpoint checks the secret and confirms the article before setting Next.js Draft Mode. Draft queries bypass the CDN and use the drafts perspective. A visible preview banner offers an Exit preview action. Keep preview links and tokens private. Public browsing never receives draft content.

## Contact email

Configure `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (a sender on your verified domain), and `CONTACT_TO_EMAIL`. The client calls `/api/contact`; the key and email delivery remain on the server. Invalid requests, provider failures and missing configuration return honest errors rather than success.

Production also requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for atomic shared rate limiting (five requests per 15-minute window). Local development uses a bounded in-memory counter. Production fails closed if the shared limiter is missing or unavailable. Set `CONTACT_TRUST_PROXY=true` only when the hosting proxy overwrites `X-Forwarded-For`; otherwise a conservative shared bucket is used. Origin checks, body-size limits, a bot honeypot, validation and plain-text email content provide additional safeguards. No inquiry text or credentials are logged.

The test suite uses mocked email and limiter providers and sends no real emails. Real delivery still needs a verified sender, credentials and an authorized live smoke test.

## Launch dependencies

See `docs/IMPLEMENTATION-PLAN.md` and `docs/VALIDATION.md` for the feature checklist, checks, remaining source-copy discrepancies and external integration requirements. No deployment is performed automatically.
