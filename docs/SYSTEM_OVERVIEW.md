# Cardio-Assistant — System Overview (local)

This file is duplicated across all repos so each one is self-contained for AI-assisted
development. It describes how the whole system fits together and how to run it locally.

## Repositories

| Repo      | Role                          | Stack                     | Local port | Branch (local work)            |
|-----------|-------------------------------|---------------------------|-----------|---------------------------------|
| `api`     | Backend API + infra           | Spring Boot 3.3 / Java 21 | 8080      | `added-docs-and-local-docker`   |
| `ML`      | ML inference (cardio-ai)      | FastAPI + PyTorch (GPU)   | 1667      | `local-docker-gpu-setup`        |
| `web`     | Main web app (doctor UI)      | Next.js 14                | 3001      | `local-ui-no-auth-redesign`     |
| `landing` | Marketing site (standalone)   | Next.js 14                | 3000      | `add-docs`                      |

## Runtime topology (local)

```
            browser
               |
   http://localhost:3001/web            http://localhost:3000  (landing, standalone)
               |
   [ web : Next.js :3001 ]
     /web/api/*  ->  Next proxy (src/app/api/[...path]/route.ts)
               |  BACKEND_URL=http://localhost:8080
               v
   [ api : Spring Boot :8080 ]  (docker compose)
        |            |                  \
   postgres:5432   redis:6379            \  CARDIOAI_URL
   (JPA data)    (JWT blacklist)          v
                                  [ ML cardio-ai : FastAPI :1667 ]  (GPU)
                                  default -> cardioai-mock :8082 (stub)
```

- The browser only ever talks to the web app (`:3001`). The web app **proxies** all
  `/web/api/*` calls server-side to the backend, so there are no CORS issues and the
  backend cookie (`userToken`) flows through transparently.
- The backend calls the ML service for DICOM processing & 3D reconstruction. Locally it
  defaults to an in-repo **mock** (`cardioai-mock`) and can be switched to the **real**
  GPU service in the `ML` repo.

## ML integration contract (backend ↔ ML)

The backend (`MicroservicesClient.java`) calls these endpoints on `CARDIOAI_URL`:

| Method / path           | Purpose                                   | Request                              | Key response fields |
|-------------------------|-------------------------------------------|--------------------------------------|---------------------|
| `POST /extract-dicom`   | frames + metadata from a DICOM            | multipart `dicom_file`               | `Images` (b64 png), `PositionerPrimaryAngle`, `PositionerSecondaryAngle`, `HeartOpenFrames`, `HeartClosedFrames` |
| `POST /process-frame`   | vessel centerlines on one frame           | `image_png_base64`, `config` (json)  | `Paths`, `Radius`, `Bifurcations` |
| `POST /reconstruction`  | 3D reconstruction of one branch           | `request` (json)                     | `Centerlines` |
| `POST /reconstruction_3d`| 3D reconstruction from two projections   | `projection1`, `projection2` (json)  | `Centerlines` |

Both the mock and the real service implement all four.

## Run the whole system locally

1. **Backend + infra** (in `api/`):
   ```bash
   docker compose up -d --build
   ```
   Brings up postgres, redis, the cardio-ai **mock**, and the api on `:8080`.
   Seed login: **`doctor` / `doctor123`**.

2. **Web app** (in `web/`):
   ```bash
   npm install   # first time
   npm run dev    # http://localhost:3001/web
   ```
   `.env.local` sets `BACKEND_URL=http://localhost:8080` and `DEMO_MODE=false`.

3. **(Optional) Real ML service** (in `ML/ansible/setup-node/work/centerline_demo/server/`):
   - Put model weights in `models/` (see `models/README.md`).
   - `docker compose up -d --build` (needs NVIDIA GPU).
   - Point the backend at it:
     ```bash
     # in api/
     CARDIOAI_URL=http://host.docker.internal:1667 docker compose up -d
     ```

## Smoke test (HTTP)

```bash
# login (sets userToken cookie)
curl -i -c ck.txt -X POST "http://localhost:8080/auth/signin?login=doctor&password=doctor123"
# real data
curl -b ck.txt http://localhost:8080/patients/list
# through the web proxy
curl -b ck.txt http://localhost:3001/web/api/patients/list
```

## Key credentials / defaults (local only)

- DB: `postgres` / `mshanya`, db `CardioMVP`.
- Seed user: `doctor` / `doctor123` (patient "Иванов Иван Иванович", one project).
- JWT issuer (docker): `cardiomvp-local-dev`; cookie `userToken`, 8h lifetime.
- Note: the backend regenerates its JWT signing key on each restart, so existing
  tokens become invalid after an api restart — just log in again.
