import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";

  const plugins = await prisma.plugin.findMany({
    where: { status },
    include: { category: true, user: { select: { id: true, username: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    plugins: plugins.map((p) => ({
      ...p,
      capabilities: JSON.parse(p.capabilities || "[]"),
      category: p.category?.name || null,
    })),
  });
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, action, notes } = body;

    if (!id || !["approved", "rejected"].includes(action)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const plugin = await prisma.plugin.update({
      where: { id },
      data: { status: action === "approved" ? "approved" : "rejected" },
    });

    await prisma.submissionReview.create({
      data: {
        pluginId: id,
        reviewerId: user!.userId,
        action,
        notes: notes || null,
      },
    });

    return Response.json({ plugin });
  } catch {
    return Response.json({ error: "Plugin not found or invalid data" }, { status: 404 });
  }
}
