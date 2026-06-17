import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { isModerator, logModerationAction, sendLogEmbed, buildModLogEmbed } from "../lib/moderation";

export async function handleWarn(interaction: ChatInputCommandInteraction) {
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
    await interaction.reply({ content: "You cannot warn yourself.", ephemeral: true });
    return;
  }

  if (target.user.bot) {
    await interaction.reply({ content: "You cannot warn bots.", ephemeral: true });
    return;
  }

  if (!target.manageable) {
    await interaction.reply({ content: "I cannot moderate this user due to role hierarchy.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  await logModerationAction({
    guildId: interaction.guildId!,
    actionType: "warn",
    moderatorId: interaction.user.id,
    moderatorTag: interaction.user.tag,
    targetId: target.id,
    targetTag: target.user.tag,
    reason: reason || null,
  });

  const embed = buildModLogEmbed({
    actionType: "warn",
    moderator: interaction.user,
    target: target.user,
    reason: reason || null,
    color: 0xFBBF24,
  });

  await sendLogEmbed(interaction.guild, embed);

  const dmEmbed = new EmbedBuilder()
    .setColor(0xFBBF24)
    .setTitle(`Warning in ${interaction.guild.name}`)
    .setDescription(`You have received a warning.`)
    .addFields(
      { name: "Moderator", value: interaction.user.tag, inline: true },
    );
  if (reason) dmEmbed.addFields({ name: "Reason", value: reason });

  await target.send({ embeds: [dmEmbed] }).catch(() => {});

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xFBBF24)
        .setDescription(`⚠️ **${target.user.tag}** has been warned${reason ? ` | Reason: ${reason}` : ""}`),
    ],
  });
}
