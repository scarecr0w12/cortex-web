import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TrackViewSchema = z.object({
  slug: z.string().min(1),
});

const DEDUP_WINDOW_MS = 30 * 60 * 1000;

function parseBlogViewsCookie(cookie: string | null): Record<string, number> {
  if (!cookie) return {};
  try {
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = TrackViewSchema.parse(body);

    const cookie = request.cookies.get("blog_views")?.value ?? null;
    const views = parseBlogViewsCookie(cookie);
    const now = Date.now();

    if (views[slug] && now - views[slug] < DEDUP_WINDOW_MS) {
      return Response.json({ tracked: false });
    }

    await prisma.blogPost.updateMany({
      where: { slug, published: true },
      data: { viewCount: { increment: 1 } },
    });

    views[slug] = now;

    const cleaned: Record<string, number> = {};
    for (const [key, ts] of Object.entries(views)) {
      if (now - ts < DEDUP_WINDOW_MS) {
        cleaned[key] = ts;
      }
    }

    return Response.json(
      { tracked: true },
      {
        headers: {
          "Set-Cookie": `blog_views=${encodeURIComponent(JSON.stringify(cleaned))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid slug" }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
