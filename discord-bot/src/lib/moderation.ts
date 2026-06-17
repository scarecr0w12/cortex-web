import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  TextChannel,
  User,
} from "discord.js";
import { prisma } from "../index";

const ADMIN_IDS = (process.env.DISCORD_ADMIN_IDS || "").split(",").filter(Boolean);

export async function isAdmin(interaction: ChatInputCommandInteraction): Promise<{ authorized: boolean; websiteUserId?: string }> {
  const websiteUser = await prisma.user.findUnique({
    where: { discordId: interaction.user.id },
    select: { id: true, role: true },
  });
  const authorized = ADMIN_IDS.includes(interaction.user.id) || websiteUser?.role === "admin";
  return { authorized, websiteUserId: websiteUser?.id };
}

export async function isModerator(interaction: ChatInputCommandInteraction, guild: Guild): Promise<{ authorized: boolean; websiteUserId?: string }> {
  const { authorized, websiteUserId } = await isAdmin(interaction);
  if (authorized) return { authorized, websiteUserId };

  const member = await guild.members.fetch(interaction.user.id).catch(() => null);
  if (!member) return { authorized: false };

  const guildConfig = await prisma.guildConfig.findUnique({ where: { guildId: guild.id } });
  const modRoleId = guildConfig?.modRoleId;
  const adminRoleId = guildConfig?.adminRoleId;

  if (adminRoleId && member.roles.cache.has(adminRoleId)) return { authorized: true, websiteUserId };
  if (modRoleId && member.roles.cache.has(modRoleId)) return { authorized: true, websiteUserId };
  if (member.permissions.has("ModerateMembers")) return { authorized: true, websiteUserId };
  if (member.permissions.has("Administrator")) return { authorized: true, websiteUserId };

  return { authorized: false };
}

export async function logModerationAction(params: {
  guildId: string;
  actionType: string;
  moderatorId: string;
  moderatorTag: string;
  targetId: string;
  targetTag: string;
  reason?: string | null;
  duration?: string | null;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    await prisma.moderationAction.create({
      data: {
        guildId: params.guildId,
        actionType: params.actionType,
        moderatorId: params.moderatorId,
        moderatorTag: params.moderatorTag,
        targetId: params.targetId,
        targetTag: params.targetTag,
        reason: params.reason || null,
        duration: params.duration || null,
        expiresAt: params.expiresAt || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    console.error("Failed to log moderation action:", error);
  }
}

export async function sendLogEmbed(
  guild: Guild,
  embed: EmbedBuilder,
): Promise<void> {
  try {
    const config = await prisma.guildConfig.findUnique({ where: { guildId: guild.id } });
    if (!config?.logChannelId) return;
    const channel = await guild.channels.fetch(config.logChannelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return;
    await (channel as TextChannel).send({ embeds: [embed] });
  } catch (error) {
    console.error("Failed to send log embed:", error);
  }
}

export function buildModLogEmbed(params: {
  actionType: string;
  moderator: User | GuildMember;
  target: User | GuildMember;
  reason?: string | null;
  duration?: string | null;
  color: number;
}): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(params.color)
    .setTitle(params.actionType.toUpperCase())
    .addFields(
      { name: "Moderator", value: `${params.moderator} (\`${params.moderator.id}\`)`, inline: true },
      { name: "Target", value: `${params.target} (\`${params.target.id}\`)`, inline: true },
    )
    .setTimestamp();

  if (params.reason) {
    embed.addFields({ name: "Reason", value: params.reason });
  }
  if (params.duration) {
    embed.addFields({ name: "Duration", value: params.duration, inline: true });
  }

  return embed;
}

export async function getOrCreateGuildConfig(guildId: string, guildName?: string) {
  return prisma.guildConfig.upsert({
    where: { guildId },
    update: guildName ? { guildName } : {},
    create: { guildId, guildName: guildName || null },
  });
}

export function formatDuration(ms: number): string {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  return parts.join(" ") || "0s";
}

export function parseDuration(input: string): number | null {
  const regex = /(\d+)\s*(d|h|m|s|day|days|hour|hours|min|mins|minute|minutes|sec|secs|second|seconds)/i;
  const match = input.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    d: 86400000, day: 86400000, days: 86400000,
    h: 3600000, hour: 3600000, hours: 3600000,
    m: 60000, min: 60000, mins: 60000, minute: 60000, minutes: 60000,
    s: 1000, sec: 1000, secs: 1000, second: 1000, seconds: 1000,
  };

  const multiplier = multipliers[unit];
  if (!multiplier) return null;
  return value * multiplier;
}
