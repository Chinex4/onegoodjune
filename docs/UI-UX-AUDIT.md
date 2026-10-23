# UI/UX audit and refinement — October 23, 2026

Scope: every public route (`/`, `/about`, `/read-pubs`, `/read-pubs/[slug]`, `/submissions`, `/school-of-growth`, `/fiction-writing`, `/contact`, `/privacy-policy`, 404/error states), shared shell, design tokens and motion. Reviewed against *Website Copy – OneGoodJune copy.docx* and *SOG Sales Copy.docx* (the primary source of truth), the October 23 client corrections recorded in `DESIGN-REVISION.md`, and the live deployment (identical to `main`).

## 1. Brand inputs

| Input | Brief | Implementation before this pass |
| --- | --- | --- |
| Display / heading | Tan Songbird **or** Zalando Sans Extended | Songbird (licensed, self-hosted) |
| Paragraph | Crimson Text **or** Cooper Hewitt, fallback Cardo | **Georgia** — neither brief font loaded |
| UI / labels | — | **Arial** |
| Earthy Green | `#2d6e0b` `#b6e266` `#abc067` `#e3df82` | Tokens exist; only forest green used (one button, progress bar) |
| Sunshine | `#7b3622` `#b82c00` `#ff751f` `#ffa02e` | Tokens exist; **none used anywhere** except rust error text |
| Neutrals | Black and white | Black / white |

October 23 client corrections that stay in force: no homepage photographs, black/white homepage section grounds, restrained (smaller) headings, Songbird retained, text-only stacked experience cards, no scroll-jacking.

## 2. Findings

Severity: **H** = hurts brand or conversion, **M** = noticeable quality issue, **L** = polish.

### Brand and visual design
- **H — Half the approved palette is absent.** The Sunshine family never appears; Earthy Green appears as one button. The site reads as generic monochrome rather than OneGoodJune.
- **H — Brief typefaces not used.** Crimson Text (first choice) is freely licensed, but the site fell back to Georgia and Arial. Zalando Sans (the brief's alternate heading face) is also available.
- **M — Songbird's metrics fight the type scale.** Its cap height is 1.44 em (normal faces are ~0.7 em), so headings were set at 13–25px with 1.9–2.1 line-height. That made the scale impossible to reason about and created very loose heading leading.
- **M — Inconsistent heading styles.** SOG mixes Songbird, `font-serif text-3xl` and `font-sans` for equivalent section headings. Fiction and About use different eyebrow and title patterns.
- **M — Communiqué-style wordmark not delivered.** The brief asks for a footer wordmark "like Communique's" (full-width). The footer wordmark was 28px.
- **L — Cool greys (`neutral-100`)** sit uneasily against the warm palette.

### Content fidelity
- **H — Homepage experience cards drop the client's descriptions** (fiction, SOG and magazine blurbs are in `home.ts` but never rendered).
- **M — Service numbering (01. 02. 03.) from the brief is missing** on the homepage.
- **M — SOG skips source lines:** "YOUR TURN", "THIS IS / School of Growth", "SOG FRAMEWORK", "Choose your path" and the FAQ heading.
- **M — Read Pubs ignores the brief's masthead line** "Stories. Essays. News. Craft. Archive." and the five named sections when the magazine is empty.
- **M — Newsletter embed requested in the brief was removed.** It now renders correctly (re-tested), so it can return with the direct link as a fallback.

### UX and conversion
- **H — Desktop navigation hides School of Growth and Fiction Writing** behind a hamburger even at 1440px, so the two revenue programs are invisible.
- **H — SOG pricing is hard to compare.** Three stacked full-width plans, each with a small 18px price. There is no side-by-side comparison and the CTA position varies.
- **M — No persistent CTA on a 10,000px sales page** (18,000px on mobile).
- **M — Fiction "Join the Waitlist" renders as a grey, disabled-looking block** because `NEXT_PUBLIC_WAITLIST_URL` is unset. It reads as broken rather than "coming soon".
- **M — Contact inquiry type is a native select** for four options. Choice chips are faster and more visible.
- **M — Social links render as plain text that looks clickable** (URLs not supplied).
- **L — Sales pages have no route home and no privacy link** next to a payment CTA.
- **L — About team placeholders are 616×460 grey boxes**, so four missing photos dominate the page.

### Responsive
- No horizontal overflow at 320–1440px (verified).
- **M — SOG on mobile is 18,000px**, mostly from full-width plan blocks and paragraphs at 18px Georgia/1.8.
- **L — Hero wordmark used `4.7vw`** with no lower clamp, giving a 20px logo on small phones.
- **L — Countdown labels at 9px** are below a comfortable minimum.

### Technical
- **M — Hydration mismatch:** `HeroWordmark` and `Reveal` branch on `useReducedMotion()`, which differs between server and client (console error on every load with reduced motion).
- **L — Unused shadcn primitives** (`components/ui/*`) are not imported by any route. They are harmless but should be kept out of the design system docs.
- **L — Empty Read Pubs category bar** renders a black strip with a single "All publications" item.

## 3. Direction

**A literary studio's printed programme.** White and black grounds stay (client correction), and the palette becomes the system's ink:

- **Earthy Green = growth.** School of Growth, strategy and stewardship.
- **Sunshine = story.** Fiction course, storytelling, the magazine.
- **Colour bar.** The eight approved colours as a printer's proof strip, ordered dark green → light → sunshine → deep earth. It is the one recurring brand device (hero, footer, sales pages, reading progress). It is functional decoration that names the palette rather than adding ornament.
- Brand colour appears as numerals, labels, rules, hover fills and CTA fills. Full colour fields are used on inner and sales pages, not as homepage grounds.

Contrast rules: on white, text accents use forest, rust or earth only (≥ 5.9:1). On black, use lime, straw, sunshine or orange. Fills of lime, straw, sunshine or orange carry ink text.

## 4. Design system

- **Type:** Songbird (display, normalised with `size-adjust: 50%` so its sizes behave like any face). Zalando Sans variable (UI, nav, labels; the expanded width for labels and buttons). Crimson Text (reading), falling back to Cardo, then Georgia.
- **Scale:** tokens in `primitives.tsx` (`display`, `heading`, `subheading`, `title`, `lead`, `prose`, `label`, `meta`).
- **Tokens:** brand colours plus warm neutrals `paper` / `mist` / `line` in `globals.css`.
- **Components:** a single `buttonStyles()` used by every CTA (links, external links, submit). Plus `Section`, `SectionHeading`, `ColorBar` and an extended `PageIntro`.
- **Motion:** `MotionConfig reducedMotion="user"` globally (fixes hydration), once-only reveals, a staggered colour bar, arrow nudges, card colour fills. No scroll-jacking.

## 5. Items that need a client decision

1. **"50% OFF" (homepage waitlist button) vs prices.** $20 vs $109 and ₦27,500 vs ₦150,000 are both ~82% off. The badge is still omitted pending confirmation.
2. **`#27,500`** is preserved verbatim; it almost certainly means ₦27,500.
3. **Missing destinations:** `NEXT_PUBLIC_WAITLIST_URL` and the LinkedIn, Instagram and YouTube URLs. The waitlist is the fiction page's primary CTA.
4. **Team photographs** for the four Adventure Builders.
5. **Privacy policy names Brevo**, but contact email uses Resend. The legal text is unchanged.

## 6. What changed

| Area | Change |
| --- | --- |
| Tokens | `globals.css`: brand colours grouped by family, warm `paper`/`mist`, `ground-dark` utility (black ground + lime focus ring), `draw`/`rise` keyframes, balanced/pretty text wrapping. |
| Type | Brief fonts loaded (Crimson Text, Zalando Sans). Songbird normalised; one scale in `primitives.tsx`. |
| Shared | `buttonStyles()` and `ActionLink` (internal, external, mailto). `ColorBar`, `Eyebrow` with swatch, `PageIntro` with accent. `TextLink` handles external targets. |
| Header | Sticky and blurred. All five destinations visible from 1024px, "Get in touch" from 1280px. Numbered full-screen menu with contact and socials. |
| Footer | Colour bar, Studio/Programs/Follow columns, full-width wordmark sized in container units, legal row. |
| Home | Wordmark + animated colour bar. Brief numbering and accent colours on services. Experience cards restore client descriptions and fill with their brand colour on hover. Substack embed restored with a link fallback. |
| About | Coloured full stops, pull quote, forest mission band, four-up portrait grid with tinted, clearly labelled placeholders, sunshine CTA. |
| Read Pubs | Brief masthead line, colour bar, tabbed categories (hidden when the CMS has none), two-panel empty state listing the brief's five sections. Article cards and article pages re-typeset. |
| Submissions | Numbered sections, bold rule lead-ins, sticky "How to submit" card. Mailto pre-fills the required subject line. |
| Contact | Boxed fields, inquiry-type chips (keyboard arrow navigation), inline error icons, sticky details column. |
| School of Growth | Top bar with route home, restored source lines, side-by-side plans with large prices, plan switcher below 1024px, swipeable testimonials on phones, sticky CTA bar, accordion FAQ with linked email, minimal legal footer. |
| Fiction Writing | Dark hero with large countdown, 14-module grid with highlighted capstone project, orange results band, facts grid, price card, instructor portrait, closing CTA. Waitlist shows an honest "opening soon" state until configured. |
| Fixes | Reduced-motion hydration mismatch removed via `MotionProvider`. Contrast fixes (lime on forest, muted socials, perks numerals). The "Menu" button's accessible name matches its label. |

## 7. Verification

- `npm run lint`, `npx tsc --noEmit`, `npm test` (14/14) and `npm run build` (19 routes) pass, with no build warnings.
- axe WCAG 2.0/2.1 A and AA: zero violations on all eight public routes plus the 404, at 1440px and 390px. The third-party Substack iframe is excluded.
- No horizontal overflow at 320, 390, 768, 1024 and 1440px. No console or hydration errors with reduced motion on or off.
- Mobile menu: opens, traps focus, closes on Escape, returns focus, restores scroll and navigates.
- Contact: empty submit shows five inline errors and focuses the first field. Chips work with arrow keys. A mocked submit posts the correct payload, shows the success state and resets. No real email was sent.
- SOG on mobile: the plan switcher hides the other plans only after hydration. The sticky CTA appears outside the hero, pricing and closing sections.
- Not covered: Safari/Firefox, screen-reader passes, real Sanity content, and live email delivery.
