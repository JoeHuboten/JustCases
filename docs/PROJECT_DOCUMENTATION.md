# JustCases Project Documentation

> Comprehensive technical and operational guide for the JustCases e-commerce application. This document is written for both non-technical operators and developers who need to understand, run, maintain, or extend the project.

---

## 1. Project Overview

JustCases is a modern e-commerce platform focused on premium mobile accessories. It combines a performant Next.js 15 (App Router) front end, PostgreSQL database, Prisma ORM, and a rich component library to deliver a PWA-ready shopping experience with accessibility, internationalisation, cart management, authentication, and payment integrations.

**Key capabilities**
- Dark-themed responsive UI optimised for mobile and desktop.
- Authentication and session handling using secure HTTP-only cookies and bcrypt-hashed passwords.
- Full product catalogue with categories, filters, wishlist, cart, checkout, and order management flows.
- Integrated Stripe payment intent API for card payments.
- Service Worker for offline support, asset caching, and background sync hooks.
- Accessibility and localisation tooling (Bulgarian and English, multiple currencies).
- Admin-first data model with Prisma to manage products, orders, discounts, messages, etc.

---

## 2. System Requirements & Prerequisites

| Requirement | Why it is needed |
|-------------|------------------|
| Windows 10/11, macOS 13+, or modern Linux | Supported development/host environments |
| Node.js 18 or higher | Next.js 15 and dependencies rely on Node 18 runtime |
| npm 9+ (bundled with Node) | Package manager used for scripts and dependencies |
| PostgreSQL 15+ | Primary relational database (local or containerised) |
| Docker 24+ *(optional)* | Simplifies consistent environment setup via docker-compose |
| Git *(optional)* | Recommended for version control |

> **Non-programmer note:** You only need Node.js and PostgreSQL (or Docker) to run the site locally. The rest of this document explains each step.

---

## 3. Technology Stack & Rationale

| Layer | Tool / Library | Why it is used |
|-------|----------------|----------------|
| Framework | **Next.js 15 (App Router)** | Server-side rendering, file-based routing, metadata API, image optimisation, PWA support, and modern React 19 features. |
| Language | **TypeScript** | Type safety and better developer tooling for React, Prisma, and Node APIs. |
| UI | **React 19** | Component-based rendering, Suspense, concurrent rendering. |
| Styling | **Tailwind CSS 4** | Utility-first styling with responsive variants and theming. |
| State | **Zustand** | Lightweight, scalable state management for cart and wishlist persistence. |
| Forms/UI | **Custom components + React Icons + GSAP** | Bespoke UI elements, iconography, and animations for a premium feel. |
| Auth | **bcryptjs + custom JWT utilities** | Secure password hashing and cookie-based authentication without relying on third-party providers. |
| ORM | **Prisma** | Type-safe database access, migrations, and schema modelling. |
| Database | **PostgreSQL** | Reliable relational storage with rich features for e-commerce data. |
| Payments | **Stripe (server + React bindings)** | Payment intent API for secure card payments and hosted widgets. |
| PWA | **Custom Service Worker + Workbox patterns** | Offline caching, push notifications, background sync placeholders. |
| i18n & Currency | **Custom LanguageContext** | Handles translations (BG/EN), currency formatting, and date localisation. |
| Tooling | **TypeScript, ESLint, tsx** | Static checking, linting, and modern TypeScript execution for scripts. |
| DevOps | **Docker, docker-compose** | Containerised app + database for local dev and repeatable deployments. |

---

## 4. Project Structure Walkthrough

```
JustCases/
├── app/                   # Next.js App Router pages & layouts
│   ├── layout.tsx         # Root layout with providers & metadata
│   ├── page.tsx           # Home page
│   ├── api/               # Route handlers (REST-like endpoints)
│   ├── auth/, cart/, ...  # Route segments for site pages
├── components/            # Reusable UI (Header, Footer, Cart, etc.)
├── contexts/              # React context providers (Auth, Language, Accessibility)
├── hooks/                 # Custom hooks (hydration, keyboard shortcuts)
├── lib/                   # Prisma client, auth utils, Stripe, service worker helpers
├── prisma/                # Prisma schema, migrations, seeds
├── public/                # Static assets & service worker
├── scripts/               # Node scripts (create admin, sample data)
├── store/                 # Zustand stores (cart, wishlist, search)
├── types/                 # Type augmentation (e.g. next-auth)
├── Dockerfile(.dev)       # Container definitions
├── docker-compose*.yml    # Docker orchestration (prod & dev)
├── package.json           # Dependencies and npm scripts
└── tsconfig.json          # TypeScript configuration
```

**Highlights**
- `app/layout.tsx` wires Inter font, metadata, Language/Accessibility/Auth providers, and PWA components.
- `app/api/**` contains authentication, cart, checkout, payments, admin management, and other REST endpoints using Next.js Route Handlers.
- `contexts/AccessibilityContext.tsx` powers the interactive accessibility panel with high contrast, font size, motion controls, keyboard navigation toggles, and screen reader optimisations.
- `lib/sw-register.ts` registers the custom service worker in the browser and manages update notifications and push subscriptions.
- `public/sw.js` caches HTML, assets, and API responses, handles offline page fallback, and stubs background sync for cart/wishlist.
- `prisma/schema.prisma` models the complete e-commerce data layer (users, accounts, sessions, categories, products, cart items, orders, reviews, discounts, contact messages, etc.).
- `prisma/seed.ts` creates 6 product categories and 36+ sample products, then seeds initial data for demos.
- `scripts/create-admin.js` creates the default admin account (`admin@justcases.com` / `admin123`).

---

## 5. Environment Variables

Create a `.env.local` file for local development (already present in repo). Update values as needed.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (e.g. `postgresql://justcases_user:justcases123@localhost:5432/justcases`). |
| `JWT_SECRET` | ✅ | Secret for signing auth tokens (generate via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (if Stripe used) | Client-side Stripe publishable key. |
| `STRIPE_SECRET_KEY` | (if Stripe used) | Server-side Stripe secret key. Required by `/api/payment/create-intent`. |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | optional | Public VAPID key for push notifications (service worker). |

> **Note:** Docker compose files set defaults for `DATABASE_URL`, `JWT_SECRET`, and `NEXTAUTH_URL`. Update them for production deployments.

---

## 6. Setup & Execution Guides

### 6.1 For Non-Programmers (Windows, macOS, Linux)

#### Option A – Docker (most hands-off)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and ensure it is running.
2. Open the JustCases project folder.
3. Windows: double-click `setup-docker.bat`. macOS/Linux: run
   ```bash
   chmod +x setup-docker.sh
   ./setup-docker.sh
   ```
   The script will:
   - Build the Docker image.
   - Start PostgreSQL and the application.
   - Run Prisma migrations and seed data.
4. Wait until the console prints **“Application running at http://localhost:3000”**.
5. Open a browser and visit `http://localhost:3000`.
6. Sign in with the default admin account (`admin@justcases.com` / `admin123`).

#### Option B – Guided script (no Docker)

1. Install [Node.js 18+](https://nodejs.org/) and [PostgreSQL 15+](https://www.postgresql.org/download/).
2. Windows: run `setup.bat`. macOS/Linux: run
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   Script actions:
   - Install npm dependencies.
   - Generate Prisma client.
   - Push schema to database.
   - Seed sample products.
   - Print success instructions.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in the browser.

#### Option C – Manual one-time setup (step-by-step)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   - Copy `env.example` to `.env.local`.
   - Set `DATABASE_URL`, `JWT_SECRET`, and Stripe keys if needed.
3. **Prepare PostgreSQL**
   - Create database: `justcases`.
   - Create user: `justcases_user` / `justcases123`.
   - Grant privileges and set schema owner (see Section 7.2).
   - Seed default admin: `node scripts/create-admin.js` (after migrations).
4. **Run Prisma migrations & seeds**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```
5. **Launch development server**
   ```bash
   npm run dev
   ```
6. **Production build (optional)**
   ```bash
   npm run build
   npm run start
   ```

> If PostgreSQL is not installed, use the provided PowerShell scripts (`setup-local-postgres.bat`, `setup-database.ps1`) or Docker.

---

### 6.2 Everyday Commands for Operators

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Stop dev server | Press `Ctrl + C` in the terminal running `npm run dev`. |
| Reset database & reseed | `npm run prisma:seed` (after `npx prisma db push`). |
| Open visual DB explorer | `npx prisma studio` (opens in browser). |
| Create admin user again | `node scripts/create-admin.js` |
| Build for production | `npm run build` |
| Start production server | `npm run start` |

---

## 7. Database Management

### 7.1 Prisma Data Model Summary

| Model | Purpose |
|-------|---------|
| `User`, `Account`, `Session`, `VerificationToken` | Authentication, role management, and OAuth compatibility. |
| `Category`, `Product` | Catalogue structure and product metadata (pricing, colors, sizes, specifications). |
| `CartItem`, `WishlistItem` | Persisted cart and wishlist entries per user. |
| `Order`, `OrderItem` | Checkout outcomes, payment status, fulfilment tracking. |
| `Address`, `PaymentMethod` | Saved user addresses and payment info references. |
| `Review` | Customer reviews with ratings and helpful counts. |
| `DiscountCode` | Promotional codes with usage limits. |
| `ContactMessage` | Messages submitted via contact form. |

### 7.2 Creating the Database Manually (psql)

```powershell
$env:PGPASSWORD = '<postgres_password>'
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres justcases
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'justcases_user') THEN CREATE USER justcases_user WITH PASSWORD 'justcases123'; ELSE ALTER USER justcases_user WITH PASSWORD 'justcases123'; END IF; END $$;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE justcases TO justcases_user;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d justcases -c "ALTER SCHEMA public OWNER TO justcases_user;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d justcases -c "GRANT ALL ON SCHEMA public TO justcases_user;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d justcases -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO justcases_user;"
Remove-Item Env:\PGPASSWORD
```

### 7.3 Seeding & Admin Account

- Seed products/categories: `npm run prisma:seed`.
- Create admin login: `node scripts/create-admin.js`.
- Admin credentials: `admin@justcases.com` / `admin123`.

---

## 8. Application Features & Architecture

### 8.1 Authentication Flow
- Browser form posts to `/api/auth/signin`.
- Route handler fetches user by email (`prisma.user.findUnique`).
- Password verified with bcrypt (`verifyPassword`).
- Success sets signed JWT (`auth-token`) as HTTP-only cookie (24h or 7 days).
- `AuthContext` fetches `/api/auth/me` on load to hydrate client state.
- Protected API routes wrap handlers with `requireAuth` / `requireAdmin`.

### 8.2 Cart & Wishlist
- `store/cartStore.ts` (Zustand + persistence) stores items in localStorage and syncs with API for validation.
- Discount codes validated via `/api/discount/validate` (not shown here but part of API directory).
- Wishlist uses similar store + `WishlistItem` records.

### 8.3 Checkout & Payments
- Checkout page loads Stripe publishable key (client) and collects payment details.
- API route `/api/payment/create-intent` calculates totals and creates Stripe payment intents on behalf of authenticated user.

### 8.4 Product Catalogue & Search
- `lib/database.ts` exposes product/category query helpers for SSR/ISR.
- `components/AdvancedSearch.tsx` and `hooks/useKeyboardShortcuts.ts` provide multi-criteria filtering and keyboard navigation (Ctrl+K, etc.).

### 8.5 PWA & Offline Support
- `ServiceWorkerRegistration` registers `public/sw.js` which:
  - Caches static assets and API responses.
  - Provides offline fallback to `/offline` page.
  - Stubs background sync for cart/wishlist (ready for IndexedDB integration).
  - Handles push notifications with actions.
- Update notifications prompt the user when a new service worker installs.

### 8.6 Accessibility & Internationalisation
- `AccessibilityContext` toggles high contrast, font scaling, reduced motion, screen reader and keyboard navigation improvements.
- `AccessibilityPanel` UI exposes settings, shortcuts, and Bulgarian/English labels.
- `LanguageContext` manages translations, currency (BGN/USD/EUR), and formatted dates/prices.
- `KeyboardShortcuts` component displays available shortcuts.

### 8.7 Admin Functions
- Admin layout under `app/admin/**` (analytics, products, orders, settings, etc.) loads after authentication. (Pages may be initial scaffolding but ready for expansion.)
- Discount, message, user management API routes live under `app/api/admin/**`.

### 8.8 Additional Integrations
- `components/PerformanceMonitor` surfaces runtime metrics (Hydration, FPS, network) in development.
- `components/OptimizedImage` wraps Next.js Image with fallbacks.
- `lib/stripe-client.ts` loads Stripe in the browser when keys are configured.

---

## 9. API Route Catalogue (selected)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/signin` | POST | Authenticate user, set auth cookie. |
| `/api/auth/signup` | POST | Register new user, auto-login. |
| `/api/auth/signout` | POST | Clear auth cookie. |
| `/api/auth/me` | GET | Return current user from cookie. |
| `/api/products` | GET | List products with optional filters. |
| `/api/categories` | GET | List product categories. |
| `/api/cart` | GET/POST | Retrieve or update cart items. |
| `/api/wishlist` | GET/POST | Retrieve or update wishlist. |
| `/api/payment/create-intent` | POST | Generate Stripe payment intent (auth required). |
| `/api/contact` | POST | Store contact form messages. |
| `/api/admin/**` | Various | Admin-only CRUD operations. |

(See `app/api/` directory for the complete set.)

---

## 10. Front-End Components & Contexts

### Core Components
- `Header`, `Footer`, `HomePage`, `ProductCard`, `ProductDetails`, `ProductReviews`, `StripePaymentMethods`, `MagicBentoCategory` (highlight categories with animations), `ScrollAnimation` (GSAP-based), `LanguageSwitcher`, `AccessibilityPanel`, `PerformanceMonitor`.

### Context Providers
- `AuthContext`—user state, sign-in/out, admin checks.
- `LanguageContext`—translations, currency formatting, date localisation.
- `AccessibilityContext`—visual/auditory preferences.

### Hooks
- `useHydration`—prevents hydration mismatch for client-only components.
- `useKeyboardShortcuts`—registers global shortcuts for search/accessibility.

---

## 11. Styling & Design System

- Tailwind 4 configuration (`tailwind.config.ts`) scans `app`, `components`, and `pages` directories.
- Colour tokens: `bg-background`, `bg-primary/secondary`, `text-text-secondary`, etc., defined in `app/globals.css`.
- Consistent spacing, typography managed via Tailwind and Inter font.
- Dark theme emphasised with accent gradients and lighting effects (GSAP used in hero sections).

---

## 12. Running in Production / Deployment

### 12.1 Dockerised Production (Recommended)
```bash
docker-compose up --build -d
```
- Builds Next.js production image.
- Waits for PostgreSQL, runs `prisma db push` and `prisma db seed`.
- Serves app on `http://localhost:3000` (map ports as needed).

### 12.2 Node-only Production
```bash
npm install --production
npm run build
npm run start
```
Provide environment variables (`DATABASE_URL`, `JWT_SECRET`, Stripe keys) via `.env` or hosting platform secrets.

---

## 13. Maintenance & Best Practices

1. **Dependency updates**
   - Use `npm outdated` to check.
   - Update carefully; run `npm run lint` and `npm run build` afterwards.
2. **Database migrations**
   - Use Prisma migrations for schema changes (`npx prisma migrate dev`).
   - Update seed data to align with new schema.
3. **Security**
   - Always change default passwords and JWT secrets in production.
   - Enforce HTTPS and secure cookies when deploying.
   - Rotate Stripe keys and database credentials periodically.
4. **Performance**
   - Leverage Next.js Image optimisation by ensuring allowed domains are configured (`next.config.ts`).
   - Monitor service worker caches to refresh stale assets.
5. **Testing (future work)**
   - Add unit/integration tests using Jest/React Testing Library or Playwright.
   - Configure linting rules in `.eslintrc.json` to enforce code quality.

---

## 14. Additional Reference Material

- `README.md` – quick start summary (original project readme).
- `DOCKER_SETUP.md`, `SETUP.md`, `DEPLOYMENT.md` *(if present)* – targeted guides referenced in README.
- `JUSTCASES_TECHNICAL_DOCUMENTATION.txt` *(if provided in repo)* – legacy docs, cross-check details.
- Prisma docs: https://www.prisma.io/docs
- Next.js App Router docs: https://nextjs.org/docs/app
- Stripe integration docs: https://stripe.com/docs/payments

---

## 15. Troubleshooting Cheat-Sheet

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `401 Unauthorized` on sign-in | Admin account missing or wrong password | Run `node scripts/create-admin.js`; use `admin@justcases.com` / `admin123`. |
| `DATABASE_URL` missing | `.env.local` not configured | Copy `env.example` and set the correct Postgres URL. |
| `Prisma P1000` auth error | Wrong DB credentials | Reset PostgreSQL user password or update `.env.local`. |
| Docker app cannot connect to DB | Container order or credentials mismatch | Ensure docker-compose `.env` matches DB credentials; run `docker-compose down -v && docker-compose up --build`. |
| Images not loading | Remote domain not whitelisted | Add domain to `next.config.ts > images.remotePatterns`. |
| Stripe errors | Keys missing or invalid | Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`. |
| Service worker update loop | Cache names mismatch on deploy | Increment `CACHE_NAME` constants after asset changes. |

---

## 16. Glossary

- **App Router** – Next.js routing paradigm using nested folders and layouts.
- **Prisma Client** – Type-safe database client generated from `schema.prisma`.
- **JWT** – JSON Web Token used to encode auth claims for cookies.
- **PWA** – Progressive Web App; offline-capable web app with install prompt.
- **Zustand** – Minimal state management library for React.
- **Stripe Payment Intent** – Server-confirmed payment flow that handles authentication and capture.

---

## 17. Change Log Template (for future updates)

```
### [Unreleased]
- Summary of new features
- Database schema changes
- API modifications
- Deployment adjustments
```

Use this template to maintain transparency as the project evolves.

---

## 18. Contact & Ownership

- **Product Owner:** JustCases Team
- **Primary Repository:** `c:\Users\Nikolay\Desktop\JustCases`
- **Support Email:** `support@justcases.bg`

Maintain this document alongside code changes to ensure new contributors and non-technical stakeholders always have an up-to-date, single source of truth.
