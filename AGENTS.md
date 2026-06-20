# CortexPrism Web — Project Rules & Conventions

## Project Overview

CortexPrism Web is the official website and marketplace for [CortexPrism](https://cortexprism.io), an open-source AI Agent Operating System for building, deploying, and managing AI agents. The site serves as a marketing site, documentation portal (42+ MDX pages), plugin/agent marketplace with REST API, admin panel, and user system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, `output: "standalone"`) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 + `@tailwindcss/typography` |
| UI | Radix UI primitives, Lucide icons, CVA |
| Database | SQLite via Prisma 5 ORM |
| Auth | JWT (`jsonwebtoken`) + bcryptjs |
| Content | MDX via react-markdown + remark-gfm |
| Search | Fuse.js (client-side) |
| API Docs | Swagger UI (swagger-ui-react) + OpenAPI 3.1 spec |
| Charts | Recharts |
| Data Fetching | SWR |
| Validation | Zod |
| Deployment | Docker (multi-stage) / systemd + nginx |

## Architecture

### App Router Structure

Pages use the App Router at `src/app/` with route groups for related sections:

```
src/app/
├── about/                # About CortexPrism
├── admin/                # Admin panel (submissions, users, roles, GitHub, settings, email, audit, activity)
├── api/                  # REST API routes (40+ route files)
├── changelog/            # Release history
├── contribute/           # Contributing guide
├── dashboard/            # User dashboard, settings, notifications
├── docs/                 # Documentation (MDX content from /content/)
├── features/             # Detailed feature breakdown
├── fonts/                # Font files
├── getting-started/      # Quickstart, installation, first run, configuration
├── install/              # Installation instructions
├── login/                # Email + Discord OAuth login
├── marketplace/          # Plugin/agent listings, detail, publish
├── openapi/              # Swagger UI
├── profile/              # Public user profiles
├── register/             # User registration
├── security/             # Security overview and disclosure
├── use-cases/            # Use case examples
├── globals.css           # Global styles, dark theme
├── layout.tsx            # Root layout (Navbar, Footer, AuthProvider)
├── not-found.tsx         # Custom 404
├── page.tsx              # Landing page
├── robots.ts             # Robots.txt
└── sitemap.ts            # Sitemap.xml
```

### Component Structure

Components live in `src/components/` organized by domain:
- `layout/` — Navbar, Footer, Sidebar
- `landing/` — Hero, FeatureGrid, StatsBar, CtaSection
- `docs/` — MdxContent, TableOfContents, DocSearch, CodeBlock
- `marketplace/` — PluginCard, AgentCard, detail/detail views, InstallCommand, PublishForm, search/filter
- `notifications/` — NotificationBell (navbar indicator)
- `profile/` — ProfileActions (client component for edit link)
- `seo/` — StructuredData (JSON-LD)
- `shared/` — Badge, Button, Card, Pagination, StarRating, DownloadCount

### Data Fetching

- **Server components**: Direct Prisma calls (no API route needed for SSR)
- **Client components**: SWR hooks to `/api/` endpoints
- **Marketplace pages**: `force-dynamic` export

### Database (Prisma + SQLite)

18 models: User, Role, Permission, RolePermission, Plugin, AgentConfig, Category, SubmissionReview, UserRating, Screenshot, PluginVersion, AgentVersion, AuditLog, GitHubConnection, GitHubTopicScan, DiscoveredRepo, Setting, Notification.

The database file lives at `prisma/marketplace.db` and is shared between the web app and Discord bot.

## Coding Conventions

- **Imports**: Use `@/` path alias (e.g., `@/components/shared/Button`, `@/lib/prisma`)
- **Components**: Default exports for pages, named exports for shared components
- **Server vs Client**: Default to server components; add `"use client"` only when needed
- **Auth middleware**: Use `src/middleware.ts` for CORS, `src/lib/auth.ts` for JWT, `src/lib/auth-middleware.ts` for permissions
- **API routes**: Follow pattern `src/app/api/{resource}/route.ts` with named exports for each HTTP method
- **Tailwind**: Use theme tokens from `tailwind.config.ts` (surface, accent, text, border colors); always use the dark class on `<html>`
- **Zod**: Validate all API inputs with Zod schemas

## Key Commands

```bash
npm run dev          # Start dev server on :3000
npm run build        # Full production build (next build + standalone copy)
npm run start        # Start production server
npm run lint         # Next.js ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to SQLite
npm run db:studio    # Open Prisma Studio

npm run discord:dev       # Start Discord bot in dev mode
npm run discord:deploy    # Deploy Discord slash commands
npm run discord:install   # Install Discord bot dependencies
```

## Environment

Copy `.env.example` to `.env` with:
- `DATABASE_URL="file:./marketplace.db"` — SQLite path
- `JWT_SECRET=<random-hex>` — Auth token signing
- `NEXT_PUBLIC_SITE_URL` — Canonical URL
- `NEXT_PUBLIC_GITHUB_REPO` — GitHub repo for stats
- Optional: `GITHUB_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `DISCORD_WEBHOOK_URL`
- Optional: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME` — SendGrid email sending
- Optional: `EMAIL_VERIFICATION_SECRET` — Email verification token signing

## Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema (14 models) |
| `src/lib/auth.ts` | JWT + bcrypt auth helpers |
| `src/lib/auth-middleware.ts` | Role/permission checking |
| `src/lib/AuthContext.tsx` | React auth context provider |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/openapi-spec.ts` | OpenAPI 3.1 spec for Swagger UI |
| `src/lib/markdown.ts` | MDX processing helpers |
| `src/lib/seo.ts` | SEO utilities (metabase, schemas) |
| `src/lib/utils.ts` | Shared utilities (cn, formatNumber) |
| `src/lib/github.ts` | GitHub API helpers (metadata, README, file fetching) |
| `src/lib/github-import.ts` | Repo import logic |
| `src/lib/github-topic-scanner.ts` | Topic scanning |
| `src/lib/discord-webhook.ts` | Discord submission notifications |
| `src/lib/audit.ts` | Admin audit logging |
| `src/lib/settings.ts` | Runtime settings |
| `src/lib/email.ts` | SendGrid email sending (welcome emails, alerts) |
| `src/lib/notifications.ts` | In-app notification creation helpers |
| `src/lib/submissions.ts` | Submission approval/rejection notifications |
| `src/middleware.ts` | CORS middleware |
| `content/` | 42+ MDX documentation files |
| `discord-bot/` | Standalone Discord bot service |
| `docker-compose.yml` | Docker Compose (web + nginx) |

## Marketplace Conventions

- **Plugin kinds**: `esm`, `mcp`, `wasm` (each has distinct color/badge)
- **Plugin statuses**: `pending`, `approved`, `rejected`
- **Plugin import**: Via `POST /api/admin/github/import` from GitHub repos
- **Category ID**: `cm0` prefix pattern (e.g., `cm0abc123def456`)
- **Slug pattern**: Kebab-case, unique per resource
