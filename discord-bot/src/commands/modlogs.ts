import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { prisma } from "../index";
import { isModerator } from "../lib/moderation";

export async function handleModlogs(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    return;
  }

  const target = interaction.options.getMember("user") as GuildMember | null;
  const actionFilter = interaction.options.get("action")?.value as string | undefined;

  await interaction.deferReply({ ephemeral: true });

  const where: Record<string, unknown> = { guildId: interaction.guildId! };
  if (target) where.targetId = target.id;
  if (actionFilter) where.actionType = actionFilter;

  const logs = await prisma.moderationAction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  if (logs.length === 0) {
    const desc = target
      ? `No moderation logs found for ${target.user.tag}.`
      : "No moderation logs found for this server.";
    await interaction.editReply({ content: desc });
    return;
  }

  const actionColors: Record<string, number> = {
    warn: 0xFBBF24,
    mute: 0xF59E0B,
    unmute: 0x10B981,
    kick: 0xEF4444,
    ban: 0xDC2626,
    unban: 0x10B981,
    purge: 0x8B5CF6,
  };

  const actionEmojis: Record<string, string> = {
    warn: "⚠️",
    mute: "🔇",
    unmute: "🔊",
    kick: "👢",
    ban: "🔨",
    unban: "✅",
    purge: "🧹",
  };

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(target ? `Moderation Logs for ${target.user.tag}` : "Server Moderation Logs")
    .setDescription(`Showing latest ${logs.length} log(s)${actionFilter ? ` (filtered by: ${actionFilter})` : ""}`)
    .setTimestamp();

  for (const log of logs) {
    const emoji = actionEmojis[log.actionType] || "📋";
    const date = log.createdAt.toISOString().split("T")[0];
    let meta = "";
    if (log.duration) {
      const durMin = Math.floor(parseInt(log.duration) / 60000);
      meta += ` | ${durMin}m`;
    }
    if (log.reason) meta += ` | ${log.reason}`;
    if (meta.length > 100) meta = meta.substring(0, 97) + "...";

    embed.addFields({
      name: `${emoji} ${log.actionType.toUpperCase()} — ${date}`,
      value: `Target: **${log.targetTag}** (\`${log.targetId}\`)\nModerator: **${log.moderatorTag}** (\`${log.moderatorId}\`)${meta}`,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}
