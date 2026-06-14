# CortexPrism Website

The official website and marketplace for the [CortexPrism](https://github.com/scarecr0w12/cortex) project — an open-source agentic harness system.

## Architecture

```
Browser → nginx :443 → Next.js SSR :3001 → Prisma → SQLite
                          │
                          ├── Marketing / Docs pages (SSG)
                          ├── Marketplace UI (client-side with SWR)
                          └── REST API (/api/marketplace/*)
                              └── External Cortex instances (plugin install)
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | SQLite via Prisma 5 |
| Content | Markdown (react-markdown) |
| Search | Fuse.js (client-side) |
| API Docs | swagger-ui-react + OpenAPI 3.1 |
| Deployment | Docker / systemd + nginx |

## Development

```bash
npm install
npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts
npm run dev
```

The dev server runs on `http://localhost:3001`. The API is available at `/api/marketplace/*` and the OpenAPI spec at `/api/docs/openapi.json`.

## Production Build

```bash
npm run build    # builds standalone output + copies static assets + DB
systemctl restart cortexprism-web.service   # or docker compose up -d
```

## Project Structure

```
content/           # MDX documentation files
prisma/            # Schema + seed data + SQLite DB
public/            # Static assets (images, favicon)
src/
  app/             # Next.js App Router pages + API routes
  components/      # React components (layout, landing, docs, marketplace, shared)
  lib/             # Utilities (prisma, openapi, github, markdown)
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./prisma/marketplace.db` | SQLite database path |
| `NEXT_PUBLIC_SITE_URL` | `https://cortexprism.io` | Canonical site URL |
| `NEXT_PUBLIC_GITHUB_REPO` | `scarecr0w12/cortex` | GitHub repo for stats |

## License

MIT
