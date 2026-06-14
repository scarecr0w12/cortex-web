# Changelog

All notable changes to the CortexPrism website will be documented in this file.

## [1.0.0] — 2026-06-14

### Added
- Initial public release of the CortexPrism website
- Landing page with hero, stats bar, feature grid, and CTA
- Features overview page with 11 detailed feature cards
- Changelog page with release history from v0.0.1 through v1.0.0
- Contribute page with development setup guide
- Getting Started documentation (quickstart, installation, first run, configuration)
- CLI Reference documentation for all cortex subcommands
- Architecture documentation (agent loop, memory, security, router, daemon, plugins, databases)
- Knowledge Base (FAQ, troubleshooting, best practices, provider guide, sandbox guide)
- Design Docs index page with links to GitHub specs
- Plugin marketplace (listing with search, category/kind filtering, pagination)
- Agent marketplace (listing with search, category/provider filtering, pagination)
- Plugin detail pages with install command, capabilities, README, metadata
- Agent detail pages with system prompt preview, tools, tags, model info
- Publish forms for plugins and agents (manual review flow)
- Swagger UI at /openapi for the marketplace REST API
- OpenAPI 3.1 spec served at /api/docs/openapi.json
- Marketplace REST API with 10 endpoints (CRUD for plugins/agents, categories, stats, download)
- Zod validation for all POST/PUT endpoints
- CORS middleware for external Cortex instance access
- Dark theme with #0a0a0f background, indigo accent (#6366f1)
- Responsive design (mobile, tablet, desktop)
- SEO metadata with Open Graph tags
- Live GitHub stars from API with 5-minute caching
- Loading skeletons and empty states for marketplace pages
- Copy-to-clipboard for plugin/agent install commands
- SVG logo and favicon
- Dockerfile and docker-compose.yml for deployment
- Nginx reverse proxy configuration
- systemd service for production deployment

## [0.0.1] — 2026-06-10

### Added
- Project scaffolding with Next.js 14 + TypeScript + Tailwind
- Prisma ORM with SQLite schema (Plugin, AgentConfig, Category models)
- Seed data with 6 sample plugins and 4 sample agent configurations
- Base layout with navigation and footer
- MDX content pipeline with react-markdown
