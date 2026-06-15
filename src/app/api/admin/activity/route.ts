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

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count(),
  ]);

  return Response.json({
    logs: logs.map((l) => ({
      ...l,
      metadata: l.metadata ? JSON.parse(l.metadata) : null,
      user: l.user?.username || null,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
