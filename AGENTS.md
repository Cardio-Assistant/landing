# AGENTS.md — `landing` (Cardio-Assistant marketing site)

Guidance for AI agents (and humans). Cross-repo picture: [`docs/SYSTEM_OVERVIEW.md`](docs/SYSTEM_OVERVIEW.md).

## What this is
Standalone marketing/landing site for Cardio-Assistant (`ai-cardio.ru`). **Independent**
of the backend and the main web app — it shares no code, only the visual design language
that the `web` app was restyled to match.

## Stack
- Next.js 14 (App Router), React 18, TypeScript, pnpm.
- Tailwind + DaisyUI, Framer Motion / GSAP / React Spring for animation.
- `output: standalone`; `/` redirects to `/about`. Dev server on **:3000**.

## Backend interaction (self-contained)
The only server code is `src/app/api/contact/route.ts` — a lead-capture endpoint that
sends submissions **only by e-mail** (SMTP, `smtp.beget.com` by default, to the support
mailbox), with rate limiting + a honeypot field. No external app backend, no messenger.
Config via env: `SMTP_*` (the `TELEGRAM_*` variables in `.env.example` are obsolete).

## Run locally
```bash
pnpm install
pnpm dev            # http://localhost:3000  (redirects to /about)
```
Contact form needs the `SMTP_*` env to actually deliver; UI works without it.

## Layout
- `src/app/` — App Router pages (about, legal, …) + `api/contact`.
- `src/app/web/auth/page.tsx` — the fallback of the demo, shown only if `/web` is not served by the demo (in
  production nginx answers `/web/*` first, see `nginx/conf.d/app.conf.template`). It has no sign-in or registration.
- `src/pages-comp/about/features/i18n/dictionary.ts` — all ru/en copy of the landing (keep both locales in parity).
- `public/screens/` — WebP screenshots of the product UI for the "Interface" section (test patient only).
- Animation-heavy components; design tokens are the source of truth for the ecosystem look.

## Copy rules (state as of 2026-10)
- Describe only what the product does today: DICOM viewer, AI segmentation + 3D model of the coronary arteries,
  per-branch narrowing analysis, draft conclusion confirmed by the physician, voice protocol, local AI assistant.
- No risk prediction / risk scores, blood-flow modelling or stent/bypass selection. They may appear only in the
  clearly labelled "Planned / В планах" list.
- It is a working prototype of a decision-support system, **not a medical device**; the physician decides.
  Do not state clinical accuracy figures (validation with the Sukhanov Federal Center physicians is ongoing).
- Analysis values are in model units (no metric calibration): never write millimetres.
- The only measured figure on the page is the 3D build time (~18 с on average, on the project test stand): keep the
  "test stand" qualifier next to it. Do not bring back the benchmark strip (maxima, requirements, load tests).
- **Keep the copy short** (owner's request, 2026-10): hero = one value sentence + three short bullets + the one-line
  "prototype, not a medical device"; problem = a claim of 1–2 sentences + the one WHO figure; solution cards = a title and
  one line; interface = one-line captions; investors = three short points (market, model, status). No methodology,
  no lists of guideline or model names, no tables. New copy must not claim anything the page did not already say.
- **The demo** (owner's decision, 2026-10-13): the public site is a landing plus a demo at `/web` that runs on fictional
  example data. The hero button says «Посмотреть демо» / «View demo», is a plain `<a href='/web/auth'>` — the demo's
  entry screen with «Войти в демонстрацию» (owner's decision, 2026-10-17); another app lives there: no `next/link`, no
  prefetch — and has one line under it saying the demo runs on example data. Do not promise
  registration, sign-in, invitations or "early access" anywhere on the site, and do not name the real web application's address.

## Legal documents (152-FZ) — `src/legal/`
- **The site keeps two documents only** (owner's decision, 2026-10-13: the public site is a landing + a demo on example
  data; the real web application lives at a non-public address and has its own documents): `/legal` (hub + short EN
  note), `/legal/privacy` (the policy of the site, cookies in `#cookies`) and `/legal/consent-contacts` (consent for
  the contact form). Russian only; the EN note says the Russian text is authoritative. The texts are TSX in `src/legal/content/`.
- **Do not bring back** the registration consent or the terms of use, and **do not add redirects** from their old
  addresses (`/legal/consent-registration`, `/legal/terms`): they must 404, because a redirect would reveal where the
  application lives. The policy does not describe the app (no accounts, patients, registration, audit); it says in one
  sentence (1.4) that the demo uses only fictional example data and collects no personal data, and that the app has its own documents.
- `src/legal/operator.ts` — the operator's details (ООО «Нексли»: ИНН/КПП/ОГРН, address, e-mail, phone, responsible
  person) and the retention periods the pages print. `src/legal/documents.ts` — the registry: slug, **edition**
  (the date the text came into force, now `2026-10-13`). Footer, form and pages all read these; change them there only.
- **The consent is a separate document** (art. 9 of the Law since 1 Sep 2025): never fold it into the policy.
  The contact form has its own unchecked, required checkbox, the button is disabled until ticked, and
  `api/contact` refuses a request without `consent: true` and writes the consent edition into the lead message.
- **When a text changes**, change its edition in `documents.ts` (the form sends the consent edition, `api/contact`
  writes it into the lead e-mail). Section numbers matter: the consent points at policy sections 5 (recipients, no
  cross-border transfer) and 8 (rights), and the policy refers to its own sections (3.2, 4.1, 4.2, 5, 9) — if you
  renumber the policy, fix every reference in both texts.
- **The policy states facts about the deployment** — keep them true or change the text: no analytics/ads/third-party
  scripts (do not add any without an opt-in and a new edition); fonts are self-hosted; the web server logs (nginx on the
  VPS of a Russian hosting provider) are kept at most `RETENTION.webLogsMonths`; contact-form requests go **only by
  e-mail** to support@ai-cardio.ru through the mail service of the domain (ООО «Бегет», Russia) and are not stored on
  the site's server; storage is in Russia and there is no cross-border transfer. Adding a foreign service (a messenger,
  analytics, a CDN, a cloud form) needs a new edition of the policy (sections 4–5) and of the consent (section 5).
- The cookie notice (`components/cookie-notice.tsx`) stores `ca-cookie-notice` in localStorage — the same key as the
  demo under `/web` (same origin). The landing sets no cookies itself: `theme`, `locale` and `ca-cookie-notice` are all in
  localStorage and never sent to the server (policy section 9 lists them). `I18nProvider` sits in the root layout because
  the notice and the footer need the language everywhere.

## Deployment
- Dockerized (multi-stage, port 3000) behind nginx + certbot — see `DEPLOY.md`.
- Image: `ghcr.io/cardio-assistant/landing`.

## More docs
- `DEPLOY.md` — VPS/DNS/Docker deployment (its Telegram parts are obsolete: the form goes by e-mail only).
- `docs/SYSTEM_OVERVIEW.md` — whole-system map (this site is the standalone piece).
