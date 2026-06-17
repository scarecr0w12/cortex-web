import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import {
  isModerator, logModerationAction, sendLogEmbed, buildModLogEmbed,
  formatDuration, parseDuration,
} from "../lib/moderation";

export async function handleMute(interaction: ChatInputCommandInteraction) {
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
  const durationStr = interaction.options.get("duration")?.value as string | undefined;
  const reason = interaction.options.get("reason")?.value as string | undefined;

  if (!target) {
    await interaction.reply({ content: "Could not find that user in this server.", ephemeral: true });
    return;
  }

  if (target.id === interaction.user.id) {
    await interaction.reply({ content: "You cannot mute yourself.", ephemeral: true });
    return;
  }

  if (!target.manageable) {
    await interaction.reply({ content: "I cannot moderate this user due to role hierarchy.", ephemeral: true });
    return;
  }

  if (target.communicationDisabledUntil && target.communicationDisabledUntil > new Date()) {
    await interaction.reply({ content: "This user is already timed out.", ephemeral: true });
    return;
  }

  const durationMs = durationStr ? parseDuration(durationStr) : 3600000; // default 1 hour
  if (!durationMs) {
    await interaction.reply({ content: "Invalid duration format. Use e.g. `10m`, `2h`, `1d`.", ephemeral: true });
    return;
  }

  if (durationMs > 2419200000) { // 28 days, Discord max
    await interaction.reply({ content: "Duration cannot exceed 28 days.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    await target.timeout(durationMs, reason || "No reason provided");
  } catch {
    await interaction.editReply({ content: "Failed to timeout user. Check bot permissions." });
    return;
  }

  const durationFormatted = formatDuration(durationMs);
  const expiresAt = new Date(Date.now() + durationMs);

  await logModerationAction({
    guildId: interaction.guildId!,
    actionType: "mute",
    moderatorId: interaction.user.id,
    moderatorTag: interaction.user.tag,
    targetId: target.id,
    targetTag: target.user.tag,
    reason: reason || null,
    duration: String(durationMs),
    expiresAt,
  });

  const embed = buildModLogEmbed({
    actionType: "mute",
    moderator: interaction.user,
    target: target.user,
    reason: reason || null,
    color: 0xF59E0B,
  });
  embed.addFields({ name: "Duration", value: durationFormatted, inline: true });
  embed.addFields({ name: "Expires", value: expiresAt.toISOString(), inline: true });

  await sendLogEmbed(interaction.guild, embed);

  const dmEmbed = new EmbedBuilder()
    .setColor(0xF59E0B)
    .setTitle(`Muted in ${interaction.guild.name}`)
    .setDescription(`You have been muted for ${durationFormatted}.`)
    .addFields(
      { name: "Moderator", value: interaction.user.tag, inline: true },
      { name: "Expires", value: expiresAt.toISOString(), inline: true },
    );
  if (reason) dmEmbed.addFields({ name: "Reason", value: reason });

  await target.send({ embeds: [dmEmbed] }).catch(() => {});

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xF59E0B)
        .setDescription(`🔇 **${target.user.tag}** has been muted for ${durationFormatted}${reason ? ` | Reason: ${reason}` : ""}`),
    ],
  });
}

export async function handleUnmute(interaction: ChatInputCommandInteraction) {
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
  const reason = interaction.options.get("reason")?.value as string | undefined;

  if (!target) {
    await interaction.reply({ content: "Could not find that user in this server.", ephemeral: true });
    return;
  }

  if (!target.communicationDisabledUntil || target.communicationDisabledUntil <= new Date()) {
    await interaction.reply({ content: "This user is not muted.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    await target.timeout(null, reason || "Unmuted");
  } catch {
    await interaction.editReply({ content: "Failed to unmute user. Check bot permissions." });
    return;
  }

  await logModerationAction({
    guildId: interaction.guildId!,
    actionType: "unmute",
    moderatorId: interaction.user.id,
    moderatorTag: interaction.user.tag,
    targetId: target.id,
    targetTag: target.user.tag,
    reason: reason || null,
  });

  const embed = buildModLogEmbed({
    actionType: "unmute",
    moderator: interaction.user,
    target: target.user,
    reason: reason || null,
    color: 0x10B981,
  });

  await sendLogEmbed(interaction.guild, embed);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x10B981)
        .setDescription(`🔊 **${target.user.tag}** has been unmuted${reason ? ` | Reason: ${reason}` : ""}`),
    ],
  });
}
