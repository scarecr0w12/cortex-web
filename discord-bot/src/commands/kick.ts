import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { isModerator, logModerationAction, sendLogEmbed, buildModLogEmbed } from "../lib/moderation";

export async function handleKick(interaction: ChatInputCommandInteraction) {
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

  if (target.id === interaction.user.id) {
    await interaction.reply({ content: "You cannot kick yourself.", ephemeral: true });
    return;
  }

  if (!target.kickable) {
    await interaction.reply({ content: "I cannot kick this user. Check role hierarchy and bot permissions.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  const targetTag = target.user.tag;
  const targetId = target.id;

  try {
    const dmEmbed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle(`Kicked from ${interaction.guild.name}`)
      .setDescription("You have been kicked from the server.")
      .addFields({ name: "Moderator", value: interaction.user.tag, inline: true });
    if (reason) dmEmbed.addFields({ name: "Reason", value: reason });
    await target.send({ embeds: [dmEmbed] }).catch(() => {});
  } catch {}

  try {
    await target.kick(reason || "No reason provided");
  } catch {
    await interaction.editReply({ content: "Failed to kick user." });
    return;
  }

  await logModerationAction({
    guildId: interaction.guildId!,
    actionType: "kick",
    moderatorId: interaction.user.id,
    moderatorTag: interaction.user.tag,
    targetId,
    targetTag,
    reason: reason || null,
  });

  const embed = buildModLogEmbed({
    actionType: "kick",
    moderator: interaction.user,
    target: { id: targetId, tag: targetTag } as unknown as GuildMember,
    reason: reason || null,
    color: 0xEF4444,
  });

  await sendLogEmbed(interaction.guild, embed);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xEF4444)
        .setDescription(`👢 **${targetTag}** has been kicked${reason ? ` | Reason: ${reason}` : ""}`),
    ],
  });
}
