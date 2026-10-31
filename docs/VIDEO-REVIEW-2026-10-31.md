# Website video review — October 31, 2026

The user supplied five WhatsApp screen recordings and requested implementation of the spoken website corrections. After an initial privacy review rejected external upload, the user explicitly approved Descript. Only compressed audio tracks were uploaded; frames were reviewed locally. The original videos were not uploaded or published.

Review project: https://web.descript.com/60c344b7-c2ea-4b67-a45b-aac46954a1ab

## Source map and implemented corrections

| Recording suffix | Topics / timestamps | Implementation |
| --- | --- | --- |
| 19.02.06 (1) | 00:00–00:54 homepage image / What We Do | Keep the existing hero arrangement; place the What We Do introduction beneath the image on white, before the black service section. |
| 19.02.06 (1) | 01:00–01:26 introduction | Add “intelligence and intentional consistency.” |
| 19.02.06 (1) | 01:30–02:08 spacing | Reduce section padding; double the experience-card gap from 12px to 24px. |
| 19.02.06 (1) | 02:08–02:37 newsletter | Set 100+ in black. Substack owns the cross-origin subscribe button; its internal styling remains unchanged, as permitted in the review. |
| 19.02.06 (1) | 02:37–04:15 About | Remove the repeated Born out of necessity caption, remove swatch markers from About labels, use consistent smaller square portraits, crop Akunna's image, correct Seun Mary-Ann Olabiyi. |
| 19.02.07 | 00:00–00:52 magazine heading | ONEGOODJUNE Pub: A Literary Magazine; remove the large Read Pubs heading; keep the explanatory paragraph. |
| 19.02.07 | 00:59–03:39 magazine hero | Landscape full-width cover, centered title on image, author and uppercase abbreviated American date above the title, no excerpt or read time; centered controls below. Other article cards retain their hierarchy. |
| 19.02.07 (2) | 00:10–02:34 reading | 1.5 body line-height, tighter paragraph and section gaps. Remove the bottom author/bio panel and end-of-article tags so related writing follows the body. Heading hierarchy in article source remains editor-managed. |
| 19.02.07 (2) | 02:34–04:20 contributor | Full-width landscape image layout, compact name, About the contributor label, bio/social links, Other published works. Chidinma Nnalue's bio/links use the already supplied Blog Content.docx text. No substitute person's portrait is used. |
| 19.02.07 (1) | 00:00–00:51 submissions | Email subject “Submissions – Your Name” in both guideline and mailto CTA. Replace Creative Ambassador Award with the spoken Features and portfolio building wording, including year ‘wrapped’ series. |
| 19.02.07 (1), 19.02.06 | consultation CTA / facts | Book your one-on-one session, single-line button and compact single-line facts. |
| 19.02.07 (1) | 02:38–04:20 fiction | Apply the previously supplied complete updated copy: introduction, 17 modules, four results, four uses, delivery, instructor, launch price and waitlist details. February 5, 2027 countdown at midnight Lagos. Use Join the Waitlist throughout and soften the orange. |
| 19.02.06 | 00:00–01:10 events | The Manny/Ada/Sesan brief example did not happen. Exclude it from public lists/detail/registration without deleting it from Studio; show No past events yet. Add a CMS Design example only field for future sample content. |
| 19.02.06 | 01:10–02:19 navigation | Anchor Back to top to the document body, add Events to navigation, widen hamburger strokes, add the Enrol: School of Growth / Fiction Course banner. Wording follows the client's later supplied Word copy. |
| 19.02.06 | 02:41–03:10 Builder | Add a configurable quarterly Builder registration option. It stays hidden until an exact confirmed price and valid Paystack plan code are configured. Server checks provider amount/currency/quarterly interval and sends invoice_limit=4. No price is guessed; no provider plans are created or changed. |
| 19.02.06 | 03:10–03:45 fiction sticky CTA | Add the existing sticky-CTA pattern to the fiction page, suppressed around its main CTA/investment sections. |

The prior footer-size request is retained: the footer wordmark is compact rather than container-width. Footer tagline now uses the supplied “faith-based African storytelling” wording.

## Remaining client inputs

1. **Our creed:** final text, to appear after Mission and before Adventure Builders.
2. **Launch Spotlight terms:** final text, rendered as a native expandable disclosure immediately before Questions Authors Ask. These two content slots are in `src/content/pending-review.ts`; neither section publishes made-up or placeholder legal copy.
3. **Builder installment configuration:** `SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA` and `PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY`. A read-only lookup in the configured Paystack account returned no Builder-named plans. The client must confirm the intended plan/price before enabling charges. The option is fully wired but hidden while missing these values.
4. **Contributor portrait:** the Word file says “Here's her photo” but contains no embedded media. The supplied bio/links are applied; the approved photograph remains CMS-managed.

Quarterly payment behavior follows Paystack's initialize transaction documentation: https://paystack.com/docs/api/transaction/ (invoice_limit) and https://paystack.com/docs/payments/subscriptions/. The configured plan is checked before creating a registration, and verified quarterly payments must match the configured amount, currency and plan. No live charge or subscription was created during verification.

## Verification

- New tests cover example-event visibility, hero date formatting, revised course/submission/team copy, contributor fallback scope, quarterly configuration and the four-charge cap.
- Existing email/payment work remains intact; no email was sent during this review.
- Browser inspection covers eight public routes at 390px and 1440px, menu Events link and document-top scrolling. Detailed outcomes are recorded after the final build check.
- Article/contributor content remains CMS-backed. No live CMS publication records were edited; the example event is hidden in the site's data access layer and remains available in Studio.

### Recorded results

- Full suite: 33 tests passed. The six review-specific tests were rerun after the final nullable-CMS fix and passed.
- ESLint and TypeScript validation passed.
- Eight routes at 390px and 1440px: no horizontal overflow or application/runtime errors.
- Menu contains Events; Back to top reaches scrollY=0 at both widths.
- Two real CMS articles: paragraph line-height/font-size ratio exactly 1.5, no bottom author panel, no overflow.
- Chidinma's real contributor route renders supplied fallback copy/social links and Other published works. No invented portrait block appears when there is no approved image; real portraits use the full-width layout when added to the CMS.
- Consultation at 320px: both Book your one-on-one session buttons remain one line and fit within the viewport.
- Fiction sticky action becomes visible away from the primary CTAs.
- Events: No past events yet is visible; the Manny/Ada/Sesan design example is absent. The final fix explicitly handles GROQ returning null for the missing example flag, as well as undefined.

No deployment, live billing change, customer email, or CMS publication was performed. The quarterly payment path is intentionally unavailable until its two configuration values are confirmed. Substack's embedded third-party button cannot be restyled by the site's Tailwind classes.

To enable quarterly Builder later, set the two confirmed server-side values in `.env` / the hosting environment, then rebuild/restart. The price and quarterly interval must match the existing Paystack plan; registration fails closed if they do not. No provider secret or plan code is exposed through the client form options.
