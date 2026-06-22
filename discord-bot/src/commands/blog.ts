import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { prisma } from "../index";
import { isModerator } from "../lib/moderation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cortexprism.io";

function truncate(str: string | null, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len - 3) + "..." : str;
}

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getOrCreateConfig(guildId: string, guildName: string) {
  let config = await prisma.guildConfig.findUnique({ where: { guildId } });
  if (!config) {
    config = await prisma.guildConfig.create({ data: { guildId, guildName } });
  }
  return config;
}

export async function handleBlogPost(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to post blog announcements.", ephemeral: true });
    return;
  }

  const slug = interaction.options.get("slug")?.value as string | undefined;
  if (!slug) {
    await interaction.reply({ content: "Please provide a blog post slug.", ephemeral: true });
    return;
  }

  const config = await getOrCreateConfig(interaction.guildId!, interaction.guild.name);

  const targetChannelId = interaction.options.get("channel")?.value as string | undefined || config.blogChannelId;

  if (!targetChannelId) {
    await interaction.reply({
      content: "No blog channel configured. Use `/blog channel set` first, or specify a channel with the `channel` option.",
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      await interaction.editReply({ content: `Blog post with slug "${slug}" not found.` });
      return;
    }

    const channel = await interaction.guild.channels.fetch(targetChannelId).catch(() => null);
    if (!channel || !channel.isTextBased()) {
      await interaction.editReply({ content: `Could not find text channel <#${targetChannelId}>.` });
      return;
    }

    const textChannel = channel as unknown as TextChannel;

    const tags = parseTags(post.tags);
    const tagText = tags.length > 0 ? tags.map(t => `\`${t}\``).join(" ") : null;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(post.title)
      .setURL(`${SITE_URL}/blog/${post.slug}`)
      .setDescription(truncate(post.excerpt, 500) || "Read the full post on the CortexPrism blog.")
      .setTimestamp(post.publishedAt || new Date())
      .setFooter({ text: "CortexPrism Blog" });

    if (post.coverImage) {
      embed.setImage(post.coverImage);
    }

    if (post.author) {
      embed.setAuthor({
        name: post.author.displayName || post.author.username,
        iconURL: post.author.avatar || undefined,
      });
    }

    if (tagText) {
      embed.addFields({ name: "Tags", value: tagText, inline: false });
    }

    await textChannel.send({ embeds: [embed] });
    await interaction.editReply({ content: `Blog post "${post.title}" posted to <#${targetChannelId}>.` });
  } catch (err) {
    console.error("Blog post command error:", err);
    await interaction.editReply({ content: "Failed to post blog to Discord. Check the logs." });
  }
}

export async function handleBlogChannelView(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to manage blog settings.", ephemeral: true });
    return;
  }

  const config = await getOrCreateConfig(interaction.guildId!, interaction.guild.name);

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("Blog Channel Configuration")
    .addFields({
      name: "Blog Channel",
      value: config.blogChannelId ? `<#${config.blogChannelId}>` : "Not set",
      inline: false,
    })
    .setFooter({ text: "Use /blog channel set to configure." })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function handleBlogChannelSet(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to manage blog settings.", ephemeral: true });
    return;
  }

  const channel = interaction.options.get("channel")?.channel;
  if (!channel) {
    await interaction.reply({ content: "Please specify a channel.", ephemeral: true });
    return;
  }

  if (channel.type !== 0 && channel.type !== 5) {
    await interaction.reply({ content: "Please select a text-based channel.", ephemeral: true });
    return;
  }

  await prisma.guildConfig.upsert({
    where: { guildId: interaction.guildId! },
    update: { blogChannelId: channel.id, guildName: interaction.guild.name },
    create: { guildId: interaction.guildId!, blogChannelId: channel.id, guildName: interaction.guild.name },
  });

  await interaction.reply({ content: `Blog channel set to <#${channel.id}>. New blog posts will be announced here.`, ephemeral: true });
}

export async function handleBlogChannelClear(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to manage blog settings.", ephemeral: true });
    return;
  }

  await prisma.guildConfig.upsert({
    where: { guildId: interaction.guildId! },
    update: { blogChannelId: null, guildName: interaction.guild.name },
    create: { guildId: interaction.guildId!, guildName: interaction.guild.name },
  });

  await interaction.reply({ content: "Blog channel cleared. Blog announcements will no longer be posted.", ephemeral: true });
}
