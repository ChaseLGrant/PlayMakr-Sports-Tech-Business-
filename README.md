# PlayMakr — Sports Technology Landing Page & Lead System

A production-ready marketing site and lead-generation system for a sports technology
company, built around the **Founding 100** launch offer (a free Sports Technology &
Revenue Audit).

**What's included**

| Area | What it does |
| --- | --- |
| Landing page (`/`) | Hero (A/B variants), problems, solution pillars, revenue calculator, process, Founding 100 offer, example product interfaces, FAQ, final CTA |
| Revenue Leakage Calculator | Live estimates with formulas shown on the page, no double counting, and capacity kept separate from cash savings |
| Application funnel (`/apply`) | 4-step form with validation, consent, spam protection, and an option to attach calculator results |
| Lead database | PostgreSQL tables for leads, notes, tasks, status history, analytics, admin users, and sessions |
| Lead scoring | Automatic 0–100 qualification score with a per-factor breakdown |
| Notifications | Owner email, Slack alert, and applicant acknowledgment. Each turns on when its credentials are added |
| Admin (`/admin`) | Password-protected funnel metrics, A/B results, sources, leads table, lead detail with stage, notes, tasks, and founding partner enrollment (hard-capped at 100) |
| Analytics | First-party funnel events stored in your database, mirrored to GA4, GTM, or Plausible if installed |
| SEO | Metadata, Open Graph image, sitemap, robots, JSON-LD (Organization + FAQ) |
| Tests | Calculator formulas, validation, scoring, submission workflow, spam/rate limits, founding cap, admin auth |

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod ·
PostgreSQL (`pg`) · PGlite (embedded Postgres for local dev and tests) · Vitest.

---

## 1. Run it locally (5 minutes)

You need **Node.js 20.9 or newer**.

```bash
npm install
cp .env.example .env.local        # optional locally; everything works with defaults
npm run admin:create -- --email you@yourcompany.com --name "Your Name"
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (sign in with the account you just created)

With no `DATABASE_URL` set, the app uses a **real embedded PostgreSQL** stored in `./.data/pglite`.
Stop `npm run dev` before running `admin:create` or `db:migrate`, because the embedded database
allows only one process at a time.

Preview hero variant B any time at http://localhost:3000/?variant=B.

## 2. Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run automated tests |
| `npm run lint` / `npm run typecheck` | Code quality checks |
| `npm run build` then `npm start` | Production build and serve |
| `npm run db:migrate` | Apply database migrations to `DATABASE_URL` |
| `npm run db:migrate -- --print` | Print the SQL (e.g. to paste into the Supabase SQL editor) |
| `npm run admin:create -- --email … --name …` | Create an admin, or reset an admin's password |

---

## 3. Deploy to production (Vercel)

1. **Create a database.** Any PostgreSQL works. With **Supabase**: create a project, then copy
   *Project Settings → Database → Connection string → Transaction pooler* (port 6543).
2. **Run migrations** from your computer against that database:
   ```bash
   DATABASE_URL="postgresql://…" npm run db:migrate
   DATABASE_URL="postgresql://…" npm run admin:create -- --email you@company.com --name "You"
   ```
3. **Import the repo in Vercel** (vercel.com → Add New → Project). The framework is detected automatically.
4. **Add environment variables** in Vercel → Settings → Environment Variables. At minimum:
   `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL` (your real domain), `SESSION_SECRET`, `IP_HASH_SALT`.
   See `.env.example` for every option.
5. **Deploy.** Then visit `/admin` and sign in.
6. **Smoke test:** submit a test application, confirm it appears in `/admin`, then delete it
   from the database or mark it Lost.

> Netlify also works: the existing `@netlify/plugin-nextjs` setup applies. Set the same
> environment variables.

**Security notes**
- The database connection string is read only on the server and is never sent to the browser.
- Every table has Row Level Security enabled with no policies. On Supabase, this means the public
  (anon) API cannot read leads. The app connects as the table owner through `DATABASE_URL`.
- Admin passwords are hashed with scrypt. Sessions are random tokens stored hashed in the
  database, in an `httpOnly` cookie. Every admin page and action re-checks the session; the proxy
  redirect is only a convenience.
- Raw IP addresses are never stored, only a salted hash used for rate limiting.
- Spam protection: a hidden honeypot field, a minimum fill time, database-backed rate limits
  (5 applications per network per hour), and optional Cloudflare Turnstile.

---

## 4. Turning on integrations

All integrations are **off until configured**. The site works without any of them, and nothing
is faked.

| Integration | Variables | Notes |
| --- | --- | --- |
| Owner email alerts + applicant acknowledgment | `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFICATION_EMAIL` | Resend requires a verified sending domain. To use another provider, swap out `sendEmail()` in `lib/server/notify.ts` |
| Slack alerts | `SLACK_WEBHOOK_URL` | Sends the organization name, score, and admin link only (no contact details) |
| Scheduling link | `NEXT_PUBLIC_CALENDAR_URL` | Shown on the confirmation page and in the acknowledgment email; clicks are tracked |
| Spam protection | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Enforced server-side when the secret is set |
| Google Analytics / GTM / Plausible | Add their script tag to `app/layout.tsx` | Funnel events are mirrored automatically |

If email isn't configured, new leads are still saved and appear in `/admin`. The server log notes
that no notification channels are configured.

---

## 5. Operating the system

**Lead stages:** New → Qualified → Audit Scheduled → Audit Completed → Proposal Sent → Won / Lost.
Every change is recorded in the lead's history.

**Funnel metrics** (`/admin`, last 7/30/90/365 days):

| Metric | Source |
| --- | --- |
| Landing visits | `page_view` events |
| Primary CTA clicks | `cta_click` events (location recorded per button) |
| Calculator starts / completions | First input change / 3+ inputs changed, or calculator CTA clicked (unique sessions) |
| Application starts | First field edited in the form (unique sessions) |
| Applications completed | Saved leads |
| Qualified applications | Leads scoring High, or moved to Qualified or later |
| Audit bookings | Leads ever moved to *Audit Scheduled* |
| Closed customers | Leads in *Won* |

The browser can only send click-type events. Outcome events (application completed, qualified,
audit booked, customer won) are recorded by the server, so they can't be faked.

**Lead score (0–100):** revenue 25 · employees 15 · decision-maker title 15 · locations 10 ·
customers 10 · tech spend 10 · organization fit 10 · engagement signals 5. High ≥ 70, Medium ≥ 45.
Adjust the weights in `lib/scoring.ts`.

**Founding 100:** Enroll accepted organizations from a lead's page in the admin. The database
enforces the 100 cap, so it can never be exceeded. To show public availability on the landing
page ("12 / 100 founding partners enrolled"), set `SHOW_FOUNDING_AVAILABILITY=true`. The number
always comes from real enrollment data.

**A/B testing the hero:** set `HERO_SPLIT_TEST=true`. Visitors are randomly and stickily assigned to
A ("Less Software. Better Systems. More Revenue.") or B ("How Much Money Is Your Sports
Organization Losing to Outdated Systems?"). The admin compares visits and applications by variant.
Wait for a meaningful sample (ideally hundreds of visits per variant) before choosing a winner.

---

## 6. Customizing

- **Brand name, contact email, program name, cap:** `lib/brand.ts`
- **Logo:** `components/site/logo.tsx` and `app/icon.svg`
- **Colors & fonts:** `app/globals.css` (`@theme` block) and `app/layout.tsx`
- **Copy:** `components/landing/*`
- **Form choices:** `lib/options.ts` · **Validation:** `lib/validation.ts`
- **Calculator defaults and formulas:** `lib/calculator.ts` (keep the on-page formula list in sync)
- **Legal pages:** `app/privacy`, `app/terms`. These are **templates; have a lawyer review them before launch.**

## 7. Project structure

```
app/                     Pages, API routes, admin, SEO files
  api/applications       POST: validate → score → save → notify
  api/events             POST: anonymous funnel events
  admin/                 Login, dashboard, lead detail, server actions
components/landing/      Landing page sections
components/apply/        Multi-step application form
components/admin/        Admin UI pieces
lib/                     Calculator, scoring, validation, options, brand
lib/db/                  Database connection + migrations
lib/server/              Applications, leads, auth, notifications, security
proxy.ts                 A/B assignment + admin redirect (Next.js 16 "proxy", formerly middleware)
scripts/                 migrate + create-admin CLIs
tests/                   Vitest suites
```

## 8. Truthfulness guardrails (built in)

- No testimonials, client logos, case studies, statistics, countdown timers, or fake scarcity.
- Example interfaces are labeled "Concept example · sample data".
- Calculator outputs are labeled as illustrative estimates, with formulas shown and warnings for
  aggressive assumptions.
- Pricing, ownership, timelines, and integrations are described as defined in a written agreement.
- The free audit is clearly separated from paid implementation.

Keep these in place as you edit copy.
