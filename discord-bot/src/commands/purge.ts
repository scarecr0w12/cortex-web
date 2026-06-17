import { ChatInputCommandInteraction, Collection, EmbedBuilder, GuildMember, Message, TextChannel } from "discord.js";
import { isModerator, logModerationAction, sendLogEmbed } from "../lib/moderation";

export async function handlePurge(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    return;
  }

  const count = (interaction.options.get("count")?.value as number) || 10;
  const target = interaction.options.getMember("user") as GuildMember | null;

  if (count < 1 || count > 100) {
    await interaction.reply({ content: "Count must be between 1 and 100.", ephemeral: true });
    return;
  }

  const channel = interaction.channel as TextChannel;
  if (!channel) {
    await interaction.reply({ content: "Could not access this channel.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    let messages;
    if (target) {
      const allMessages = await channel.messages.fetch({ limit: 100 });
      const byAuthor = Array.from(allMessages.values()).filter(m => m.author.id === target.id);
      messages = new Collection<string, Message>();
      for (const m of byAuthor.slice(0, count)) {
        messages.set(m.id, m);
      }
    } else {
      messages = await channel.messages.fetch({ limit: count });
    }

    const filtered = Array.from(messages.values()).filter(m => (Date.now() - m.createdTimestamp) < 1209600000); // 14 days
    const filteredCollection = new Collection<string, Message>();
    for (const m of filtered) {
      filteredCollection.set(m.id, m);
    }

    if (filtered.length === 0) {
      await interaction.editReply({ content: "No messages found to delete (messages must be less than 14 days old)." });
      return;
    }

    const deleted = await channel.bulkDelete(filteredCollection, true);

    await logModerationAction({
      guildId: interaction.guildId!,
      actionType: "purge",
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      targetId: target?.id || channel.id,
      targetTag: target?.user.tag || `#${channel.name}`,
      metadata: { count: deleted.size, requested: count, filteredByUser: !!target },
    });

    const logEmbed = new EmbedBuilder()
      .setColor(0x8B5CF6)
      .setTitle("PURGE")
      .addFields(
        { name: "Moderator", value: `${interaction.user} (\`${interaction.user.id}\`)`, inline: true },
        { name: "Channel", value: `${channel}`, inline: true },
        { name: "Messages Deleted", value: String(deleted.size), inline: true },
      );
    if (target) {
      logEmbed.addFields({ name: "Filtered by User", value: `${target.user.tag}`, inline: true });
    }

    await sendLogEmbed(interaction.guild, logEmbed);

    await interaction.editReply({
      content: `✅ Deleted **${deleted.size}** message(s)${target ? ` from ${target.user.tag}` : ""} in ${channel}.`,
    });
  } catch (error) {
    console.error("Purge error:", error);
    await interaction.editReply({ content: "An error occurred while purging messages." });
  }
}
