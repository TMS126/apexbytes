# ApexbytesHub

ApexbytesHub is a local technology, printing, design, document, and e-service business based in Kgotsong, Bothaville. The website presents five service hubs, a portfolio, pricing information, customer FAQs, contact paths, and browser-based document tools.

## Technology

The site is built with Next.js 16, React 19, TypeScript, Tailwind CSS, and pnpm. It uses server-rendered pages where appropriate, client components for interactive UI, and Vercel-compatible deployment configuration.

## Requirements

Use Node.js 22.13.0 or a compatible Node 22 release and pnpm 11.21.0. Install dependencies with:

```bash
pnpm install --frozen-lockfile
```

## Local development

Start the development server with:

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Quality checks

The repository includes the following checks:

```bash
pnpm lint       # ESLint
pnpm typecheck  # TypeScript, without emitting files
pnpm test       # Vitest unit tests
pnpm build      # Production Next.js build
```

These checks run automatically for pushes to `main` and pull requests targeting `main` through the GitHub Actions quality gate.

## Environment configuration

Copy `.env.example` to `.env.local` and fill in only the values required for the features you are enabling. Server-only credentials must remain in the hosting provider’s encrypted environment settings and must never be exposed through `NEXT_PUBLIC_*` variables or committed to Git.

Uploads are intentionally disabled by default. Enable them only after Cloudinary authenticated delivery, durable retention, Redis rate limiting, Turnstile verification, and the administrative controls are configured.

## Project layout

- `app/` contains routes, layouts, metadata, API routes, and browser tools.
- `components/` contains reusable interface sections and interactive widgets.
- `lib/` contains business data, brand tokens, validation, security helpers, and shared utilities.
- `public/` contains optimized site imagery, icons, and customer-facing documents.
- `.github/workflows/` contains the automated quality and brand-governance checks.

## Deployment

The project is configured for deployment on Vercel. Set the production environment variables in the Vercel project before enabling server-side integrations. Confirm that `NEXT_PUBLIC_SITE_URL` matches the canonical public domain so metadata, sitemap, and Open Graph URLs are correct.

## Content and contact

Business information and service content are maintained in the shared data and brand modules under `lib/`. Customer enquiries are routed to WhatsApp and the published business email address. Update those values in the relevant source modules when business details change.

## License and ownership

This repository contains the ApexbytesHub website and its original business content. It is private application code and is not intended as a general-purpose starter template.
