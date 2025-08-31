Video Link : 

# RoadGuard Odoo

Comprehensive monorepo for RoadGuard — a workshop/workers marketplace with a TypeScript/Node backend and a React + Vite frontend.

## Overview

- Backend: Express + TypeScript API located in `backend/`.
- Frontend: React + TypeScript app built with Vite located in `ui/`.
- Purpose: Manage workshops, workers, service requests, quotations and authentication.

This README documents how to set up, run, and contribute to both parts of the project.

## Table of contents

- Video Link
- Architecture
- Quick start (local)
- Backend (details & scripts)
- Frontend (details & scripts)
- Environment variables
- Database & scripts
- Tests and linting
- Troubleshooting
- Contributing
- License

## Architecture

- Backend: TypeScript, Express, Sequelize (models live in `backend/src/models`), controllers in `backend/src/controllers`, routes in `backend/src/routes`.
- Frontend: React with TypeScript, Vite dev server, components under `ui/src/components`, pages under `ui/src/pages`.

Key backend entry points:

- `backend/src/app.ts` — express app and middleware wiring.
- `backend/src/server.ts` — server bootstrap (port, listen).

Key frontend entry points:

- `ui/src/main.tsx` — React app mounting.
- `ui/vite.config.ts` — Vite configuration.

## Quick start (local development)

Prerequisites

- Node.js (v16+ recommended) and npm or pnpm.
- A local Postgres database (or adjust `DATABASE_URL` to your DB).

1) Clone the repo

```pwsh
# from your workspace folder
git clone <repo-url> roadgaurd_odoo
cd roadgaurd_odoo
```

2) Install dependencies

```pwsh
# backend
cd backend
npm install

# in another shell: frontend
cd ../ui
npm install
```

3) Configure environment variables

Copy and edit the `.env` files in both `backend/` and `ui/` from their `.env.example` counterparts. Key variables include database connection and cloudinary credentials for uploads. See `Environment variables` section.

4) Run database sync (development)

The backend includes a sync script at `backend/src/scripts/syncDatabase.ts`. You can run it via:

```pwsh
cd backend
npm run sync-db
```

5) Start backend and frontend

Open two shells and run:

```pwsh
# backend
cd backend
npm run dev

# frontend
cd ui
npm run dev
```

The frontend should proxy or call the backend API endpoints at whichever base URL you set in `ui/.env` (look for variables like `VITE_API_BASE_URL` or similar).

## Backend — details

Location: `backend/`

Important scripts (from `backend/package.json`)

- `dev` — start dev server with ts-node / nodemon (watch).
- `start` — build & run production server.
- `sync-db` or similar — sync database models (see `scripts/syncDatabase.ts`).

Files of interest:

- `backend/src/config/db.ts` — database connection.
- `backend/src/models/*` — Sequelize models (User, Workshop, Worker, Service, ServiceRequest, Quotation, Otp, Review).
- `backend/src/controllers/*` — API controllers.
- `backend/src/routes/*` — route definitions (authRoutes, workshopRoutes, workerRoutes, serviceRequestRoutes, quotationRoutes, uploadRoutes).
- `backend/src/middlewares/authMiddleware.ts` — authentication middleware for protected endpoints.

API surface (high level)

- Auth: `/api/auth/*` — sign up/login/OTP.
- Workshops: `/api/workshops/*` — create, list, update workshops and details.
- Workers: `/api/workers/*` — worker CRUD and assignment.
- Service Requests: `/api/service-requests/*` — create service requests and manage status.
- Quotations: `/api/quotations/*` — create and manage quotations for requests.
- Uploads: `/api/upload/*` — file uploads (cloudinary service is used in `backend/src/services/cloudinaryService.ts`).

Environment variables (backend)

Place in `backend/.env` or root `.env` if configured to read it. Common variables:

- DATABASE_URL or DB_HOST/DB_NAME/DB_USER/DB_PASS
- PORT (server port)
- JWT_SECRET (auth token secret)
- CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- EMAIL service keys (see `backend/src/services/emailService.ts`)

## Frontend — details

Location: `ui/`

Important scripts (from `ui/package.json`)

- `dev` — run Vite dev server.
- `build` — build production bundle.
- `preview` — preview production build.

Files of interest:

- `ui/src/main.tsx` — app bootstrap.
- `ui/src/App.tsx` — top-level application routes and layout.
- `ui/src/services/*` — API client wrappers (auth, workshop, serviceRequest, cloudinary).
- `ui/src/hooks/*` — reusable hooks (auth, api, workshops).
- `ui/src/components/*` — UI components and auth helpers (ProtectedRoute, RoleBasedRoute).

Environment variables (frontend)

Place in `ui/.env` or `ui/.env.local`. Look at `ui/env.example` and `ui/.env.example` for examples. Typical vars:

- VITE_API_BASE_URL — base URL for backend API.
- VITE_CLOUDINARY_UPLOAD_PRESET — for direct uploads (if used).

## Database & scripts

The backend uses Sequelize models and includes scripts to reset/clear test data located in `backend/scripts/`:

- `clear_database.sql` and `clearDatabase.js` — helper scripts to drop or clean tables.
- `clearOtps.js` — cleanup OTP entries.

Use these with caution — they may drop data.

## Tests and linting

There are no project-wide tests included by default in this repo snapshot. If you add tests, put backend tests under `backend/test` and frontend tests under `ui/src/__tests__`.

Linting and formatting are configured (see `ui/eslint.config.js` and any config in `backend` if present). Run linting via:

```pwsh
# frontend
cd ui
npm run lint

# backend (if available)
cd backend
npm run lint
```

## Troubleshooting

- If the frontend cannot reach the API, ensure `VITE_API_BASE_URL` matches backend's address and that CORS is enabled in `backend/src/app.ts`.
- Database auth errors: verify credentials in `backend/.env` and that the DB server accepts connections.
- Cloudinary/file upload issues: verify cloudinary credentials and upload preset.

## Contributing

1. Fork the repo.
2. Create a branch: `feature/your-feature`.
3. Run linters and tests locally.
4. Open a PR describing your changes.

Please follow the existing TypeScript style and keep controller logic in `backend/src/controllers` and heavy UI state in `ui/src/hooks` or `ui/src/stores`.

## Maintainers

- Primary: repository owner — see git history.

## License

Include a LICENSE file in the repo root if you intend to publish. No license file included in this snapshot.

---

If you'd like, I can also:

- Add a top-level `.env.example` that composes both `backend` and `ui` variables.
- Generate a minimal `Makefile` or PowerShell script to run both servers in parallel for Windows dev.

Requirements coverage:

- Study frontend and backend: Done (README references key files & architecture).
- Add a comprehensive README: Done (this file).
- Add a field at the top, Video Link : : Done (line 1).
