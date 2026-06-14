# Changelog

All notable changes to the CortexPrism website will be documented in this file.

## [0.0.2] — 2026-06-14

### Added
- User account system with registration, login, and JWT authentication
- Role-based access control (user / admin roles)
- Admin panel for reviewing and approving/rejecting marketplace submissions
- User dashboard showing submission status with pending/approved/rejected badges
- Submission workflow: new plugins and agents start as "pending" until admin approval
- SubmissionReview audit trail tracking who approved/rejected each item
- Login and Register pages with form validation
- Dynamic navigation bar showing Sign In or username based on auth state
- Admin seed user (admin@cortexprism.io) created during database seeding

### Changed
- Marketplace API now filters by `status: "approved"` instead of `published: true`
- Plugin and AgentConfig models use `status` field (pending/approved/rejected)
- Publish form submits via authenticated API and redirects to dashboard
- CORS middleware expanded to cover auth and admin API routes

## [0.0.1] — 2026-06-14

### Added
- Initial public release of the CortexPrism website
- Landing page with hero, stats bar, feature grid, and CTA
- Features overview page with 11 detailed feature cards
- Changelog page pulling live from GitHub CHANGELOG.md files
- Recent commits section showing activity from both cortex-web and cortex repos
- Contribute page with development setup guide
- Getting Started documentation (quickstart, installation, first run, configuration)
- CLI Reference documentation for all cortex subcommands
- Architecture documentation (agent loop, memory, security, router, daemon, plugins, databases)
- Knowledge Base (FAQ, troubleshooting, best practices, provider guide, sandbox guide)
- Design Docs index page with links to GitHub specs
- Plugin marketplace with debounced search, category/kind filtering, pagination, loading skeletons
- Agent marketplace with search, category/provider filtering, pagination, loading skeletons
- Plugin detail pages with install command, capabilities, README, metadata
- Agent detail pages with system prompt preview, tools, tags, model info
- Publish forms for plugins and agents
- Swagger UI at /openapi for the marketplace REST API
- OpenAPI 3.1 spec served at /api/docs/openapi.json
- Marketplace REST API with 10 endpoints (CRUD for plugins/agents, categories, stats, download)
- Zod validation for all POST/PUT endpoints
- CORS middleware for external Cortex instance access
- Dark theme with #0a0a0f background, indigo accent (#6366f1)
- Responsive design (mobile, tablet, desktop)
- SEO metadata with Open Graph tags
- Live GitHub stars from API with 5-minute caching
- Copy-to-clipboard for plugin/agent install commands
- Redesigned plugin/agent cards with deterministic color avatars, version display, hover effects
- SVG logo and favicon
- Dockerfile and docker-compose.yml for deployment
- Nginx reverse proxy configuration with Let's Encrypt SSL
- systemd service for production deployment
