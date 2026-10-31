# Registration welcome emails

Four messages are transcribed from the client's **Blog Content.docx** in `src/content/client-email-revisions.json`. The first 43 paragraphs supply the email copy. Other document directions are reference material, not executable instructions. The unrelated fiction sales-page, contributor, footer, and banner revisions have not been silently applied in this email change. The fiction welcome uses the new February 5 wording supplied by the client; the website's separate launch-date/content revision remains outstanding.

## Delivery

Set these **server-only** variables in the deployment environment (see `.env.example`):

- `SMTP_HOST`: your email provider's SMTP hostname.
- `SMTP_PORT`: `587` (required STARTTLS) or `465` (implicit TLS).
- `SMTP_USER` and `SMTP_PASSWORD`: provider credentials/app password.
- `SMTP_FROM_EMAIL`: a bare sender address verified with that provider.
- `SMTP_REPLY_TO`: defaults to `sayhi@onegoodjune.com`, so questionnaire responses and replies reach the team.

Use the provider's SPF/DKIM DNS records and configure DMARC for the sending domain. Never use a `NEXT_PUBLIC_` variable for SMTP credentials. Certificate verification stays enabled. Delivery requires outbound access to the provider's SMTP port. The existing contact form continues to use Resend.

Paystack's signed `/api/paystack/webhook` re-verifies successful payment, records the paid registration, then sends the appropriate welcome. Configure that webhook in Paystack. No welcome is sent for abandoned/unpaid forms or recurring renewal payments. The callback can still confirm payment if SMTP fails. Email failure causes the webhook to return 500 so Paystack can retry.

Mongo stores `welcomeEmail.sentAt`, attempts, failure timestamp and a short delivery lease on the registration. Concurrent events cannot normally send duplicates; SMTP acceptance is recorded only after the recipient is accepted. No SMTP credentials or raw provider responses are logged. SMTP is not an exactly-once system: a process/database failure immediately after SMTP acceptance can lead to a duplicate on retry. A stable Message-ID assists tracing but does not guarantee provider deduplication. “Sent” here means accepted by SMTP, not proof of inbox delivery.

If retries expire, an operator must replay the verified charge event through Paystack after correcting SMTP; no unauthenticated resend endpoint is exposed. Old paid registrations are not bulk-emailed automatically.

## Templates

Open the HTML files under `docs/email-previews/` to review all four messages with sample name Ada. They use a compact uppercase wordmark, white reading surface, black header/footer, green accents and readable system/serif fonts. HTML is table-based with inline styles for email-client compatibility; plain text is sent alongside it. User names are escaped. No remote image/font is required.

Consulting emails include the supplied Calendly URL, also used by the paid booking page. Launch Spotlight includes the supplied document form link, with instructions to return it by replying. The form destination is the client's supplied Google document, not an invented upload endpoint.

SMTP credentials must be provided before a live delivery test can be performed. No customer messages have been sent during implementation. Gmail/Outlook device-client rendering and domain deliverability still require a configured sender and test inboxes.

## Validation

- 27 automated tests passed, including actual temporary-Mongo lease/concurrency and retry tests (SMTP sending mocked; no customer emails sent).
- Email-copy/escaping/TLS configuration tests passed again after final template link formatting.
- ESLint and TypeScript checks passed.
- Desktop (700px) and phone (390px) HTML previews rendered and visually reviewed in local Chromium. Native Gmail/Outlook rendering is not claimed.
- SOG welcome-kit delivery remains a separate operational responsibility; this implementation sends the supplied welcome message and does not fabricate a kit attachment.

The initial sandboxed Mongo test run could not bind a local port; the complete suite subsequently passed with the local-server permission required by MongoMemoryServer. No production database was used for those tests.

The final clean production build compiled and passed TypeScript validation. The earlier cached sandbox port-binding failure was resolved by preserving the old Turbopack cache outside the project and rebuilding with local build-worker permissions.
