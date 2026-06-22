import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { prisma } from "../index";

const POLL_INTERVAL_MS = 60 * 1000;

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

async function getOrCreateSetting(key: string, defaultValue: string): Promise<string> {
  const existing = await prisma.setting.findUnique({ where: { key } });
  if (existing?.value) return existing.value;
  try {
    await prisma.setting.create({ data: { key, value: defaultValue } });
  } catch {}
  return defaultValue;
}

async function resolveChannel(client: Client, channelId: string): Promise<TextChannel | null> {
  try {
    const ch = await client.channels.fetch(channelId).catch(() => null);
    if (ch && ch.isTextBased() && !ch.isDMBased()) {
      return ch as TextChannel;
    }
  } catch {}
  return null;
}

export async function checkNewBlogPosts(client: Client): Promise<number> {
  try {
    const lastCheckStr = await getOrCreateSetting("blog_monitor_last_check", new Date(0).toISOString());
    const lastCheck = new Date(lastCheckStr);

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: { gt: lastCheck },
      },
      include: { author: true },
      orderBy: { publishedAt: "asc" },
    });

    if (posts.length === 0) return 0;

    console.log(`Blog monitor: found ${posts.length} new post(s): ${posts.map(p => p.slug).join(", ")}`);

    const guildConfigs = await prisma.guildConfig.findMany({
      where: { blogChannelId: { not: null } },
    });

    console.log(`Blog monitor: ${guildConfigs.length} guild(s) with blog channel configured`);

    let sent = 0;

    for (const post of posts) {
      const tags = parseTags(post.tags);
      const tagText = tags.length > 0 ? tags.map(t => `\`${t}\``).join(" ") : null;

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(post.title)
        .setURL(`${SITE_URL}/blog/${post.slug}`)
        .setDescription(truncate(post.excerpt, 500) || "Read the full post on the CortexPrism blog.")
        .setTimestamp(post.publishedAt!)
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

      for (const config of guildConfigs) {
        const channel = await resolveChannel(client, config.blogChannelId!);
        if (channel) {
          await channel.send({ embeds: [embed] }).catch((e) => console.error("Blog monitor: send error:", e));
          sent++;
          console.log(`Blog monitor: posted "${post.slug}" to guild ${config.guildId} channel ${config.blogChannelId}`);
        } else {
          console.error(`Blog monitor: could not resolve channel ${config.blogChannelId} for guild ${config.guildId}`);
        }
      }
    }

    const latestPublishedAt = posts.reduce((max, p) => {
      const ts = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
      return ts > max ? ts : max;
    }, 0);
    const newCheck = latestPublishedAt > 0 ? new Date(latestPublishedAt) : new Date();
    await prisma.setting.upsert({
      where: { key: "blog_monitor_last_check" },
      update: { value: newCheck.toISOString() },
      create: { key: "blog_monitor_last_check", value: newCheck.toISOString() },
    });

    console.log(`Blog monitor: sent ${sent} message(s) total, updated last check to ${newCheck.toISOString()}`);
    return sent;
  } catch (err) {
    console.error("Blog monitor poll error:", err);
    return 0;
  }
}

let pollTimeout: ReturnType<typeof setTimeout> | null = null;

export async function startBlogMonitor(client: Client) {
  console.log("Starting blog post monitor (polling every 1 minute)...");

  const poll = async () => {
    try {
      await checkNewBlogPosts(client);
    } catch (err) {
      console.error("Blog monitor poll error:", err);
    }
    pollTimeout = setTimeout(poll, POLL_INTERVAL_MS);
  };

  poll();
}

export function stopBlogMonitor() {
  if (pollTimeout) {
    clearTimeout(pollTimeout);
    pollTimeout = null;
  }
}
