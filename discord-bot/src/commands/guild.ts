import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { prisma } from "../index";
import { isModerator } from "../lib/moderation";

export async function handleGuildInfo(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  const guild = interaction.guild;
  const owner = await guild.fetchOwner();
  const roles = guild.roles.cache;
  const channels = guild.channels.cache;
  const emojis = guild.emojis.cache;

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(guild.name)
    .setThumbnail(guild.iconURL({ size: 256 }))
    .addFields(
      { name: "Server ID", value: guild.id, inline: true },
      { name: "Owner", value: `${owner.user.tag}`, inline: true },
      { name: "Created", value: guild.createdAt.toDateString(), inline: true },
      { name: "Members", value: String(guild.memberCount), inline: true },
      { name: "Roles", value: String(roles.size), inline: true },
      { name: "Channels", value: `${channels.filter(c => c.type === 0).size} text / ${channels.filter(c => c.type === 2).size} voice`, inline: true },
      { name: "Emojis", value: `${emojis.size} (${emojis.filter(e => e.animated).size} animated)`, inline: true },
      { name: "Boost Tier", value: guild.premiumTier ? `Tier ${guild.premiumTier}` : "None", inline: true },
      { name: "Boost Count", value: String(guild.premiumSubscriptionCount || 0), inline: true },
      { name: "Verification Level", value: String(guild.verificationLevel), inline: true },
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

export async function handleGuildSettings(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  const { authorized } = await isModerator(interaction, interaction.guild);
  if (!authorized) {
    await interaction.reply({ content: "You do not have permission to view guild settings.", ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const subAction = interaction.options.get("action")?.value as string;

  if (subAction === "view") {
    let config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guildId! } });
    if (!config) {
      config = await prisma.guildConfig.create({ data: { guildId: interaction.guildId!, guildName: interaction.guild.name } });
    }

    const logChannel = config.logChannelId ? `<#${config.logChannelId}>` : "Not set";
    const modRole = config.modRoleId ? `<@&${config.modRoleId}>` : "Not set";
    const adminRole = config.adminRoleId ? `<@&${config.adminRoleId}>` : "Not set";

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`Guild Settings — ${interaction.guild.name}`)
      .addFields(
        { name: "Log Channel", value: logChannel, inline: true },
        { name: "Mod Role", value: modRole, inline: true },
        { name: "Admin Role", value: adminRole, inline: true },
        { name: "Max Warns Before Ban", value: String(config.maxWarnsBeforeBan), inline: true },
        { name: "Default Slowmode", value: config.slowmodeDefault > 0 ? `${config.slowmodeDefault}s` : "Off", inline: true },
        { name: "Auto Mod", value: config.autoModEnabled ? "Enabled" : "Disabled", inline: true },
        { name: "Welcome Messages", value: config.welcomeEnabled ? "Enabled" : "Disabled", inline: true },
        { name: "Leave Messages", value: config.leaveEnabled ? "Enabled" : "Disabled", inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
    return;
  }

  if (subAction === "set") {
    const key = interaction.options.get("key")?.value as string | undefined;
    const value = interaction.options.get("value")?.value as string | undefined;

    if (!key || value === undefined) {
      await interaction.editReply({ content: "Please provide both a key and value." });
      return;
    }

    const allowedKeys = ["log_channel", "mod_role", "admin_role", "max_warns", "slowmode", "auto_mod", "welcome", "leave"];
    if (!allowedKeys.includes(key)) {
      await interaction.editReply({ content: `Invalid key. Allowed: ${allowedKeys.join(", ")}` });
      return;
    }

    const dbKeyMap: Record<string, string> = {
      log_channel: "logChannelId",
      mod_role: "modRoleId",
      admin_role: "adminRoleId",
      max_warns: "maxWarnsBeforeBan",
      slowmode: "slowmodeDefault",
      auto_mod: "autoModEnabled",
      welcome: "welcomeEnabled",
      leave: "leaveEnabled",
    };

    const dbKey = dbKeyMap[key];

    let dbValue: unknown = value;
    if (key === "max_warns" || key === "slowmode") {
      dbValue = parseInt(value);
      if (isNaN(dbValue as number)) {
        await interaction.editReply({ content: "Value must be a number." });
        return;
      }
    } else if (key === "auto_mod" || key === "welcome" || key === "leave") {
      dbValue = value === "true" || value === "on" || value === "1";
    }

    await prisma.guildConfig.upsert({
      where: { guildId: interaction.guildId! },
      update: { [dbKey]: dbValue, guildName: interaction.guild.name },
      create: { guildId: interaction.guildId!, guildName: interaction.guild.name, [dbKey]: dbValue },
    });

    await interaction.editReply({ content: `✅ Guild setting \`${key}\` updated to \`${value}\`.` });
  }
}
