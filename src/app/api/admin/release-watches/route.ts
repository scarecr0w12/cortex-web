import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const watches = await prisma.releaseWatch.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ watches });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { owner, repo, watchType, channelId, guildId } = body;

    if (!owner || !repo || !channelId || !guildId) {
      return Response.json({ error: "owner, repo, channelId, and guildId are required" }, { status: 400 });
    }

    const existing = await prisma.releaseWatch.findUnique({
      where: { owner_repo_guildId: { owner, repo, guildId } },
    });

    if (existing) {
      return Response.json({ error: "This repository is already being watched for this server" }, { status: 409 });
    }

    const watch = await prisma.releaseWatch.create({
      data: {
        owner,
        repo,
        watchType: watchType || "release",
        channelId,
        guildId,
      },
    });

    return Response.json({ watch }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create release watch" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.releaseWatch.delete({ where: { id } });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete release watch" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, isActive } = body;

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    const watch = await prisma.releaseWatch.update({
      where: { id },
      data: { isActive: isActive ?? undefined },
    });

    return Response.json({ watch });
  } catch {
    return Response.json({ error: "Failed to update release watch" }, { status: 400 });
  }
}
