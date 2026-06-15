import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { handleStats } from "./commands/stats";
import { handlePlugin } from "./commands/plugin";
import { handleAgent } from "./commands/agent";
import { handleReview } from "./commands/review";

export const prisma = new PrismaClient();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Bot logged in as ${c.user.tag}`);
});

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
