import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const guildId = searchParams.get("guildId") || undefined;

  if (guildId) {
    const config = await prisma.guildConfig.findUnique({ where: { guildId } });
    if (!config) {
      return Response.json({ error: "Guild not found" }, { status: 404 });
    }
    const modCount = await prisma.moderationAction.count({ where: { guildId } });
    return Response.json({ config, moderationCount: modCount });
  }

  const configs = await prisma.guildConfig.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const configsWithCounts = await Promise.all(
    configs.map(async (config) => {
      const modCount = await prisma.moderationAction.count({
        where: { guildId: config.guildId },
      });
      return { ...config, moderationCount: modCount };
    }),
  );

  return Response.json({ guilds: configsWithCounts });
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { guildId, key, value } = body;

    if (!guildId || !key) {
      return Response.json({ error: "guildId and key are required" }, { status: 400 });
    }

    const allowedKeys = [
      "logChannelId", "modRoleId", "adminRoleId", "muteRoleId",
      "autoModEnabled", "welcomeEnabled", "welcomeMessage", "welcomeChannelId",
      "leaveEnabled", "leaveMessage", "leaveChannelId",
      "slowmodeDefault", "maxWarnsBeforeBan",
    ];

    if (!allowedKeys.includes(key)) {
      return Response.json({ error: `Invalid key: ${key}` }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (value === null || value === "") {
      data[key] = null;
    } else {
      const boolKeys = ["autoModEnabled", "welcomeEnabled", "leaveEnabled"];
      const numKeys = ["slowmodeDefault", "maxWarnsBeforeBan"];
      if (boolKeys.includes(key)) {
        data[key] = value === true || value === "true";
      } else if (numKeys.includes(key)) {
        data[key] = parseInt(value as string);
      } else {
        data[key] = value;
      }
    }

    const config = await prisma.guildConfig.update({
      where: { guildId },
      data,
    });

    return Response.json({ success: true, config });
  } catch (error) {
    console.error("Failed to update guild config:", error);
    return Response.json({ error: "Failed to update guild config" }, { status: 400 });
  }
}
