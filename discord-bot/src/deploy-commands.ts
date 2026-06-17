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
  {
    name: "warn",
    description: "Warn a user",
    options: [
      {
        name: "user",
        description: "The user to warn",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for the warning",
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: "mute",
    description: "Timeout a user",
    options: [
      {
        name: "user",
        description: "The user to mute",
        type: 6,
        required: true,
      },
      {
        name: "duration",
        description: "Duration (e.g. 10m, 2h, 1d). Default: 1h",
        type: 3,
        required: false,
      },
      {
        name: "reason",
        description: "Reason for the mute",
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: "unmute",
    description: "Remove a timeout from a user",
    options: [
      {
        name: "user",
        description: "The user to unmute",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for the unmute",
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: "kick",
    description: "Kick a user from the server",
    options: [
      {
        name: "user",
        description: "The user to kick",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for the kick",
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: "ban",
    description: "Ban a user from the server",
    options: [
      {
        name: "user",
        description: "The user to ban",
        type: 6,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for the ban",
        type: 3,
        required: false,
      },
      {
        name: "days",
        description: "Days of messages to delete (0-7)",
        type: 4,
        required: false,
      },
    ],
  },
  {
    name: "unban",
    description: "Unban a user by ID",
    options: [
      {
        name: "user_id",
        description: "The user ID to unban",
        type: 3,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for the unban",
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: "purge",
    description: "Bulk delete messages",
    options: [
      {
        name: "count",
        description: "Number of messages to delete (1-100)",
        type: 4,
        required: true,
      },
      {
        name: "user",
        description: "Only delete messages from this user",
        type: 6,
        required: false,
      },
    ],
  },
  {
    name: "modlogs",
    description: "View moderation logs",
    options: [
      {
        name: "user",
        description: "Filter logs by user",
        type: 6,
        required: false,
      },
      {
        name: "action",
        description: "Filter by action type",
        type: 3,
        required: false,
        choices: [
          { name: "Warn", value: "warn" },
          { name: "Mute", value: "mute" },
          { name: "Unmute", value: "unmute" },
          { name: "Kick", value: "kick" },
          { name: "Ban", value: "ban" },
          { name: "Unban", value: "unban" },
          { name: "Purge", value: "purge" },
        ],
      },
    ],
  },
  {
    name: "guild",
    description: "Server information and settings",
    options: [
      {
        name: "info",
        description: "View server information",
        type: 1,
      },
      {
        name: "settings",
        description: "View or modify guild settings",
        type: 1,
        options: [
          {
            name: "action",
            description: "view or set",
            type: 3,
            required: true,
            choices: [
              { name: "view", value: "view" },
              { name: "set", value: "set" },
            ],
          },
          {
            name: "key",
            description: "Setting to change",
            type: 3,
            required: false,
            choices: [
              { name: "Log Channel", value: "log_channel" },
              { name: "Mod Role", value: "mod_role" },
              { name: "Admin Role", value: "admin_role" },
              { name: "Max Warns Before Ban", value: "max_warns" },
              { name: "Default Slowmode", value: "slowmode" },
              { name: "Auto Mod", value: "auto_mod" },
              { name: "Welcome Messages", value: "welcome" },
              { name: "Leave Messages", value: "leave" },
            ],
          },
          {
            name: "value",
            description: "New value for the setting",
            type: 3,
            required: false,
          },
        ],
      },
    ],
  },
  {
    name: "user",
    description: "View user information",
    options: [
      {
        name: "user",
        description: "The user to view",
        type: 6,
        required: false,
      },
    ],
  },
  {
    name: "slowmode",
    description: "Set channel slowmode",
    options: [
      {
        name: "duration",
        description: "Slowmode duration (e.g. 30s, 5m, 2h, 0 to disable)",
        type: 3,
        required: false,
      },
      {
        name: "channel",
        description: "Channel to set slowmode in (defaults to current)",
        type: 7,
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
