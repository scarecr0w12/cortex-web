---
name: database
description: Prisma ORM + SQLite — schema migrations, queries, and admin operations
---

## Database Overview

The project uses **SQLite** via **Prisma 5 ORM**. The database file is at `prisma/marketplace.db` and is shared between the web app and Discord bot.

### Schema (`prisma/schema.prisma`)

17 models:

| Model | Key Fields | Relations |
|-------|-----------|-----------|
| **User** | id, email, username, passwordHash, role, discordId, githubId, avatar, bio, website | → Role, → Plugin[], → AgentConfig[], → UserRating[] |
| **Role** | id, name, key, description, isSystem | → User[], → RolePermission[] |
| **Permission** | id, name, key | → RolePermission[] |
| **RolePermission** | roleId, permissionId | → Role, → Permission (composite unique) |
| **Plugin** | id, name, slug, version, kind, status, downloads, rating | → Category, → User, → SubmissionReview[], → UserRating[], → Screenshot[], → PluginVersion[] |
| **AgentConfig** | id, name, slug, version, provider, model, status | → Category, → User, → SubmissionReview[], → UserRating[], → Screenshot[], → AgentVersion[] |
| **Category** | id, name, slug | → Plugin[], → AgentConfig[] |
| **SubmissionReview** | pluginId/agentId, action, notes | → Plugin/AgentConfig, → User |
| **UserRating** | pluginId/agentId, rating (1-5), review | → Plugin/AgentConfig, → User |
| **Screenshot** | pluginId/agentId, url, alt, order | → Plugin/AgentConfig |
| **PluginVersion** | pluginId, version, kind, entryPoint | → Plugin |
| **AgentVersion** | agentId, version, provider, model | → AgentConfig |
| **AuditLog** | userId, action, entity, entityId, metadata, ip | → User |
| **GitHubConnection** | owner, repo, branch, isActive, lastSyncAt | → User |
| **GitHubTopicScan** | topic, status, resultCount | → User, → DiscoveredRepo[] |
| **DiscoveredRepo** | scanId, owner, repo, fullName, stars, topics | → GitHubTopicScan |
| **Setting** | key (unique), value | none |

### Key Commands

```bash
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema to SQLite (creates/migrates tables)
npm run db:studio    # Open Prisma Studio for visual DB browsing
```

### Patterns

- **Server component queries**: Direct `prisma.model.findMany()` calls — no API route needed
- **Client component queries**: SWR hooks calling `/api/` endpoints
- **Admin audit logging**: Use `src/lib/audit.ts` helpers to log admin actions
- **Runtime settings**: Accessed via `src/lib/settings.ts` (Setting model key-value store)
- **Validation**: All API inputs validated with Zod schemas before Prisma calls
- **Deletes**: Some relations cascade (e.g., GitHubTopicScan → DiscoveredRepo), others require manual cleanup

### Prisma Client

Singleton at `src/lib/prisma.ts`:
```ts
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Migration Workflow

1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` to update the Prisma client
3. Run `npm run db:push` to apply changes to the SQLite database
4. If changing shared models (User, Plugin, AgentConfig), update Discord bot's usage too
