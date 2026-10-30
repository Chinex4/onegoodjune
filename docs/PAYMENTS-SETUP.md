# Registrations, Paystack payments and the admin dashboard

This covers every paid flow:
- "Get instant access" on School of Growth.
- "Join the Waitlist" on Write Fiction Like Great Movies.
- "Book your author business consultation" on `/author-consultation`.
- "Feature My Book" on `/launch-spotlight`.

It also covers free event registrations on `/events`.

## How it works

1. A visitor clicks a CTA. A form opens asking for **full name, email and phone number** (and the plan, on School of Growth).
2. `POST /api/register` validates the form, saves a registration in MongoDB with status `pending`, and asks Paystack to start a transaction. The visitor is redirected to Paystack's checkout.
3. After paying, Paystack sends the visitor to **`/payment/callback?reference=…`**. That page verifies the payment directly with Paystack's API, updates the registration (`paid`, `failed`, `abandoned` or `pending`) and shows the result.
4. Paystack also calls the **webhook** `POST /api/paystack/webhook`. It checks Paystack's signature, re-verifies the transaction, and updates the same record. This catches payments when the visitor closes the tab before the callback page loads.
5. Admins sign in at **`/silencekeepsitgoingonegoodjune`** (the path is set in `src/lib/admin-path.ts`) to see every registration, filter by program or payment status, search, and export CSV.

Prices live in `src/lib/programs.ts`:

| Program | Amount | Billing |
| --- | --- | --- |
| School of Growth — Riser | ₦12,500 | every quarter |
| School of Growth — Builder | ₦75,000 | per year |
| School of Growth — Visionary | ₦55,000 | every quarter (founding price) |
| Fiction course waitlist | ₦27,500 | one-time |
| Author Business Consultation | ₦101,250 | one-time, 60-minute session |
| Launch Spotlight — Basic / Standard / Elite | ₦25,000 / ₦35,000 / ₦52,000 | one-time; the form also asks for the book title and release date |

**Consultation booking.** After a paid consultation, the confirmation page shows "Choose your session time". That goes to `/author-consultation/book?reference=…`, a branded page that only unlocks for a paid consultation reference. It links to the Zoom Scheduler, which opens on its own page because Zoom won't render inside another site.

Safety measures:
- The secret key is used only on the server.
- Webhooks are rejected without a valid `x-paystack-signature`.
- An amount that doesn't match the program is recorded as `failed`.
- A payment is never downgraded from `paid`.
- The callback and webhook can both arrive for the same payment without double-counting.

## 1. MongoDB (MongoDB Atlas, free tier)

1. Create an account at [mongodb.com/atlas](https://www.mongodb.com/atlas) and a **free M0 cluster**. Choose a region close to Nigeria, e.g. AWS `eu-west` or `af-south-1`.
2. **Database Access → Add New Database User.** Pick username/password authentication and the role "Read and write to any database". Save the password.
3. **Network Access → Add IP Address → Allow access from anywhere (`0.0.0.0/0`).** Vercel's servers don't have fixed IPs. Access is still protected by the username and password. *Alternative:* install the **MongoDB Atlas integration** from the Vercel Marketplace, which creates the user and sets `MONGODB_URI` for you.
4. **Database → Connect → Drivers.** Copy the connection string, e.g. `mongodb+srv://ogj-app:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`, and put your password in place of `<password>`.
5. Set `MONGODB_URI` to that string and `MONGODB_DB=onegoodjune`.

The app creates its collections and indexes on first use:
- `registrations` — one per form submission.
- `payments` — every verified transaction, including subscription renewals.

## 2. Paystack

### Keys

In Paystack, go to **Settings → API Keys & Webhooks**:

- `PAYSTACK_SECRET_KEY`: `sk_test_…` while testing, `sk_live_…` in production. **Never** share it or commit it.
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: `pk_test_…` / `pk_live_…`. It's stored for future inline checkout; the current redirect flow doesn't need it.

### Callback URL

Nothing to configure. Each transaction sends its own `callback_url` (`https://<your-domain>/payment/callback`). Any callback URL in the Paystack dashboard is used only as a fallback, so you can leave it empty or set it to the same address.

### Webhook URL

In **Settings → API Keys & Webhooks**, set the **Webhook URL** for both the Test and the Live tab:

```
https://onegoodjune.com/api/paystack/webhook
```

(Use `https://onegoodjune.vercel.app/api/paystack/webhook` until the custom domain is live.)

Paystack can't reach `localhost`. To test webhooks locally, run a tunnel such as `npx cloudflared tunnel --url http://localhost:3000` or ngrok, and use the tunnel's URL temporarily. Locally, the callback page already confirms payments without the webhook.

### Testing a payment

With test keys, pay on Paystack's checkout with the test card **4084 0840 8408 4081**, any future expiry date, CVV **408**. That card succeeds without OTP. More cards: [paystack.com/docs/payments/test-payments](https://paystack.com/docs/payments/test-payments). The registration then shows as **Paid** in the admin dashboard.

### Recurring billing (optional)

By default each checkout charges once for the current period. To bill Riser and Visionary quarterly and Builder yearly automatically:

1. In Paystack, open **Products → Plans** (or use the subscription plans already created) and create one plan per tier with the right amount and interval.
2. Copy each plan code (`PLN_…`) into `PAYSTACK_PLAN_SOG_RISER`, `PAYSTACK_PLAN_SOG_BUILDER` and `PAYSTACK_PLAN_SOG_VISIONARY`.

Checkout then creates a subscription. Paystack sends each renewal to the webhook, and it's recorded in `payments`, linked to the learner by email and plan.

Builder's "pay in 2–4 installments" isn't automated yet. Learners currently pay the yearly amount in one go. Installment plans can be added as separate Paystack plans.

### Going live

1. Complete Paystack business verification.
2. Change `PAYSTACK_SECRET_KEY` (and the public key) to the `sk_live_` / `pk_live_` values in Vercel.
3. Set the webhook URL on Paystack's **Live** tab.
4. Redeploy and make one real small payment to confirm it appears as **Paid** in the admin dashboard.

## 3. Admin dashboard

- `ADMIN_PASSWORD`: the password admins type at the admin dashboard. Use a long passphrase and share it only with people who need access.
- `ADMIN_SESSION_SECRET`: 32+ random characters (`openssl rand -hex 32`). It signs the 12-hour session cookie. Changing it signs everyone out.

The dashboard shows paid totals per program; filters by program, status and search; the full registration table (date, name, email, phone, program, amount, status, paid date, reference); and **Export CSV**. The dashboard is marked `noindex` and deliberately not listed in `robots.txt`, which would advertise its address; `/payment/` is excluded from search engines.

## 4. Vercel environment variables

Add these under **Project → Settings → Environment Variables**, for Production and Preview, then redeploy:

| Variable | Notes |
| --- | --- |
| `PAYSTACK_SECRET_KEY` | test key on Preview, live key on Production |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | matches the secret key's mode |
| `MONGODB_URI` | from Atlas |
| `MONGODB_DB` | `onegoodjune` |
| `ADMIN_PASSWORD` | |
| `ADMIN_SESSION_SECRET` | |
| `PAYSTACK_PLAN_SOG_*` | optional |

If MongoDB or Paystack isn't configured, the form shows "Registration is temporarily unavailable. Please email sayhi@onegoodjune.com." It doesn't take payment without recording it.

## 5. Events

Events are managed in Sanity Studio under **Events**: title, date and time, location, admission, landscape flyer, description, and an optional extra question (default "Where are you joining from?").

- `/events` lists upcoming events first, then past ones.
- Each event page shows its registration form until the start time. Untick **Accept registrations** to close it earlier.
- Registrations (name, email, answer) are saved in MongoDB, one per email per event. You'll find them in **the admin dashboard → Event registrations**, with filters and CSV export.
- This replaces the Google Sheet or Brevo option from the brief. To email registrants, export the CSV and import it into Brevo.

The placeholder event from the brief ("Manny, Ada & Sesan…", 23 October 2026, 8 PM WAT) is in Studio. Its date has passed, so it shows as closed. Edit the date, or duplicate it for the next session.
