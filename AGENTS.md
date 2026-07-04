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
- Animation-heavy components; design tokens are the source of truth for the ecosystem look.

## Deployment
- Dockerized (multi-stage, port 3000) behind nginx + certbot — see `DEPLOY.md`.
- Image: `ghcr.io/cardio-assistant/landing`.

## More docs
- `DEPLOY.md` — VPS/DNS/Telegram/Docker deployment.
- `docs/SYSTEM_OVERVIEW.md` — whole-system map (this site is the standalone piece).
