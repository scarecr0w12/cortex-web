import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { isModerator, logModerationAction, sendLogEmbed, buildModLogEmbed } from "../lib/moderation";

export async function handleBan(interaction: ChatInputCommandInteraction) {
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
  const deleteDays = (interaction.options.get("days")?.value as number) || 0;

  if (!target) {
    await interaction.reply({ content: "Could not find that user in this server.", ephemeral: true });
    return;
  }

  if (target.id === interaction.user.id) {
    await interaction.reply({ content: "You cannot ban yourself.", ephemeral: true });
    return;
  }

  if (!target.bannable) {
    await interaction.reply({ content: "I cannot ban this user. Check role hierarchy and bot permissions.", ephemeral: true });
    return;
  }

  if (deleteDays < 0 || deleteDays > 7) {
    await interaction.reply({ content: "Message delete days must be between 0 and 7.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  const targetTag = target.user.tag;
  const targetId = target.id;

  try {
    const dmEmbed = new EmbedBuilder()
      .setColor(0xDC2626)
      .setTitle(`Banned from ${interaction.guild.name}`)
      .setDescription("You have been banned from the server.")
      .addFields({ name: "Moderator", value: interaction.user.tag, inline: true });
    if (reason) dmEmbed.addFields({ name: "Reason", value: reason });
    await target.send({ embeds: [dmEmbed] }).catch(() => {});
  } catch {}

  try {
    await target.ban({ deleteMessageSeconds: deleteDays * 86400, reason: reason || "No reason provided" });
  } catch {
    await interaction.editReply({ content: "Failed to ban user." });
    return;
  }

  await logModerationAction({
    guildId: interaction.guildId!,
    actionType: "ban",
    moderatorId: interaction.user.id,
    moderatorTag: interaction.user.tag,
    targetId,
    targetTag,
    reason: reason || null,
    metadata: { deleteDays },
  });

  const embed = buildModLogEmbed({
    actionType: "ban",
    moderator: interaction.user,
    target: { id: targetId, tag: targetTag } as unknown as GuildMember,
    reason: reason || null,
    color: 0xDC2626,
  });
  if (deleteDays > 0) {
    embed.addFields({ name: "Messages Deleted", value: `${deleteDays} day(s)`, inline: true });
  }

  await sendLogEmbed(interaction.guild, embed);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xDC2626)
        .setDescription(`🔨 **${targetTag}** has been banned${reason ? ` | Reason: ${reason}` : ""}${deleteDays > 0 ? ` | Messages deleted: ${deleteDays}d` : ""}`),
    ],
  });
}

export async function handleUnban(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    return;
  }

  const userId = interaction.options.get("user_id")?.value as string | undefined;
  const reason = interaction.options.get("reason")?.value as string | undefined;

  if (!userId) {
    await interaction.reply({ content: "Please provide a user ID to unban.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const ban = await interaction.guild.bans.fetch(userId);
    if (!ban) {
      await interaction.editReply({ content: "That user is not banned." });
      return;
    }
  } catch {
    await interaction.editReply({ content: "That user is not banned or the ID is invalid." });
    return;
  }

  try {
    await interaction.guild.members.unban(userId, reason || "No reason provided");
  } catch {
    await interaction.editReply({ content: "Failed to unban user." });
    return;
  }

  await logModerationAction({
    guildId: interaction.guildId!,
    actionType: "unban",
    moderatorId: interaction.user.id,
    moderatorTag: interaction.user.tag,
    targetId: userId,
    targetTag: userId,
    reason: reason || null,
  });

  const embed = buildModLogEmbed({
    actionType: "unban",
    moderator: interaction.user,
    target: { id: userId, tag: userId } as unknown as GuildMember,
    reason: reason || null,
    color: 0x10B981,
  });

  await sendLogEmbed(interaction.guild, embed);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x10B981)
        .setDescription(`✅ User **${userId}** has been unbanned${reason ? ` | Reason: ${reason}` : ""}`),
    ],
  });
}
