import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";
import { sendBlogWebhook } from "@/lib/discord-webhook";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const webhookConfigured = !!process.env.DISCORD_BLOG_WEBHOOK_URL;
  return Response.json({ configured: webhookConfigured });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return Response.json({ error: "Post slug is required" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      return Response.json({ error: "Blog post not found" }, { status: 404 });
    }

    const webhookUrl = process.env.DISCORD_BLOG_WEBHOOK_URL;
    if (!webhookUrl) {
      return Response.json({ error: "No Discord blog webhook URL configured (DISCORD_BLOG_WEBHOOK_URL)" }, { status: 400 });
    }

    let tags: string[] = [];
    try {
      tags = JSON.parse(post.tags);
      if (!Array.isArray(tags)) tags = [];
    } catch {
      tags = [];
    }

    sendBlogWebhook(
      post.title,
      post.slug,
      post.excerpt,
      post.coverImage,
      tags,
      post.author?.displayName || post.author?.username || null,
    );

    return Response.json({
      success: true,
      message: `Blog post "${post.title}" sent to Discord.`,
    });
  } catch (error) {
    console.error("Failed to post blog to Discord:", error);
    return Response.json(
      { error: "Failed to post to Discord: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    );
  }
}
