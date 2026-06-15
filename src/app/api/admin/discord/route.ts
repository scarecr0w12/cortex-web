import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";
import { execSync } from "child_process";

const DISCORD_KEYS = [
  "discord_client_id",
  "discord_client_secret",
  "discord_bot_token",
  "discord_guild_id",
  "discord_webhook_url",
  "discord_admin_ids",
] as const;

async function getSettings() {
  const dbSettings = await prisma.setting.findMany({
    where: { key: { in: DISCORD_KEYS as unknown as string[] } },
  });
  const result: Record<string, string | null> = {};
  for (const s of dbSettings) {
    result[s.key] = s.value;
  }
  for (const key of DISCORD_KEYS) {
    if (!(key in result)) result[key] = null;
  }
  result._env_discord_client_id = process.env.DISCORD_CLIENT_ID ? "set" : "not set";
  result._env_discord_client_secret = process.env.DISCORD_CLIENT_SECRET ? "set" : "not set";
  result._env_discord_bot_token = process.env.DISCORD_BOT_TOKEN ? "set" : "not set";
  result._env_discord_guild_id = process.env.DISCORD_GUILD_ID ? "set" : "not set";
  result._env_discord_webhook_url = process.env.DISCORD_SUBMISSION_WEBHOOK_URL ? "set" : "not set";
  result._env_discord_admin_ids = process.env.DISCORD_ADMIN_IDS ? "set" : "not set";

  const heartbeat = await prisma.setting.findUnique({ where: { key: "discord_bot_heartbeat" } });
  const lastHeartbeat = heartbeat?.value ? parseInt(heartbeat.value) : null;
  const now = Date.now();
  result._bot_online = lastHeartbeat && now - lastHeartbeat < 60000 ? "true" : "false";
  result._bot_last_heartbeat = lastHeartbeat ? new Date(lastHeartbeat).toISOString() : null;

  const startedAt = await prisma.setting.findUnique({ where: { key: "discord_bot_started_at" } });
  result._bot_started_at = startedAt?.value || null;
  if (result._bot_started_at) {
    const elapsed = Math.floor((now - parseInt(result._bot_started_at)) / 1000);
    result._bot_uptime_seconds = String(elapsed);
  }

  const cmdCounts = await prisma.setting.findUnique({ where: { key: "discord_bot_command_counts" } });
  result._bot_command_counts = cmdCounts?.value || null;

  return result;
}

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }
  const settings = await getSettings();
  return Response.json({ settings });
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string" || !DISCORD_KEYS.includes(key as typeof DISCORD_KEYS[number])) {
      return Response.json({ error: "Invalid or missing key: " + String(key) }, { status: 400 });
    }

    if (value === null || value === "") {
      await prisma.setting.delete({ where: { key } }).catch(() => {});
      return Response.json({ success: true, message: "Setting cleared" });
    }

    if (typeof value !== "string") {
      return Response.json({ error: "Value must be a string" }, { status: 400 });
    }

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to update Discord setting:", error);
    return Response.json({ error: "Failed to update setting: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 400 });
  }
}

function runSystemCtl(action: string): { success: boolean; message: string } {
  try {
    execSync(`systemctl ${action} cortex-discord-bot`, { timeout: 10000 });
    return { success: true, message: `Bot ${action}ed successfully` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { success: false, message: `Failed to ${action} bot: ${msg}` };
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "start-bot") {
      const result = runSystemCtl("start");
      return Response.json(result, { status: result.success ? 200 : 500 });
    }

    if (action === "stop-bot") {
      const result = runSystemCtl("stop");
      return Response.json(result, { status: result.success ? 200 : 500 });
    }

    if (action === "restart-bot") {
      const result = runSystemCtl("restart");
      return Response.json(result, { status: result.success ? 200 : 500 });
    }

    if (action === "register-commands") {
      try {
        const botToken = process.env.DISCORD_BOT_TOKEN ||
          (await prisma.setting.findUnique({ where: { key: "discord_bot_token" } }))?.value;
        if (!botToken) {
          return Response.json({ error: "No bot token configured" }, { status: 400 });
        }
        execSync("npx tsx src/deploy-commands.ts", {
          cwd: "/root/cortex-web/discord-bot",
          timeout: 15000,
          env: { ...process.env, DISCORD_BOT_TOKEN: botToken },
        });
        return Response.json({ success: true, message: "Commands registered successfully" });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return Response.json({ error: "Failed to register commands: " + msg }, { status: 500 });
      }
    }

    if (action === "test-webhook") {
      const webhookUrl =
        (await prisma.setting.findUnique({ where: { key: "discord_webhook_url" } }))?.value ||
        process.env.DISCORD_SUBMISSION_WEBHOOK_URL;

      if (!webhookUrl) {
        return Response.json({ error: "No webhook URL configured" }, { status: 400 });
      }

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "✅ Discord webhook test from CortexPrism admin panel" }),
      });

      if (res.ok) {
        return Response.json({ success: true, message: "Webhook test sent successfully" });
      }
      const errText = await res.text().catch(() => "unknown");
      return Response.json({ error: `Webhook test failed (HTTP ${res.status}): ${errText}` }, { status: 400 });
    }

    if (action === "ping-bot") {
      const heartbeat = await prisma.setting.findUnique({ where: { key: "discord_bot_heartbeat" } });
      const lastHeartbeat = heartbeat?.value ? parseInt(heartbeat.value) : null;
      const now = Date.now();
      const online = lastHeartbeat && now - lastHeartbeat < 60000;

      return Response.json({
        online: !!online,
        lastHeartbeat: lastHeartbeat ? new Date(lastHeartbeat).toISOString() : null,
        secondsSinceHeartbeat: lastHeartbeat ? Math.floor((now - lastHeartbeat) / 1000) : null,
      });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return Response.json({ error: "Failed to process action" }, { status: 400 });
  }
}
