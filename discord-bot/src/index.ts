// Load .env from project root (works for npx tsx directly, npm run dev uses --import preload)
try { require("dotenv").config({ path: require("path").resolve(process.cwd() + "/../.env") }); } catch {}

// Force absolute database path so the bot shares the same database as the web app
try { process.env.DATABASE_URL = "file:" + require("path").resolve(process.cwd() + "/../prisma/marketplace.db"); } catch {}

import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { handleStats } from "./commands/stats";
import { handlePlugin } from "./commands/plugin";
import { handleAgent } from "./commands/agent";
import { handleReview } from "./commands/review";

export const prisma = new PrismaClient();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const BOT_START_TIME = Date.now();

async function trackCommand(name: string) {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "discord_bot_command_counts" } });
    const counts: Record<string, number> = row?.value ? JSON.parse(row.value) : {};
    counts[name] = (counts[name] || 0) + 1;
    await prisma.setting.upsert({
      where: { key: "discord_bot_command_counts" },
      update: { value: JSON.stringify(counts) },
      create: { key: "discord_bot_command_counts", value: JSON.stringify(counts) },
    });
  } catch {}
}

async function trackStartTime() {
  try {
    await prisma.setting.upsert({
      where: { key: "discord_bot_started_at" },
      update: { value: String(BOT_START_TIME) },
      create: { key: "discord_bot_started_at", value: String(BOT_START_TIME) },
    });
  } catch {}
}

client.once(Events.ClientReady, async (c) => {
  console.log(`Bot logged in as ${c.user.tag}`);
  await trackStartTime();
  await updateHeartbeat();
});

async function updateHeartbeat() {
  try {
    await prisma.setting.upsert({
      where: { key: "discord_bot_heartbeat" },
      update: { value: String(Date.now()) },
      create: { key: "discord_bot_heartbeat", value: String(Date.now()) },
    });
  } catch {}
  setTimeout(updateHeartbeat, 30000);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case "stats":
        await handleStats(interaction);
        break;
      case "plugin":
        await handlePlugin(interaction);
        break;
      case "agent":
        await handleAgent(interaction);
        break;
      case "review":
        await handleReview(interaction);
        break;
    }
    trackCommand(interaction.commandName);
  } catch (error) {
    console.error(`Error handling command ${interaction.commandName}:`, error);
    const reply = interaction.deferred
      ? interaction.editReply.bind(interaction)
      : interaction.reply.bind(interaction);
    await reply({
      content: "An error occurred while processing the command.",
      ephemeral: true,
    });
  }
});

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);
  const commands = [
    {
      name: "stats",
      description: "Show marketplace statistics",
    },
    {
      name: "plugin",
      description: "Search or view plugin details",
      options: [
        {
          name: "action",
          description: "search or info",
          type: 3,
          required: true,
          choices: [
            { name: "search", value: "search" },
            { name: "info", value: "info" },
          ],
        },
        {
          name: "query",
          description: "Search query or plugin name/ID",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "agent",
      description: "Search or view agent details",
      options: [
        {
          name: "action",
          description: "search or info",
          type: 3,
          required: true,
          choices: [
            { name: "search", value: "search" },
            { name: "info", value: "info" },
          ],
        },
        {
          name: "query",
          description: "Search query or agent name/ID",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "review",
      description: "Admin review commands for pending submissions",
      options: [
        {
          name: "action",
          description: "list, approve, or reject",
          type: 3,
          required: true,
          choices: [
            { name: "list", value: "list" },
            { name: "approve", value: "approve" },
            { name: "reject", value: "reject" },
          ],
        },
        {
          name: "id",
          description: "Submission ID (required for approve/reject)",
          type: 3,
          required: false,
        },
        {
          name: "reason",
          description: "Rejection reason (required for reject)",
          type: 3,
          required: false,
        },
      ],
    },
  ];

  try {
    if (process.env.DISCORD_GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID),
        { body: commands },
      );
      console.log("Guild commands registered successfully");
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commands },
      );
      console.log("Global commands registered successfully");
    }
  } catch (error) {
    console.error("Failed to register commands:", error);
  }
}

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error("DISCORD_BOT_TOKEN environment variable is required");
    process.exit(1);
  }

  await registerCommands();
  await client.login(token);
}

main().catch(console.error);
