# ONEGOODJUNE: Sanity SEO and Google Analytics

## What is connected

GA4 measurement ID: **G-88EXS6ZTJH**. The application uses this by default. To override it, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel and redeploy; it is a public identifier, not a secret. No API key is required. Set `NEXT_PUBLIC_GA_ENABLED=true` in Vercel Production **after** disabling Enhanced measurement as below, then redeploy. Until enabled, analytics and its preferences panel are inactive. Tracking is disabled in development and Vercel Preview deployments. Production visitors choose Accept analytics or Decline analytics; the client’s GA4 script is not loaded before acceptance. The smaller prompt appears on regular pages and disappears after accepting or declining. It never appears on sales pages; those pages use any preference already saved. The preference can be changed using Analytics preferences in the regular site footer.

Private admin/Studio/API/payment/consultation-booking routes are excluded. The integration does not send names, emails, phone numbers, payment references, form contents or URL query strings. External referrers are reduced to their origin, without paths or search queries. It measures public page navigation; it does not claim to measure completed purchases or account-level search volume. Declining/withdrawing disables this tracker and clears accessible first-party GA cookies. Browser tools/ad blockers can prevent collection.

## One Google Analytics setting to change

This integration sends page views explicitly, including Next.js navigation. **Turn off Enhanced measurement for this Web stream** to prevent duplicate history page views and automatic form/search/outbound-link event collection. Our own page views continue to work. This is an account setting; it cannot be changed by deploying this repository.

1. Google Analytics → Admin → Data streams → select the stream for the ONEGOODJUNE website.
2. Verify its Measurement ID is **G-88EXS6ZTJH** and website URL is `https://onegoodjune.com`. The property name in the supplied screenshot was “xilolo”; a name alone does not identify the stream's website, so check the URL.
3. Turn **Enhanced measurement** off and save.
4. Set `NEXT_PUBLIC_GA_ENABLED=true` in Vercel Production and redeploy the updated code. After the deployment, open the production site in a fresh browser session, accept analytics, then navigate Home → About → Pubs.
5. Open Analytics Realtime to check the visit and page views. Use Google's Test installation or Tag Assistant for additional diagnostics. Do not install the manual snippet or a second tag on top of the integration.
6. Decline in a fresh session to verify that the client’s GA4 script does not load. Analytics preferences lets an existing visitor change their choice.

The code was browser-tested with the Google script stubbed so development verification does not contaminate the client's property. Actual receipt of live events in the client's Analytics account still requires the post-deployment check above.

References: [Google SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [Analytics setup](https://support.google.com/analytics/answer/9304153).

## How to handle article SEO in Sanity

1. Open `https://onegoodjune.com/studio` after deployment and sign in with your invited account.
2. Open **Posts**, then an existing article or a new draft.
3. Complete the normal editorial fields: title, readable slug, excerpt, author, publication date, category, body and featured image. These already provide sensible search defaults.
4. Expand **Search & sharing (SEO)**:
   - **Search title:** optional alternative title for the browser/search result. Keep it specific to the article, clear and natural; around 50–60 characters is a practical guide, not a ranking requirement. ONEGOODJUNE is appended by the site. Do not repeat the brand yourself.
   - **Search description:** optional concise, accurate summary, usually about 140–160 characters. Include the topic naturally. Google may choose another snippet.
   - **Sharing image:** optional social-preview image, recommended **1200 × 630 px**. This does not change the article's visible featured image. Set meaningful alternative text.
5. Leave these SEO fields blank to use the normal article title, excerpt and featured image. Empty overrides do not blank out existing metadata.
6. Review the article and **Publish**. Draft changes do not affect the published page until published. Preview sessions can show draft content separately.
7. Check the public article URL. Search/social preview fields do not change the visible headline, body or article structured-data headline. Social networks can cache old previews; search results also update on Google's schedule.

### Normal article-editing habits

- Give each article a clear topic and a useful, specific title. Avoid stuffing repeated keywords into titles, descriptions or image alternative text.
- Use Heading 2 for major sections and Heading 3 for subsections. The page already creates the main H1 from the article title.
- Use the body editor's link tool to connect genuinely related articles with descriptive link text.
- Keep author profiles, publication dates, categories and tags accurate. Categories/tags organise content; they are not automatic ranking boosts.
- Featured-image source recommendation: **1800 × 1200 px (3:2 landscape)**. Keep key content central because the site crops the image differently on cards and hero/article layouts. The separate sharing image is **1200 × 630 px**.
- Avoid changing published slugs casually: changing an article slug does not create an individual old-to-new redirect automatically. Ask the developer to add a redirect if a published slug must change.

SEO overrides apply to **Posts**. Contributor profile descriptions still derive from biographies; static marketing-page metadata is maintained in code. No live articles or CMS records were changed by adding these fields.

## Search Console and the sitemap screenshot

A public read on November 3, 2026 returned a populated XML **urlset with 44 URLs**, including 17 article URLs, from `https://onegoodjune.com/sitemap.xml`. The screenshot described a sitemap index with zero discovered pages, which differs from the current response. That screenshot alone does not prove the current sitemap is broken or why the report has not updated.

1. Open that exact sitemap URL to confirm the XML loads on the final production domain.
2. In Search Console → Sitemaps, submit `https://onegoodjune.com/sitemap.xml` again after deployment, then open its report details.
3. Inspect `https://onegoodjune.com/home`, `/pubs` and a published article with URL Inspection → Test live URL. If eligible, request indexing.
4. Revisit the sitemap and Page indexing reports after Google processes the current version. Discovered URLs are not the same as indexed pages or ranking positions. Check the details/errors rather than assuming an immediate indexing deadline.

[Google's Sitemaps report guide](https://support.google.com/webmasters/answer/7451001), [requesting a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).


## Implementation verification

Browser tests at 390px and 1440px confirm no request for this measurement ID before acceptance or after initial decline, one script load after acceptance, one initial page view plus one public navigation view, stripped URL queries, withdrawal disabling GA, and no runtime errors or horizontal overflow. Google scripts were stubbed, so this is integration verification rather than confirmation of received live Analytics data. Existing Substack embeds are third-party content managed separately from this tracker.

The full regression suite passes (41 tests); the SEO/analytics-specific tests were rerun after the final attribution adjustment and pass. ESLint, TypeScript and the production build pass. This change adds editor fields without publishing or rewriting client articles.

Google's automatic installation check may not detect a consent-gated tag before acceptance. Verify with a consenting browser session and Realtime/Tag Assistant; declined visits intentionally do not appear in this tracker.
