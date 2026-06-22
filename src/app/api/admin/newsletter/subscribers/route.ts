import { NextRequest } from "next/server";
import { z } from "zod";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  const where: Record<string, unknown> = {};
  if (search) where.email = { contains: search };
  if (status && ["pending", "active", "unsubscribed"].includes(status)) where.status = status;

  const [subscribers, total] = await Promise.all([
    prisma.newsletterSubscription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.newsletterSubscription.count({ where }),
  ]);

  return Response.json({
    subscribers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function DELETE(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser || !requireAdmin(authUser)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: "Subscriber ID is required" }, { status: 400 });
    }

    const sub = await prisma.newsletterSubscription.findUnique({ where: { id } });
    await prisma.newsletterSubscription.delete({ where: { id } });

    await createAuditLog({
      userId: authUser.userId,
      action: "newsletter_subscriber_deleted",
      entity: "NewsletterSubscription",
      entityId: id,
      metadata: sub ? { email: sub.email, status: sub.status } : undefined,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}

const ImportSchema = z.object({
  emails: z.array(z.string().email()).min(1).max(5000),
  status: z.enum(["active", "pending"]).default("active"),
});

export async function POST(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser || !requireAdmin(authUser)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { emails, status } = ImportSchema.parse(body);

    const normalized = Array.from(new Set(emails.map((e) => e.toLowerCase().trim())));

    let created = 0;
    let skipped = 0;

    for (const email of normalized) {
      const existing = await prisma.newsletterSubscription.findUnique({
        where: { email },
      });

      if (existing) {
        if (existing.status === "unsubscribed") {
          await prisma.newsletterSubscription.update({
            where: { email },
            data: {
              status,
              unsubscribedAt: null,
            },
          });
          created++;
        } else if (existing.status !== status) {
          await prisma.newsletterSubscription.update({
            where: { email },
            data: { status },
          });
          created++;
        } else {
          skipped++;
        }
      } else {
        await prisma.newsletterSubscription.create({
          data: { email, status },
        });
        created++;
      }
    }

    await createAuditLog({
      userId: authUser.userId,
      action: "newsletter_subscribers_imported",
      entity: "NewsletterSubscription",
      metadata: { count: normalized.length, created, skipped },
    });

    return Response.json({ created, skipped, total: normalized.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("[newsletter] Import failed:", error);
    return Response.json({ error: "Failed to import subscribers" }, { status: 500 });
  }
}
