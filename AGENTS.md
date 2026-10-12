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
sends submissions to **Telegram** (primary) and **SMTP/email** (fallback), with rate
limiting + a honeypot field. No external app backend involved. Config via env (see
`.env.example`): `TELEGRAM_*`, `SMTP_*`.

## Run locally
```bash
pnpm install
pnpm dev            # http://localhost:3000  (redirects to /about)
```
Contact form needs `TELEGRAM_*` / `SMTP_*` env to actually deliver; UI works without them.

## Layout
- `src/app/` — App Router pages (about, partners, team, …) + `api/contact`.
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
- Speed/load numbers are measured on the project GPU stand — keep the "measured on the test stand" wording.

## Legal documents (152-FZ) — `src/legal/`
- Pages: `/legal` (hub + short EN note), `/legal/privacy` (policy, cookies in `#cookies`), `/legal/consent-contacts`
  (consent for the contact form), `/legal/consent-registration` (consent for registering in the web app), `/legal/terms`.
  Russian only; the EN note says the Russian text is authoritative. The texts are TSX in `src/legal/content/`.
- `src/legal/operator.ts` — the operator's details (ООО «Нексли»: ИНН/КПП/ОГРН, address, e-mail, phone, responsible
  person) and the retention periods the pages print. `src/legal/documents.ts` — the registry: slug, code, **edition**
  (the date the text came into force, now `2026-10-13`). Footer, form and pages all read these; change them there only.
- **The consent is a separate document** (art. 9 of the Law since 1 Sep 2025): never fold it into the policy or the terms.
  The contact form has its own unchecked, required checkbox, the button is disabled until ticked, and
  `api/contact` refuses a request without `consent: true` and writes the consent edition into the lead message.
- **When a text changes**, change its edition in `documents.ts` AND in `web/config/legal.ts` AND in `api/internal/consent`
  (registration sends the edition; the api refuses an old one), and deploy the three together.
- **The policy states facts about the deployment** — keep them true or change the text: no analytics/ads/third-party
  scripts (do not add any without an opt-in and a new edition); fonts are self-hosted; the web app, its database and the
  AI services run in Russia; contact-form requests go to **Telegram** (a foreign service: cross-border transfer, named in the
  policy, the consent and the footer) with e-mail as the fallback; log retention (`RETENTION`).
  Switching Telegram off (`TELEGRAM_*` unset) means the policy section 8 and the consent section 5 must be edited.
- The cookie notice (`components/cookie-notice.tsx`) stores `ca-cookie-notice` in localStorage — the same key as the web
  app (same origin). `I18nProvider` sits in the root layout because the notice and the footer need the language everywhere.

## Deployment
- Dockerized (multi-stage, port 3000) behind nginx + certbot — see `DEPLOY.md`.
- Image: `ghcr.io/cardio-assistant/landing`.

## More docs
- `DEPLOY.md` — VPS/DNS/Telegram/Docker deployment.
- `docs/SYSTEM_OVERVIEW.md` — whole-system map (this site is the standalone piece).
