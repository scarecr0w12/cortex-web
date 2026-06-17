import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
  const guildId = searchParams.get("guildId") || undefined;
  const actionType = searchParams.get("actionType") || undefined;
  const targetId = searchParams.get("targetId") || undefined;
  const moderatorId = searchParams.get("moderatorId") || undefined;

  const where: Record<string, unknown> = {};
  if (guildId) where.guildId = guildId;
  if (actionType) where.actionType = actionType;
  if (targetId) where.targetId = targetId;
  if (moderatorId) where.moderatorId = moderatorId;

  const [logs, total] = await Promise.all([
    prisma.moderationAction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.moderationAction.count({ where }),
  ]);

  const actionCounts = await prisma.moderationAction.groupBy({
    by: ["actionType"],
    _count: { actionType: true },
  });

  const guildIds = Array.from(new Set(logs.map(l => l.guildId)));
  const guildConfigs = guildIds.length > 0
    ? await prisma.guildConfig.findMany({
        where: { guildId: { in: guildIds } },
        select: { guildId: true, guildName: true },
      })
    : [];

  const guildNames: Record<string, string> = {};
  for (const gc of guildConfigs) {
    guildNames[gc.guildId] = gc.guildName || gc.guildId;
  }

  return Response.json({
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    actionCounts: actionCounts.reduce((acc: Record<string, number>, c) => {
      acc[c.actionType] = c._count.actionType;
      return acc;
    }, {}),
    guildNames,
  });
}
