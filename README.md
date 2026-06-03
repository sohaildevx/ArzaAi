# ArzaAI

<p align="center">
  <img src="public/images/Landing.png" alt="ArzaAI Landing Page" width="100%" />
</p>

## Problem Statement

Millions of Marathi-speaking people in Maharashtra depend on local revenue offices, police stations, consumer forums, and civil courts for everyday legal matters — land disputes, affidavits, complaints, RTI applications, and legal notices. Getting these documents typed correctly requires visiting a court typist, knowing the right legal language, and understanding the exact format each authority expects. This process is slow, expensive, and inaccessible for people in rural and semi-urban areas.

ArzaAI eliminates this friction. Describe your situation in plain Marathi or Hindi — or upload a handwritten document — and the platform generates a properly formatted, court-ready legal document tailored to the specific authority (Talathi, Tahsildar, Police, Court, Notary, etc.). No typist, no legal jargon, no repeated visits.

## Features

- **20+ document types** across 5 categories: land & revenue disputes, affidavits, complaints, RTI applications, and legal notices
- **8 authority-specific prompts** — Talathi, Mandal, Tahsildar, Police, Court, Notary, Consumer Forum, Women's Cell, RTI Officer
- **Credit-based billing** with Razorpay integration (webhook-verified, idempotent)
- **Full Marathi UI** — every label, error message, and placeholder in Marathi
- **Auth & session management** via better-auth
- **Document management** — create, view, delete saved documents
- **Landing page** with feature walkthrough, how-it-works, and pricing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | better-auth |
| AI | OpenAI (GPT-4o) |
| Payments | Razorpay |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Email | Resend |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g., Neon, Vercel Postgres)
- OpenAI API key
- Razorpay account (test or live)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
USER_EMAIL=ArzaAI <no-reply@yourdomain.com>

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
arzaai/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/       # Auth handlers (better-auth)
│   │   ├── generate/            # Document generation (OpenAI)
│   │   ├── documents/           # CRUD for saved documents
│   │   ├── credits/             # User credit balance
│   │   └── billing/razorpay/    # Razorpay order + webhook
│   ├── dashboard/               # Authenticated dashboard
│   ├── (auth)/sign-up/          # Auth screens
│   └── page.tsx                 # Landing page
├── components/
│   ├── landing/                 # Landing page sections
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts                  # better-auth config
│   ├── auth-client.ts           # Client-side auth helpers
│   ├── db.ts                    # Prisma client
│   ├── document-config.ts       # Categories, fields, authorities
│   └── utils.ts                 # Utilities
└── prisma/
    └── schema.prisma            # Database schema
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run lint` | Lint the codebase |

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run lint` to check for issues
5. Commit your changes (`git commit -m "Add your feature"`)
6. Push to the branch (`git push origin feature/your-feature`)
7. Open a Pull Request

Please keep PRs focused — one feature or fix per PR.

## License

This project is private. All rights reserved.
