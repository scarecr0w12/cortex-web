import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from "discord.js";

export async function handleUserInfo(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const target = (interaction.options.getMember("user") as GuildMember | null) || interaction.member as GuildMember;

  await interaction.deferReply();

  const roles = target.roles.cache
    .filter(r => r.id !== interaction.guild!.id)
    .sort((a, b) => b.position - a.position)
    .map(r => r.toString())
    .join(" ") || "None";

  const members = await interaction.guild!.members.fetch();
  const sorted = Array.from(members.values()).sort((a, b) => a.joinedTimestamp! - b.joinedTimestamp!);
  const joinNumber = sorted.findIndex(m => m.id === target.id) + 1;

  const embed = new EmbedBuilder()
    .setColor(target.displayColor || 0x5865F2)
    .setTitle(target.user.tag)
    .setThumbnail(target.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "User ID", value: target.id, inline: true },
      { name: "Nickname", value: target.nickname || "None", inline: true },
      { name: "Account Created", value: target.user.createdAt.toDateString(), inline: true },
      { name: "Joined Server", value: target.joinedAt ? target.joinedAt.toDateString() : "Unknown", inline: true },
      { name: "Join Position", value: `#${joinNumber}`, inline: true },
      { name: `Roles [${target.roles.cache.size - 1}]`, value: roles.length > 1024 ? "Too many to display" : roles },
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  if (target.premiumSince) {
    embed.addFields({ name: "Boosting Since", value: target.premiumSince.toDateString(), inline: true });
  }

  await interaction.editReply({ embeds: [embed] });
}
