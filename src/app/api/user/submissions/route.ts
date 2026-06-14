import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [plugins, agents] = await Promise.all([
    prisma.plugin.findMany({
      where: { userId: user.userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.agentConfig.findMany({
      where: { userId: user.userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return Response.json({
    plugins: plugins.map((p) => ({
      ...p,
      capabilities: JSON.parse(p.capabilities || "[]"),
      category: p.category?.name || null,
    })),
    agents: agents.map((a) => ({
      ...a,
      tools: JSON.parse(a.tools || "[]"),
      tags: JSON.parse(a.tags || "[]"),
      category: a.category?.name || null,
    })),
  });
}
