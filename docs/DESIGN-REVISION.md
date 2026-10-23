# October 23 client revision

## Direction and constraints

Applied the local design-taste-frontend and design-motion-principles skills. The direction draw selected **The well-kept board**, seed **2069327333**, over Contact sheet (requires many images) and Name as a monument (conflicts with the smaller-type request).

On this page, OneGoodJune's three ways into a creative life become a compact typographic program index. The homepage presents the studio, its three services, its three experiences, then its existing newsletter. The School of Growth page proves its offer with the client's coach video, founder story, exact plan inclusions and supplied student accounts. Its working interactions are video playback, native FAQ disclosures and checkout links.

The client's corrections take precedence over the skill's generic defaults: no homepage photographs, black/white section backgrounds, smaller headings, retained licensed Songbird, text-only stacked experience cards and no scroll-jacking. No generated imagery, invented testimonials or example publications were added. The source's long sales headings are preserved even where they need more than two lines. The original skill draw's oversized hero, image floor, automatic marquee and tightly packed image rails are overridden for those explicit client constraints. The existing shared site frame remains consistent across public pages.

Typography uses the supplied Songbird for display, Georgia as the temporary reading font, and Arial for navigation and controls. No unavailable typeface is claimed as loaded. Layout styling remains in Tailwind; globals.css contains tokens and base rules only.

## Supplied material

- `src/content/sog-source.json`: complete paragraph transcription of SOG Sales Copy.docx, preserving explicit line breaks.
- `src/content/sog.ts`: structured model derived from those paragraphs.
- The document's `[Add Video]` is an editorial placeholder, represented by the real player; it is not published as website copy.
- The checkout URL comes from the document's hyperlink relationship. NEXT_PUBLIC_ENROLLMENT_URL can override it.
- Prices, billing periods, roadmap, testimonial wording, conditions and FAQ answers come from the supplied document. Claims within that copy remain the client's claims.
- Both sales routes use `(sales)` and have no shared navigation or footer. URLs stay the same.
- The magazine remains CMS-backed. The client blog reference informed hierarchy and pacing; no sample stories or attributed authors were imported from it.
- Newsletter subscriptions use the existing real Substack destination. The embedded third-party form showed blank in browser QA and was replaced with a direct subscription link.

## Outstanding content

Sanity project/dataset configuration and published articles are required to populate the magazine. The fiction waitlist URL and social profile URLs still need configuration. SOG checkout is connected to the supplied Mainstack destination; no purchase was submitted. The supplied video has burned-in text; no separate caption file or verbatim transcript was supplied.

## Review notes

ROUND 1
Seen in one second: the Songbird studio name.
Idea (one sentence): OneGoodJune's three experiences become a compact typographic program index.
Live thing: choose a program/publication; subscribe through the existing newsletter destination. On the sales page: watch the coach and expand the actual FAQs.
Layout words by section: hero=name / services=columns / experience=stack / community=split / footer=name.
Scores: design 6.5 · usability 8 · creativity 7 · content 8 → overall 7.2.
Caps applied: the skill's four-picture floor is deliberately overridden by the client's explicit no-homepage-images request; no inflated award-level score is claimed.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Home full-page desktop: third-party embed left a blank area. Replaced with a real Substack subscription link.
2. Home phone: dense experience titles dominated the cards. Reduced their Songbird scale and kept actions on separate rows.
3. SOG desktop fold: the original portrait video had large baked-in black margins. Converted to H.264 and trimmed only the blank outer frame.

ROUND 2
Seen in one second: the studio wordmark, followed by the concrete introduction.
Idea (one sentence): the three studio experiences form an editorial program index.
Live thing: actual program links and newsletter destination; real video playback and FAQ disclosures on SOG.
Layout words by section: hero=name / services=columns / experience=stack / community=split / footer=name.
Scores: design 6.5 · usability 8 · creativity 7 · content 8 → overall 7.2.
Caps applied: the client's no-picture and smaller-type instructions intentionally supersede the skill's large-type/image floor. No before-version browser measurements were captured; the report does not claim a measured before/after comparison.
Top three remaining limits:
1. Homepage: photography-free by client direction, so composition relies on typography rather than the skill's preferred image-led treatment.
2. Magazine: no Sanity project/articles configured; authentic article density requires the client's published content.
3. Global type: the client's expressive Songbird, reading serif and small sans navigation use three distinct roles. The three-font warning is retained deliberately for legibility and the existing brand.

The homepage inspector ran at 1440, 768 and 390px with zero FAIL findings after documented allowances. Remaining warnings concern three font roles, restrained motion and the deliberately compact mobile title. The no-photography, small-type and reduced-decoration requirements take precedence over adding generic images or oversized display text merely to satisfy the meter. Source design lint reports 0 FAIL / 0 WARN for the homepage, header and footer.

The reduced-motion check exposed an existing hydration mismatch: ScrollProgress returned a different element tree on the server and on reduced-motion clients. It now keeps a stable tree and hides the decorative bar with Tailwind's motion-reduce variant before hydration. The production build cache was also refreshed after it retained old global stylesheet output.
