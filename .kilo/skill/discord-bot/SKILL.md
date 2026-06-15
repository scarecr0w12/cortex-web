---
name: discord-bot
description: Discord bot service — slash commands, webhook notifications, admin moderation
---

## Discord Bot Architecture

The Discord bot is a standalone Node.js service at `discord-bot/` sharing the same Prisma schema and SQLite database.

### Structure

```
discord-bot/
├── src/
│   ├── index.ts          # Bot entry point, login, ready handler
│   ├── deploy-commands.ts # Slash command registration
│   └── commands/
│       ├── stats.ts       # /stats — server statistics
│       ├── plugin.ts      # /plugin search|info — plugin lookup
│       ├── agent.ts       # /agent search|info — agent config lookup
│       └── review.ts      # /review list|approve|reject — admin moderation
├── Dockerfile             # Container build for Discord bot
├── manage.sh             # Start/stop/status/logs management
├── cortex-discord-bot.service  # systemd service file
├── cortex-web.service         # systemd service file for web
├── package.json
└── tsconfig.json
```

### Slash Commands

| Command | Description |
|---------|-------------|
| `/stats` | Show total plugins, agents, users, downloads |
| `/plugin search <query>` | Search plugins by name/description/tags |
| `/plugin info <slug>` | Get plugin details |
| `/agent search <query>` | Search agent configs |
| `/agent info <slug>` | Get agent config details |
| `/review list` | List pending submissions (admin only) |
| `/review approve <id>` | Approve a submission (admin only) |
| `/review reject <id> [reason]` | Reject a submission (admin only) |

### Webhook Notifications

When a user submits a plugin or agent for review, the web app sends a Discord embed notification via `src/lib/discord-webhook.ts` using the `DISCORD_WEBHOOK_URL` env var.

### Key Commands

```bash
# From project root:
npm run discord:install   # Install bot dependencies
npm run discord:dev       # Start in dev mode (tsx watch)
npm run discord:deploy    # Register slash commands with Discord API
npm run discord:start     # Start via manage.sh
npm run discord:stop      # Stop via manage.sh
npm run discord:logs      # Tail logs
```

### Admin Role Verification

The bot checks admin permissions via:
1. Discord user IDs listed in admin config
2. Database role lookup on the linked User record
3. Users must have linked their Discord account on the web app

### Environment (inside discord-bot/)

| Variable | Purpose |
|----------|---------|
| `DISCORD_BOT_TOKEN` | Bot auth token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | OAuth client ID |
| `DISCORD_GUILD_ID` | Guild for dev command deployment |
| `DATABASE_URL` | Path to shared Prisma SQLite DB |
| `JWT_SECRET` | Shared secret for auth token verification |
| `DISCORD_ADMIN_IDS` | Comma-separated Discord user IDs with admin access |
