# CortexPrism Website — Implementation Plan

## Vision

A server-rendered Next.js website at `/root/cortex-web/` that serves as the **public face** of the CortexPrism project. It is a marketing + documentation + knowledge-base site with a **fully functional plugin and agent marketplace** backed by a REST API with OpenAPI/Swagger documentation. External Cortex instances can connect to this registry to discover and download plugins and agent configurations.

---

## Architecture

```
Browser
  │
  ├── Next.js SSR (pages)        → Marketing / Docs / Marketplace UI
  ├── /api/marketplace/* (REST)  → Marketplace registry API
  ├── /api/docs (Swagger UI)     → OpenAPI documentation
  │
  └── External Cortex instances → GET /api/marketplace/plugins
                                   GET /api/marketplace/agents
                                   (Download manifests/configs)
```

The website is a standalone Next.js app. It does not replace the Cortex backend — it runs alongside it. The marketplace is its own service with its own data store (SQLite or PostgreSQL).

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR, API routes, static export option |
| Language | TypeScript | Type safety across the project |
| Styling | Tailwind CSS v3 | Utility-first, rapid iteration |
| UI Components | shadcn/ui (Radix-based) | Accessible, composable, dark-theme friendly |
| Icons | Lucide React | Consistent, MIT-licensed icon set |
| Content | MDX (next-mdx-remote) | Docs and knowledge base written in Markdown |
| Syntax Highlighting | rehype-pretty-code | Code blocks in docs |
| Database | SQLite (better-sqlite3) via Prisma ORM | Simple, file-based, no infrastructure |
| API Docs | swagger-ui-react + OpenAPI 3.1 spec | Interactive API documentation |
| Search | Fuse.js (client-side) | Lightweight full-text search for docs/knowledge base |
| Charts | Recharts | Usage stats on marketplace items |
| Deployment | Docker or standalone Next.js server | Matches server-rendered requirement |

---

## Site Structure

```
/root/cortex-web/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── prisma/
│   ├── schema.prisma          # Marketplace DB schema
│   └── seed.ts                # Seed data (sample plugins/agents)
├── content/
│   ├── getting-started/
│   │   ├── index.mdx          # Quickstart overview
│   │   ├── installation.mdx
│   │   ├── first-run.mdx
│   │   └── configuration.mdx
│   ├── cli/
│   │   ├── index.mdx          # CLI overview
│   │   ├── chat.mdx
│   │   ├── serve.mdx
│   │   ├── daemon.mdx
│   │   ├── run.mdx
│   │   ├── memory.mdx
│   │   ├── reflect.mdx
│   │   ├── vault.mdx
│   │   ├── policy.mdx
│   │   ├── jobs.mdx
│   │   ├── sessions.mdx
│   │   └── setup.mdx
│   ├── architecture/
│   │   ├── index.mdx          # Architecture overview
│   │   ├── agent-loop.mdx
│   │   ├── memory-system.mdx
│   │   ├── security-parallax.mdx
│   │   ├── model-router.mdx
│   │   ├── daemon-supervisor.mdx
│   │   ├── plugin-system.mdx
│   │   └── databases.mdx
│   ├── knowledge-base/
│   │   ├── index.mdx          # KB overview
│   │   ├── faq.mdx
│   │   ├── troubleshooting.mdx
│   │   ├── best-practices.mdx
│   │   ├── provider-guide.mdx
│   │   └── sandbox-guide.mdx
│   ├── design-docs/
│   │   ├── index.mdx          # Design docs index
│   │   └── (ref links to GitHub for full specs)
│   └── changelog/
│       └── index.mdx          # Releases (manually maintained or from CHANGELOG.md)
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-diagram.svg   # Architecture diagram for hero
│   │   ├── memory-diagram.svg
│   │   ├── security-diagram.svg
│   │   └── screenshots/
│   │       ├── chat-ui.png
│   │       ├── lens-timeline.png
│   │       └── dashboard.png
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Nav + Footer)
│   │   ├── page.tsx            # Landing / Hero page
│   │   ├── features/
│   │   │   └── page.tsx        # Features overview
│   │   ├── getting-started/
│   │   │   └── [[...slug]]/page.tsx  # MDX content pages
│   │   ├── docs/
│   │   │   └── [[...slug]]/page.tsx  # CLI ref + architecture + KB + design docs
│   │   ├── changelog/
│   │   │   └── page.tsx
│   │   ├── marketplace/
│   │   │   ├── page.tsx        # Marketplace landing (plugins + agents)
│   │   │   ├── plugins/
│   │   │   │   ├── page.tsx    # Plugin listing
│   │   │   │   └── [id]/page.tsx  # Plugin detail
│   │   │   ├── agents/
│   │   │   │   ├── page.tsx    # Agent listing
│   │   │   │   └── [id]/page.tsx  # Agent detail
│   │   │   └── publish/
│   │   │       ├── plugin/page.tsx  # Submit a plugin
│   │   │       └── agent/page.tsx   # Submit an agent
│   │   ├── api/
│   │   │   ├── marketplace/
│   │   │   │   ├── plugins/
│   │   │   │   │   ├── route.ts     # GET (list) / POST (publish)
│   │   │   │   │   └── [id]/route.ts # GET / PUT / DELETE
│   │   │   │   ├── agents/
│   │   │   │   │   ├── route.ts     # GET (list) / POST (publish)
│   │   │   │   │   └── [id]/route.ts # GET / PUT / DELETE
│   │   │   │   ├── categories/route.ts  # Category listing
│   │   │   │   └── stats/route.ts       # Marketplace stats
│   │   │   └── docs/
│   │   │       └── openapi.json/route.ts # Serve OpenAPI spec
│   │   ├── openapi/
│   │   │   └── page.tsx        # Swagger UI page
│   │   └── contribute/
│   │       └── page.tsx        # Contributing guide + GitHub link
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Top navigation bar
│   │   │   ├── Footer.tsx      # Site footer
│   │   │   ├── Sidebar.tsx     # Docs sidebar (table of contents)
│   │   │   └── MobileNav.tsx   # Mobile hamburger menu
│   │   ├── landing/
│   │   │   ├── Hero.tsx        # Hero section with animated diagram
│   │   │   ├── FeatureGrid.tsx # Feature cards grid
│   │   │   ├── ArchitectureDiagram.tsx  # Interactive architecture SVG
│   │   │   ├── StatsBar.tsx    # GitHub stars, downloads, etc.
│   │   │   └── CtaSection.tsx  # Call-to-action (get started)
│   │   ├── docs/
│   │   │   ├── MdxContent.tsx  # Renders MDX content
│   │   │   ├── CodeBlock.tsx   # Syntax-highlighted code
│   │   │   ├── TableOfContents.tsx # Auto-generated TOC
│   │   │   └── DocSearch.tsx   # Full-text search across docs
│   │   ├── marketplace/
│   │   │   ├── PluginCard.tsx  # Plugin listing card
│   │   │   ├── AgentCard.tsx   # Agent listing card
│   │   │   ├── PluginDetail.tsx # Full plugin view
│   │   │   ├── AgentDetail.tsx  # Full agent view
│   │   │   ├── InstallCommand.tsx # Copyable install command
│   │   │   ├── CategoryFilter.tsx  # Filter by category
│   │   │   ├── SearchBar.tsx    # Search marketplace
│   │   │   └── PublishForm.tsx  # Submit plugin/agent form
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── StarRating.tsx
│   │       ├── DownloadCount.tsx
│   │       └── SearchInput.tsx
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       ├── openapi.ts          # OpenAPI spec generator/builder
│       ├── markdown.ts         # MDX processing helpers
│       └── utils.ts            # Shared utilities
└── docker-compose.yml          # Deployment config
```

---

## Data Model (Marketplace)

```prisma
model Plugin {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique
  version       String
  description   String
  kind          String   // "esm" | "mcp" | "wasm"
  entryPoint    String
  capabilities  String   // JSON array
  author        String?
  authorUrl     String?
  homepage      String?
  repository    String?
  license       String?
  icon          String?  // URL
  readme        String?  // Markdown content
  downloads     Int      @default(0)
  rating        Float    @default(0)
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model AgentConfig {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique
  version       String
  description   String
  provider      String?  // Default provider
  model         String?  // Default model
  temperature   Float?
  tools         String?  // JSON array of allowed tools
  tags          String?  // JSON array
  systemPrompt  String?
  soulContent   String?
  author        String?
  authorUrl     String?
  repository    String?
  icon          String?  // URL
  readme        String?  // Markdown content
  downloads     Int      @default(0)
  rating        Float    @default(0)
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  published     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Category {
  id      String   @id @default(cuid())
  name    String   @unique
  slug    String   @unique
  plugins Plugin[]
  agents  AgentConfig[]
}
```

---

## API Endpoints (Marketplace Registry)

External Cortex instances connect to these endpoints to discover and download plugins/agents.

### Plugins

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/marketplace/plugins` | List plugins (query: `?category=&search=&kind=&page=&limit=`) |
| `GET` | `/api/marketplace/plugins/:id` | Get plugin detail with manifest |
| `POST` | `/api/marketplace/plugins` | Publish a new plugin |
| `PUT` | `/api/marketplace/plugins/:id` | Update a plugin |
| `DELETE` | `/api/marketplace/plugins/:id` | Remove a plugin |
| `GET` | `/api/marketplace/plugins/:id/download` | Increment download counter, return manifest |

### Agents

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/marketplace/agents` | List agent configs |
| `GET` | `/api/marketplace/agents/:id` | Get agent detail with config |
| `POST` | `/api/marketplace/agents` | Publish a new agent |
| `PUT` | `/api/marketplace/agents/:id` | Update an agent |
| `DELETE` | `/api/marketplace/agents/:id` | Remove an agent |
| `GET` | `/api/marketplace/agents/:id/download` | Increment download counter, return config |

### General

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/marketplace/categories` | List all categories |
| `GET` | `/api/marketplace/stats` | Get marketplace stats (total plugins, agents, downloads) |

### OpenAPI Documentation

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/docs/openapi.json` | OpenAPI 3.1 spec as JSON |
| `GET` | `/openapi` | Swagger UI page |

The OpenAPI spec is auto-generated from route handlers or maintained as a static spec file at `src/lib/openapi-spec.ts`.

### Cortex Integration (`cortex plugin install`)

External Cortex instances would install from the marketplace:
```bash
cortex plugin install marketplace:cortexprism.io/plugins/:id
```

Or equivalently via API:
```
GET https://cortexprism.io/api/marketplace/plugins/:id/download
→ Returns PluginManifest JSON → cortex writes to its plugins.db
```

---

## Appearance & Branding

### Color Palette (Dark Theme)
- **Background**: `#0a0a0f` (matches existing Cortex UI)
- **Surface**: `#111118` / `#18181f`
- **Border**: `rgba(255,255,255,0.07)`
- **Accent**: `#6366f1` (Indigo-500)
- **Accent Light**: `#818cf8` (Indigo-400)
- **Text**: `#e2e2ea` / `#9090a8` / `#55556a`
- **Success**: `#22c55e`
- **Warning**: `#fbbf24`
- **Error**: `#f87171`

### Logo
- Use the existing Cortex ✦ icon (gradient indigo-to-purple `#6366f1` → `#8b5cf6`)
- Logo text: "CortexPrism" in bold, or just "Cortex" for the main wordmark

### Typography
- Headings: Inter (sans-serif)
- Code: JetBrains Mono (monospace)
- Body: Inter, system-ui fallback

---

## Pages Detail

### 1. Landing Page (`/`)
- **Hero section**: "Open-source agentic harness system" — tagline, animated architecture diagram, CTA buttons ("Get Started", "View on GitHub")
- **Stats bar**: GitHub stars, contributors, plugins available, sessions run (fetched from API)
- **Feature grid**: 6-8 feature cards (Chat, Tool Use, Memory, Security, Scheduling, Code Sandbox, Model Router, Plugin System)
- **Architecture preview**: Simplified system diagram
- **Interactive demo**: CLI command examples with live-preview terminal
- **CTA section**: "Ready to build?" → links to Getting Started
- **Footer**: Links to GitHub, License (MIT), Docs, Marketplace

### 2. Features Page (`/features`)
- Full breakdown of each feature category:
  - Interactive Chat (12 LLM providers)
  - Tool Use & Approval Gates
  - 5-Tier Memory System
  - Parallax Security Model
  - Sandboxed Code Execution
  - Model Router (RouteLLM)
  - Daemon Supervisor
  - Scheduled Jobs
  - Web UI & REST API
  - Plugin System
  - Agent Manager
  - Micro-Services
- Each feature has: description, key benefits, and CLI/API examples

### 3. Getting Started (`/getting-started/**`)
- MDX-based documentation:
  - **Quickstart**: Install Deno, clone repo, `deno task chat`
  - **Installation**: Detailed setup, Docker, prerequisites
  - **First Run**: Setup wizard, provider configuration
  - **Configuration**: Config file reference, environment variables, data directory

### 4. Docs (`/docs/**`)
- **CLI Reference**: Full command documentation for every `cortex` subcommand with examples
- **Architecture**: In-depth architecture docs drawn from `docs/ARCHITECTURE.md` + `docs/design/DESIGN.md`
- **Knowledge Base**: FAQ, troubleshooting, best practices, provider setup guides, sandbox guides
- **Design Docs Index**: Links to the 40+ design specs in the GitHub repo with summaries

### 5. Marketplace (`/marketplace`)
- **Landing page**: Overview of available plugins and agents with search bar
- **Plugin listing**: Grid of plugin cards — filterable by category, kind (ESM/MCP/WASM), searchable
- **Plugin detail**: Full page with description, install command, version history, readme, download button
- **Agent listing**: Grid of agent config cards — filterable by provider, tags
- **Agent detail**: Full config view, install command, system prompt preview
- **Publish form**: Web form to submit a plugin or agent for listing
- **Swagger UI** at `/openapi`: Interactive API docs for the marketplace registry

### 6. Changelog (`/changelog`)
- Release history parsed from `CHANGELOG.md` or maintained as MDX
- Each entry: version, date, feature/bugfix/breaking list

### 7. Contribute (`/contribute`)
- Guide for contributors: how to report issues, submit PRs, develop plugins
- Links to `CONTRIBUTING.md`, GitHub repo, Discord (future)

---

## Implementation Phases

### Phase 1: Project Scaffold (Days 1-2)
1. Initialize Next.js 14 with TypeScript + Tailwind
2. Set up project structure (directories, configs)
3. Install dependencies (Prisma, swagger-ui-react, lucide, shadcn/ui)
4. Configure Prisma with SQLite and create schema
5. Create base layout (Navbar, Footer, dark theme)
6. Set up MDX processing pipeline
7. Create `src/lib/openapi.ts` with OpenAPI 3.1 spec definition
8. Seed database with sample plugins and agent configs

### Phase 2: Landing + Marketing Pages (Days 3-4)
1. Hero section with architecture diagram and CTA
2. Feature grid component
3. Stats bar (hardcoded or from GitHub API)
4. Architecture preview diagram
5. Features page with full breakdown
6. Contribute page
7. Changelog page (parse from CHANGELOG.md or manual MDX)

### Phase 3: Documentation Pages (Days 5-7)
1. Getting Started section (4-5 MDX pages)
2. CLI Reference (12+ MDX pages, one per command)
3. Architecture docs (8 MDX pages)
4. Knowledge Base (6 MDX pages)
5. Design Docs index page with external links
6. Docs layout with sidebar table of contents
7. Code syntax highlighting for all code blocks
8. Client-side full-text search for docs

### Phase 4: Marketplace Backend (Days 8-10)
1. Prisma migrations for Plugin, AgentConfig, Category models
2. API route: `GET /api/marketplace/plugins` (list with search/filter/pagination)
3. API route: `GET /api/marketplace/plugins/:id` (detail)
4. API route: `GET /api/marketplace/plugins/:id/download` (increment + return manifest)
5. API route: `POST /api/marketplace/plugins` (publish)
6. API route: `PUT /api/marketplace/plugins/:id` (update)
7. API route: `DELETE /api/marketplace/plugins/:id` (delete)
8. API route: `GET /api/marketplace/agents` (list)
9. API route: `GET /api/marketplace/agents/:id` (detail)
10. API route: `GET /api/marketplace/agents/:id/download`
11. API route: `POST /api/marketplace/agents` (publish)
12. API route: `GET /api/marketplace/categories`
13. API route: `GET /api/marketplace/stats`
14. OpenAPI route: `GET /api/docs/openapi.json`
15. Validation for all API inputs (Zod schemas)

### Phase 5: Marketplace Frontend (Days 11-13)
1. Marketplace landing page with search and stats
2. Plugin listing page with category filter and search
3. Plugin detail page with install command, readme, metadata
4. Agent listing page
5. Agent detail page
6. Publish plugin form
7. Publish agent form
8. Swagger UI page at `/openapi`
9. Copy-to-clipboard for install commands

### Phase 6: Polish + Deployment (Days 14-15)
1. Responsive design for all pages
2. SEO metadata (Next.js generateMetadata)
3. Loading states and error boundaries
4. MDX from CHANGELOG.md auto-import
5. Dockerfile and docker-compose.yml
6. README for the website project
7. Static OG image generation
8. Performance optimization (image optimization, ISR where applicable)

---

## Cortex Integration (How External Instances Use the Marketplace)

### Plugin Install Flow
```
External Cortex instance
  │
  ├── User runs: cortex plugin install marketplace:cortexprism.io/plugins/:id
  │         │
  │         ▼
  ├── Cortex CLI calls: GET https://cortexprism.io/api/marketplace/plugins/:id/download
  │         │
  │         ▼
  ├── Returns: { manifest: PluginManifest }
  │         │
  │         ▼
  └── Cortex writes the manifest to its local plugins.db
```

### Agent Config Download Flow
```
External Cortex instance
  │
  ├── User runs: cortex agent import https://cortexprism.io/api/marketplace/agents/:id/download
  │         │
  │         ▼
  ├── Returns: { agent: AgentConfig }
  │         │
  │         ▼
  └── Cortex registers the agent via its agent manager
```

---

## OpenAPI Spec (Marketplace Registry)

The OpenAPI 3.1 spec is defined in `src/lib/openapi-spec.ts` and served at `/api/docs/openapi.json`. It covers:

```yaml
openapi: 3.1.0
info:
  title: CortexPrism Marketplace API
  description: Registry for CortexPrism plugins and agent configurations
  version: 1.0.0
  contact:
    url: https://cortexprism.io
servers:
  - url: https://cortexprism.io
    description: Production
paths:
  /api/marketplace/plugins:           # GET (list), POST (create)
  /api/marketplace/plugins/{id}:      # GET, PUT, DELETE
  /api/marketplace/plugins/{id}/download:  # GET
  /api/marketplace/agents:            # GET (list), POST (create)
  /api/marketplace/agents/{id}:       # GET, PUT, DELETE
  /api/marketplace/agents/{id}/download:   # GET
  /api/marketplace/categories:        # GET
  /api/marketplace/stats:             # GET
```

The Swagger UI at `/openapi` renders this spec using `swagger-ui-react`.

---

## What Already Exists (No Duplication)

The following content already exists in `/root/cortex/` and will be **referenced** (not duplicated):
- `README.md` — CLI reference, features list, quick start, architecture — source material for our docs
- `docs/ARCHITECTURE.md` — Deep architecture description — source material
- `docs/design/DESIGN.md` — Full design document — indexed on the Design Docs page
- `docs/design/*.md` — 40+ design specs — linked from the Design Docs index
- `CHANGELOG.md` — Release history — parsed for changelog page
- `CONTRIBUTING.md` — Contributing guide — linked from Contribute page
- `src/plugins/registry.ts` — PluginManifest type — used as reference for marketplace data model
- `src/config/config.ts` — AgentConfig type — used as reference for marketplace data model
- `src/server/router.ts` — REST API reference — used for CLI docs examples
- `src/server/ui.ts` — Existing inline UI — screenshots for marketing material

The website **does not** depend on a running Cortex instance. It is a standalone Next.js application.

---

## Deployment

### Docker
```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./prisma/marketplace.db
    volumes:
      - ./prisma:/app/prisma  # persist SQLite DB
```

### Standalone
```bash
npm run build
npm start  # Next.js server on :3000
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./prisma/marketplace.db` | SQLite database path |
| `NEXT_PUBLIC_SITE_URL` | `https://cortexprism.io` | Canonical site URL |
| `NEXT_PUBLIC_GITHUB_REPO` | `scarecr0w12/cortex` | GitHub repo for star/contribute links |

---

## Not In Scope (First Iteration)

- User accounts / auth for marketplace publishing (initially manual curation via seed data or admin)
- Analytics tracking (no Google Analytics, no Plausible — respect user privacy)
- Community forums or comments on marketplace items
- Automated plugin testing/verification pipeline
- CDN for plugin/agent binary distribution (serve manifests only, not binaries)
- Rate limiting on API (add before production launch)
