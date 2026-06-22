import { NextRequest } from "next/server";
import { z } from "zod";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

const CampaignSchema = z.object({
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(100_000),
});

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  const [campaigns, total] = await Promise.all([
    prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        subject: true,
        status: true,
        sentCount: true,
        sentAt: true,
        createdAt: true,
      },
    }),
    prisma.newsletterCampaign.count(),
  ]);

  return Response.json({
    campaigns,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || !requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = CampaignSchema.parse(body);

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject: data.subject,
        content: data.content,
        status: "draft",
      },
    });

    await createAuditLog({
      userId: user.userId,
      action: "newsletter_campaign_created",
      entity: "NewsletterCampaign",
      entityId: campaign.id,
      metadata: { subject: data.subject },
    });

    return Response.json({ campaign }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
