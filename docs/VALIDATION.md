# Validation — October 22, 2026

Scope: revised Tailwind homepage, all internal pages, contact endpoint, CMS schemas/queries and Studio integration.

## Passed

- `npm run lint` — clean.
- `npx tsc --noEmit` — clean.
- `npm test` — 12 tests passed. Covers original policy and team/module content, countdown absolute time/completion, invalid contact payloads, long Unicode messages, origin/body limits, shared rate limiting, missing configuration, mocked Resend success/failure, category/tag selection, article queries, pagination, future publication exclusion and preview query behavior.
- `npm run build` — successful final production build, all 19 generated route entries completed.
- Sanity CLI schema extraction — successful, including post, author, category, tag, editorial selections, body, editorial image and image-library types. This was an offline extraction using a temporary test project ID, with no CMS content writes. The first slow attempt was stopped; a fresh final extraction succeeded.
- `git diff --check` — clean.
- Production browser responses: `/`, `/about`, `/read-pubs`, `/submissions`, `/school-of-growth`, `/fiction-writing`, `/contact`, `/privacy-policy` and `/studio` all HTTP 200.
- Each route checked at 320, 390, 768 and 1440px: no horizontal document overflow.
- Axe WCAG 2 A/AA and WCAG 2.1 AA checks at desktop size: zero first-party violations across all eight public pages. The third-party Substack iframe is excluded from that scoped result.
- Desktop screenshots visually inspected for the revised homepage, About, course and contact layouts. Missing portraits remain explicit labeled slots.
- Mobile menu opens, navigates to About, closes on navigation and updates current-page state.
- Contact form client validation and success/error UI verified in the browser with mocked endpoint responses. Success resets the fields. No real emails were sent.
- Actual endpoint rejects invalid input (400) and cross-origin input (403). Unauthorized preview returns 401.
- Countdown browser-tested in Africa/Lagos and America/New_York at the same absolute instant: identical remaining time, then the correct completed state after launch.
- Reduced-motion scroll behavior verified.
- `robots.txt`, `sitemap.xml`, branded icon and Open Graph image return successful responses.
- Additional mobile Axe checks passed on Home, About, Contact (including validation errors), Fiction Writing and the open navigation dialog.
- Server-rendered homepage content remains readable with JavaScript disabled.
- Missing article state and noindex verified; the response is HTTP 200 because Next.js has already streamed the partial shell.
- No uncaught browser runtime errors in the full route scan.

## Integration limits

No Sanity project credentials or approved articles were supplied. Schema extraction and synthetic query fixtures passed; real authenticated Studio editing, publishing, draft-cookie preview and related-article rendering against the user's live dataset still require account configuration. The public magazine currently shows its honest empty state.

No Resend sender/key or shared rate-limiter credentials were supplied. Email and limiter success/failure were tested with mocks; a real delivery smoke test remains pending. Production contact sending fails closed without a shared limiter and valid email configuration.

Actual waitlist, enrollment and social destinations and team/instructor photographs are still missing. The UI does not invent capture, enrollment, articles, authors or photographs. School of Growth details not present in the source remain explicitly marked as content to be supplied.

Substack's cross-origin embed previously reported provider-controlled contrast, link-name and nested-frame-title issues. Those cannot be repaired from the site's CSS. The outer iframe is labeled and the newsletter has a direct-link alternative. Zero first-party findings do not imply accessibility conformance of that external widget. No screen-reader, Safari/Firefox or field Core Web Vitals certification is claimed.

## Dependency audit

Sanity was updated to the version 5 maintenance line (`^5.31.2`) and next-sanity to `^13.3.4`. The audit is **not clean**: the current full install reports 19 advisories; the production-only scan reports 17, through Sanity CLI/transitive tooling packages including archive, glob, YAML and UUID dependencies. These remain an upstream dependency review item. An automatic forced fix suggests downgrading the Sanity packages; that was not applied. No claim is made that dependency advisories have all been remediated.

## Tooling

The in-app browser execution tool was unavailable in this session. Browser checks used local Playwright/Chromium against the production server; temporary scripts and screenshots are outside the repository under `/tmp/ogj-browser-qa`. No deployment was performed.

## October 23 client revision — latest checks

This section supersedes the earlier School of Growth, instructor-image, enrollment and newsletter-embed limitations.

- ESLint passed, including exclusion of installed skill tooling from the application lint scope.
- All 14 automated tests passed. New checks cover the three SOG billing periods, all plan benefits, the four supplied testimonials and ten FAQs.
- Production build and its TypeScript validation passed. Both sales routes are statically rendered outside the shared site layout.
- A fresh production cache was used after detecting stale global CSS. The output now explicitly uses a white body background and Georgia reading font.
- Homepage design source lint: 0 FAIL / 0 WARN. Real-browser design inspection at 1440, 768 and 390px: 0 FAIL after the documented client-directed image/type allowances. Remaining warnings are recorded in DESIGN-REVISION.md.
- Home, School of Growth, Fiction Writing and Read Pubs: HTTP 200, no horizontal overflow, zero axe violations at 390, 768 and 1440px (12 page/viewport checks).
- About, Contact, Submissions and Privacy: HTTP 200, no horizontal overflow at 320 and 1440px, no browser runtime errors.
- Native menu: focus stays in the dialog; Escape closes it; focus returns to the trigger. Reduced-motion navigation also works.
- Reduced-motion cold load: content opacity 1; scroll behavior auto; decorative progress bar hidden; no hydration/runtime errors. The previous conditional-render hydration issue is fixed.
- SOG video: H.264/AAC, native controls, duration 32.706667 seconds; playback advanced with paused=false and error=null.
- FAQ installment answer expands correctly.
- All five SOG access links use the supplied Mainstack destination. External checkout returned HTTP 200 and title “Pay for School of Growth | ONEGOODJUNE”. No purchase was submitted.
- Supplied coach portrait replaces the former fiction instructor image notice. Other team portraits still require approved assets.
- The blank Substack embed was removed in favor of a real subscription destination.
- No Sanity project is configured, so live CMS publishing and real article layouts remain an integration check. No fictional publication content was added.
- No Safari/Firefox, screen-reader certification, live email delivery or field Core Web Vitals claim is made.

Browser verification used temporary Playwright/Chromium tooling in `/tmp/ogj-qa` because the in-app browser execution tool was unavailable. Final design and feature-check artifacts are in `.taste-skill`. The local development server remains available on port 3000. No deployment was performed.
