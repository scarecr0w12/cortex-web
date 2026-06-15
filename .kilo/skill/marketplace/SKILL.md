---
name: marketplace
description: Expertise in CortexPrism marketplace — plugins, agent configs, reviews, publishing, GitHub import
---

## Marketplace Architecture

The marketplace has two resource types: **Plugin** and **AgentConfig**, sharing common structure.

### Routes

| Path | Type | Description |
|------|------|-------------|
| `/marketplace` | Page | Marketplace landing (counts, category links) |
| `/marketplace/plugins` | Page | Plugin listing with search/filter |
| `/marketplace/agents` | Page | Agent config listing |
| `/marketplace/plugins/[slug]` | Page | Plugin detail page |
| `/marketplace/agents/[slug]` | Page | Agent config detail page |
| `/marketplace/publish` | Page | Publish form for plugins/agents |

### API Endpoints

| Endpoint | Methods |
|----------|---------|
| `/api/marketplace/plugins` | GET (list), POST (create) |
| `/api/marketplace/plugins/[id]` | GET, PUT, DELETE |
| `/api/marketplace/plugins/[id]/download` | POST |
| `/api/marketplace/plugins/[id]/reviews` | GET, POST |
| `/api/marketplace/agents` | GET (list), POST (create) |
| `/api/marketplace/agents/[id]` | GET, PUT, DELETE |
| `/api/marketplace/agents/[id]/download` | POST |
| `/api/marketplace/agents/[id]/reviews` | GET, POST |
| `/api/marketplace/categories` | GET |
| `/api/marketplace/stats` | GET |
| `/api/marketplace/import` | POST (import from GitHub) |

### Admin Endpoints

| Endpoint | Methods |
|----------|---------|
| `/api/admin/submissions/plugins` | GET (list pending), PUT (approve/reject body: `{id, action, notes}`) |
| `/api/admin/submissions/agents` | GET (list pending), PUT (approve/reject body: `{id, action, notes}`) |
| `/api/admin/github-connections` | GET, POST |
| `/api/admin/github-connections/[id]/sync` | POST |
| `/api/admin/github-topic-scanner` | GET, POST |
| `/api/admin/github-topic-scanner/[id]` | GET, DELETE |
| `/api/admin/github-topic-scanner/[id]/import` | POST |

### Database Models

- **Plugin**: id, name, slug, version, description, kind (esm|mcp|wasm), entryPoint, capabilities, tags, author, downloads, rating, githubStars, categoryId, userId, status
- **AgentConfig**: id, name, slug, version, description, provider, model, temperature, tools, tags, systemPrompt, soulContent, categoryId, userId, status
- **Category**: id, name, slug (shared between plugins and agents)
- **SubmissionReview**: pluginId/agentId, reviewerId, action, notes
- **UserRating**: pluginId/agentId, userId, rating (1-5), review

### Conventions

- Plugin `kind` determines badge color: `esm`=indigo, `mcp`=green, `wasm`=purple
- Status workflow: `pending` → admin review → `approved` or `rejected`
- GitHub import flow: POST to `/api/marketplace/import` with `{repository: <github_url>, branch, autoApprove, categoryId}` → fetches manifest from repo → creates/updates plugin
- Admin review flow: PUT to `/api/admin/submissions/plugins` or `/api/admin/submissions/agents` with `{id, action: "approved"|"rejected", notes?}`
- Slugs must be kebab-case and unique
- Category IDs use `cm0` prefix pattern
- Screenshots are stored per plugin/agent with ordering
- Version history tracked via PluginVersion/AgentVersion tables
