# November 3 client review

Current completion status and remaining inputs: see [CLIENT-HANDOFF.md](./CLIENT-HANDOFF.md). Earlier outstanding-input lists below record the state at the time of that review.


Source: the client's 6:44 video, supplied message, approved portrait, terms, formatting rules and slug list. Audio was transcribed in Descript with explicit user permission; the video frames were inspected locally. Nothing was publicly published through Descript.

## Implemented

- 00:14–01:11: a two-part course banner with visible CTA arrows, on `/home` only. Keep it: two clear destinations support the stated conversion goal without repeating the banner on internal pages.
- 01:22–01:45: lighter, smaller About opening statements. Header/footer logo sizes remain as previously requested; the client's logo-size remark was a question rather than an instruction to enlarge it.
- 01:45–02:33: streamed articles reset to their beginning when the article content arrives, rather than retaining the listing's scroll against a short loading fallback.
- 02:44–03:06: supplied formatting and grammar rules, unchanged email subject/document name, reduced section gaps.
- 03:06–03:34: removed duplicate course heading above introduction; divider before modules.
- 03:34–04:29: prominent checkmarked course outcomes and crossed-out launch/original prices; current waitlist price remains visible.
- 04:29–05:06: Course Instructor label; single-line launch label; final writing assignment visually distinguished from the sixteen teaching modules.
- 05:06–05:33: all eighteen supplied Spotlight terms before FAQs, title always visible, body collapsible.
- 05:33–06:00: supplied Chidinma portrait, with Sanity portraits taking priority. Contributors are editable in Studio, including two optional page-heading fields. See SANITY-CLIENT-ACCESS.md.
- 06:00–06:40: automatic sponsored disclosure for Spotlight main/additional-category posts on cards, hero slides and article pages. Optional sponsored switch covers other categories. No fabricated public posts were created.
- Dates use `Nov 03, 2026` with Lagos timezone, including cards, hero and article headers; events use the same public date formatter.
- Canonical routes `/home`, `/about`, `/contact`, `/pubs`, `/sog`, `/fiction-course`, `/consult`, `/spotlight`, `/submissions`, `/events`. Article URLs `/pubs/[slug]`; consultation booking `/consult/book`. Permanent redirects preserve old routes and query strings. Internal links, payment return links, preview redirects, metadata and sitemap updated.

## Inputs still needed

- Resolved after client clarification: “Other style matters: Follow the guidelines on this submission page.” This is plain text, with no link.
- Studio access for the client's own Sanity account, if not already invited.
- Final creed from the earlier review.
- Confirmed Builder quarterly price and matching Paystack plan, if installments are needed.
- SMTP settings and verified sending address for automatic welcome delivery.

## Payment testing

Local environment presence check: Paystack **test** secret key, MongoDB and admin settings are present. SMTP host/user/password/sender and Builder quarterly configuration are absent. Values were neither printed nor changed. Hosting environment and Paystack webhook dashboard settings were not verified.

After deploying this version with test credentials and a working MongoDB connection, the client can test checkout and confirmation. End-to-end welcome-email testing additionally requires SMTP and the public Paystack test webhook URL `/api/paystack/webhook`. Keep test/live credentials and plans separate. No real charge, customer email or subscription was created during this review.

## SEO handoff

Existing page metadata, social previews, article structured data, canonical URLs, robots and sitemap are retained; canonical routes now match the requested slugs. Ask the client to confirm the final production domain, preferred studio/publication description and search topics, approved social-share imagery, and any preferred page titles/descriptions. Search Console ownership/access enables sitemap submission and indexing checks after launch; share account access rather than passwords. Image alternative text and excerpts should be maintained with articles in Studio. Search ranking is not guaranteed.

The earlier homepage request to remove experience-card pictures and descriptions is also retained: these are compact stacked title/CTA cards.

## Validation

- 36 automated tests pass, including dates, Spotlight category disclosures and all eighteen supplied terms.
- Real Chromium checks at 320px, 390px and 1440px: seven reviewed routes return 200, no horizontal overflow or page errors, home-only banner, approved portrait displayed, all eighteen terms expand.
- Follow-up article click tests wait for the completed streamed article: scroll position is 0 and the title is visible at all three widths.
- Old root/program/magazine URLs return 308 redirects; category query strings are preserved.
- Browser evidence is in `/tmp/ogj-nov-review/`; no fabricated sponsored article was published for testing. Paystack/SMTP behavior is covered by mocked-provider tests, not a real payment or real email.
- Final lint, TypeScript, production build (31 generated routes/pages) and `git diff --check` pass. Changes remain local and require deployment before client acceptance testing.
