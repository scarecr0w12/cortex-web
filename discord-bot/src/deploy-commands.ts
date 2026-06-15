import { REST, Routes } from "discord.js";

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

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId) {
    console.error("DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID environment variables are required");
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log(`Guild commands registered for guild ${guildId}`);
    } else {
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
      console.log("Global commands registered");
    }
  } catch (error) {
    console.error("Failed to register commands:", error);
    process.exit(1);
  }
}

main();
