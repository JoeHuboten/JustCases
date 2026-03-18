# AuraCase Project Agent Context

## Project Overview
AuraCase (package name: justcases) is a production-oriented e-commerce web app for mobile accessories.

Core characteristics:
- Next.js App Router application with TypeScript.
- UI built with Tailwind CSS and reusable React components.
- Product, cart, checkout, account, admin, and support flows already present.
- Integrations for Stripe and PayPal payments.
- Prisma ORM for database access and schema management.
- Test setup with Vitest.

## Primary Stack
- Framework: Next.js 16
- Runtime: Node.js 20 in deployment
- Language: TypeScript
- UI: React 19 + Tailwind CSS 4
- ORM: Prisma
- State: Zustand
- Auth: NextAuth-compatible auth flow utilities
- Testing: Vitest + Testing Library + jsdom

## Important Folders
- app/: App Router routes, layouts, pages, and API handlers.
- components/: shared UI and feature components.
- lib/: server/client utilities, env handling, API/auth/security helpers.
- prisma/: schema and seeding scripts.
- store/: client state stores.
- tests/: test suites.
- docs/: project setup and feature documentation.

## High-Signal Entry Files
- package.json: scripts and dependencies.
- README.md: setup and architecture overview.
- render.yaml: Render deployment definition.
- next.config.ts: Next.js behavior and optimization config.
- middleware.ts: middleware behavior for requests/auth/security.

## Common Commands
- Install deps: npm install
- Local dev: npm run dev
- Build: npm run build
- Start production server: npm run start
- Lint: npm run lint
- Tests (watch): npm run test
- Tests (CI): npm run test:run
- Coverage: npm run test:coverage
- Prisma generate: npm run prisma:generate
- DB push: npm run prisma:push
- Seed data: npm run prisma:seed
- Full DB setup: npm run db:setup

## Deployment Notes
Render config is defined in render.yaml:
- Build: npm ci && npx prisma generate && npm run build
- Start: npm start
- Region: frankfurt
- Runtime: node

Expected environment variables include:
- DATABASE_URL
- JWT_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- NEXT_PUBLIC_APP_URL

## Working Conventions For Future Agents
- Prefer minimal, targeted edits; avoid broad refactors unless requested.
- Keep App Router patterns intact in app/.
- Preserve TypeScript strictness and existing typing style.
- When changing API/payment/auth logic, check related helpers in lib/ first.
- When changing data models, update Prisma artifacts and verify affected routes/components.
- Run relevant validation after edits (build/tests for touched areas).

## Fast Onboarding Checklist For New Sessions
1. Read README.md for current project assumptions.
2. Read package.json scripts to pick correct validation commands.
3. Identify touched domain area:
   - UI/page routes in app/
   - shared UI in components/
   - server logic in app/api/ and lib/
   - data model in prisma/
4. Make minimal changes and validate with build/tests as needed.

## Current Identity
Repository folder: AuraCase
NPM package name: justcases
