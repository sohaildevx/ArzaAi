## ArzaAI

ArzaAI is a application that generates Marathi legal documents from user inputs. Users can sign up, generate documents, manage saved documents, and buy additional credits via Razorpay.

## Features

- Landing page with feature walkthrough and pricing
- Auth with email and password (better-auth + Prisma)
- Document generation API backed by OpenAI
- Saved documents list and detail views
- Credit system with Razorpay checkout and webhook fulfillment

## Tech Stack

- Next.js (App Router) + React
- TypeScript
- Prisma + PostgreSQL (Neon adapter)
- better-auth
- OpenAI SDK
- Tailwind CSS + shadcn/ui

## Routes

### App routes

- /: Landing page
- /sign-in, /sign-up: Auth screens
- /dashboard: User documents, credits, and actions
- /dashboard/documents/[id]: Document detail

### API routes

- /api/auth/*: Auth handlers
- /api/generate: Generate a document with OpenAI
- /api/documents: List or delete user documents
- /api/documents/[id]: Get a single document
- /api/billing/razorpay/order: Create Razorpay order
- /api/billing/razorpay/webhook: Razorpay webhook for credit fulfillment

## Setup

1) Install dependencies

```bash
npm install
```

2) Create a .env file

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
OPENAI_API_KEY=sk-...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
# Optional live keys (used as fallback)
RAZORPAY_LIVE_KEY=...
RAZORPAY_LIVE_SECRET=...
```

3) Run Prisma migrations

```bash
npx prisma migrate dev
```

4) Start the dev server

```bash
npm run dev
```

## Scripts

- npm run dev: Start development server
- npm run build: Build for production
- npm run start: Run production server
- npm run lint: Lint the codebase

## Notes

- Razorpay webhook must be publicly reachable and configured to send payment.captured events.
- Credits and document access are scoped to the authenticated user.
