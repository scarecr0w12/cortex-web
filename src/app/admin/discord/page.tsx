"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Save, CheckCircle, XCircle, Eye, EyeOff, ExternalLink, RefreshCw, Send, MessageSquare,
  Bot, Shield, Settings as SettingsIcon, Bell, Globe, Play, Square, RotateCw, BarChart3,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/shared/Button";

interface DiscordSettings {
  discord_client_id: string | null;
  discord_client_secret: string | null;
  discord_bot_token: string | null;
  discord_guild_id: string | null;
  discord_webhook_url: string | null;
  discord_admin_ids: string | null;
  _env_discord_client_id: string;
  _env_discord_client_secret: string;
  _env_discord_bot_token: string;
  _env_discord_guild_id: string;
  _env_discord_webhook_url: string;
  _env_discord_admin_ids: string;
  _bot_online: string;
  _bot_last_heartbeat: string | null;
  _bot_started_at: string | null;
  _bot_uptime_seconds: string | null;
  _bot_command_counts: string | null;
}

export default function AdminDiscordPage() {
  const [settings, setSettings] = useState<DiscordSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [controlling, setControlling] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});

  const authHeaders = useCallback(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return t ? { authorization: `Bearer ${t}` } : {};
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchSettings = async () => {
    const headers = authHeaders();
    if (!headers.authorization) { setLoading(false); return; }
    try {
      const res = await fetch("/api/admin/discord", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const s = data.settings as DiscordSettings;
      setSettings(s);
      setFormValues({
        discord_client_id: s.discord_client_id || "",
        discord_client_secret: s.discord_client_secret || "",
        discord_bot_token: s.discord_bot_token || "",
        discord_guild_id: s.discord_guild_id || "",
        discord_webhook_url: s.discord_webhook_url || "",
        discord_admin_ids: s.discord_admin_ids || "",
      });
    } catch (e) {
      showMsg("error", "Failed to load: " + (e as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveSetting = async (key: string) => {
    const headers = authHeaders();
    if (!headers.authorization) { showMsg("error", "Not authenticated"); return; }
    setSaving(key);
    try {
      const value = formValues[key];
      const res = await fetch("/api/admin/discord", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ key, value: value || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showMsg("success", key.replace("discord_", "").replace(/_/g, " ") + " saved");
        if (settings) {
          setSettings({ ...settings, [key]: value || null });
        }
      } else {
        showMsg("error", data.error || "Save failed (HTTP " + res.status + ")");
      }
    } catch (e) {
      showMsg("error", "Connection error: " + (e as Error).message);
    }
    setSaving(null);
  };

  const postAction = async (action: string) => {
    const headers = authHeaders();
    if (!headers.authorization) return;
    setControlling(action);
    try {
      const res = await fetch("/api/admin/discord", {
        method: "POST", headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      showMsg(res.ok ? "success" : "error", data.message || data.error || (res.ok ? "Done" : "Failed"));
      setTimeout(fetchSettings, 2000);
    } catch {
      showMsg("error", "Connection error");
    }
    setControlling(null);
  };

  const inputClass = "w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50";
  const labelClass = "block text-sm text-[#e2e2ea] mb-1.5";

  function renderConfigField(key: string, label: string, placeholder: string, secret?: boolean, helpText?: string, docLink?: string) {
    return (
      <div className="mb-4" key={key}>
        <label className={labelClass}>{label}</label>
        <div className="relative">
          <input
            type={secret && !showFields[key] ? "password" : "text"}
            value={formValues[key] || ""}
            onChange={e => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
            className={inputClass + (secret ? " pr-10 font-mono text-xs" : "")}
            placeholder={placeholder}
          />
          {secret && (
            <button
              onClick={() => setShowFields(prev => ({ ...prev, [key]: !prev[key] }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#e2e2ea]"
            >
              {showFields[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {helpText && <p className="text-xs text-[#55556a] mt-1">{helpText}</p>}
        {docLink && (
          <a href={docLink} target="_blank" rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-0.5 mt-1">
            {docLink} <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <div className="flex justify-end mt-2">
          <Button size="sm" onClick={() => saveSetting(key)} disabled={saving === key}>
            <Save className="w-3.5 h-3.5 mr-1" /> {saving === key ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  function statusBadge(configured: boolean) {
    return (
      <span className={"inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full " + (configured
        ? "bg-green-500/10 text-green-400 border border-green-500/20"
        : "bg-red-500/10 text-red-400 border border-red-500/20")}>
        {configured ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {configured ? "Configured" : "Not set"}
      </span>
    );
  }

  function sectionHeader(icon: React.ReactNode, title: string, description: string) {
    return (
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-indigo-500/10 shrink-0">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-[#e2e2ea]">{title}</h2>
          <p className="text-xs text-[#55556a]">{description}</p>
        </div>
      </div>
    );
  }

  function formatUptime(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts: string[] = [];
    if (d > 0) parts.push(d + "d");
    if (h > 0) parts.push(h + "h");
    if (m > 0) parts.push(m + "m");
    parts.push(s + "s");
    return parts.join(" ");
  }

  const isOnline = settings?._bot_online === "true";
  const uptimeSeconds = settings?._bot_uptime_seconds ? parseInt(settings._bot_uptime_seconds) : 0;
  let commandCounts: Record<string, number> = {};
  try {
    if (settings?._bot_command_counts) {
      commandCounts = JSON.parse(settings._bot_command_counts);
    }
  } catch {}

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8"><div className="text-center py-12 text-[#55556a]">Loading...</div></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e2ea]">Discord Bot</h1>
        <p className="text-[#9090a8] text-sm">Manage Discord integration, bot configuration, and OAuth settings</p>
      </div>

      {message && (
        <div className={"mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 " + (message.type === "success"
          ? "bg-green-500/10 text-green-300 border border-green-500/20"
          : "bg-red-500/10 text-red-300 border border-red-500/20")}>
          {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Bot Status + Control */}
        <div className="glass-card p-6">
          {sectionHeader(
            <Bot className="w-5 h-5 text-indigo-400" />,
            "Bot Status",
            "Current status of the Discord bot service",
          )}

          <div className="flex items-center justify-between p-4 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)] mb-4">
            <div className="flex items-center gap-3">
              <div className={"w-3 h-3 rounded-full " + (isOnline ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-red-500")} />
              <div>
                <p className="text-sm text-[#e2e2ea] font-medium">{isOnline ? "Online" : "Offline"}</p>
                <p className="text-xs text-[#55556a]">
                  {settings?._bot_last_heartbeat
                    ? "Last heartbeat: " + new Date(settings._bot_last_heartbeat).toLocaleString()
                    : "No heartbeat recorded"}
                </p>
                {isOnline && uptimeSeconds > 0 && (
                  <p className="text-xs text-green-400 mt-0.5">Uptime: {formatUptime(uptimeSeconds)}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => postAction("ping-bot")}>
                <RefreshCw className={"w-3.5 h-3.5 mr-1 " + (controlling === "ping-bot" ? "animate-spin" : "")} /> Refresh
              </Button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => postAction("start-bot")}
              disabled={controlling === "start-bot" || isOnline}
            >
              <Play className="w-3.5 h-3.5 mr-1" /> {controlling === "start-bot" ? "Starting..." : "Start"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => postAction("stop-bot")}
              disabled={controlling === "stop-bot" || !isOnline}
            >
              <Square className="w-3.5 h-3.5 mr-1" /> {controlling === "stop-bot" ? "Stopping..." : "Stop"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => postAction("restart-bot")}
              disabled={controlling === "restart-bot"}
            >
              <RotateCw className={"w-3.5 h-3.5 mr-1 " + (controlling === "restart-bot" ? "animate-spin" : "")} /> Restart
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => postAction("register-commands")}
              disabled={controlling === "register-commands"}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> {controlling === "register-commands" ? "Registering..." : "Register Commands"}
            </Button>
          </div>

          <div className="text-xs text-[#55556a] mt-3">
            {isOnline
              ? "Use Stop/Restart to control the systemd service. Register Commands deploys slash commands to Discord."
              : "Use Start to launch the bot via systemd."}
          </div>
        </div>

        {/* Command Usage */}
        {Object.keys(commandCounts).length > 0 && (
          <div className="glass-card p-6">
            {sectionHeader(
              <BarChart3 className="w-5 h-5 text-indigo-400" />,
              "Command Usage",
              "Slash command invocation counts since last bot start",
            )}
            <div className="space-y-1 text-sm">
              {Object.entries(commandCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([cmd, count]) => (
                  <div key={cmd} className="flex items-center justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                    <code className="text-indigo-400">/{cmd}</code>
                    <span className="text-[#e2e2ea] font-medium">{count} use{count !== 1 ? "s" : ""}</span>
                  </div>
                ))}
              <div className="flex items-center justify-between pt-2 text-xs text-[#55556a]">
                <span>Total</span>
                <span>{Object.values(commandCounts).reduce((a, b) => a + b, 0)} uses</span>
              </div>
            </div>
          </div>
        )}

        {/* OAuth Configuration */}
        <div className="glass-card p-6">
          {sectionHeader(
            <Globe className="w-5 h-5 text-indigo-400" />,
            "OAuth Configuration",
            "Discord OAuth app credentials for Sign in with Discord",
          )}
          {renderConfigField("discord_client_id", "Client ID", "123456789012345678", false,
            "From Discord Developer Portal OAuth2 Client ID",
            "https://discord.com/developers/applications")}
          {renderConfigField("discord_client_secret", "Client Secret", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", true,
            "From Discord Developer Portal OAuth2 Client Secret")}
          <div className="border-t border-[rgba(255,255,255,0.07)] pt-4">
            <h3 className="text-sm font-medium text-[#e2e2ea] mb-2">Configuration Status</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Database Client ID</span>{statusBadge(!!settings?.discord_client_id)}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Database Client Secret</span>{statusBadge(!!settings?.discord_client_secret)}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Environment DISCORD_CLIENT_ID</span>{statusBadge(settings?._env_discord_client_id === "set")}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Environment DISCORD_CLIENT_SECRET</span>{statusBadge(settings?._env_discord_client_secret === "set")}</div>
            </div>
          </div>
        </div>

        {/* Bot Configuration */}
        <div className="glass-card p-6">
          {sectionHeader(
            <SettingsIcon className="w-5 h-5 text-indigo-400" />,
            "Bot Configuration",
            "Discord bot token and guild settings for slash commands",
          )}
          {renderConfigField("discord_bot_token", "Bot Token", "MTJ_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", true,
            "From Discord Developer Portal Bot Token. Required for bot to function.")}
          {renderConfigField("discord_guild_id", "Guild ID", "987654321098765432", false,
            "Guild ID for guild-specific slash command registration (faster updates). Leave empty for global commands.")}
          <div className="border-t border-[rgba(255,255,255,0.07)] pt-4">
            <h3 className="text-sm font-medium text-[#e2e2ea] mb-2">Configuration Status</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Database Bot Token</span>{statusBadge(!!settings?.discord_bot_token)}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Database Guild ID</span>{statusBadge(!!settings?.discord_guild_id)}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Environment DISCORD_BOT_TOKEN</span>{statusBadge(settings?._env_discord_bot_token === "set")}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Environment DISCORD_GUILD_ID</span>{statusBadge(settings?._env_discord_guild_id === "set")}</div>
            </div>
          </div>
        </div>

        {/* Notification Configuration */}
        <div className="glass-card p-6">
          {sectionHeader(
            <Bell className="w-5 h-5 text-indigo-400" />,
            "Submission Notifications",
            "Discord webhook for marketplace submission alerts",
          )}
          {renderConfigField("discord_webhook_url", "Webhook URL", "https://discord.com/api/webhooks/...", false,
            "Channel webhook URL for new plugin/agent submission notifications.",
            "https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks")}
          <div className="flex items-center justify-between p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center gap-2"><Send className="w-4 h-4 text-[#55556a]" /><span className="text-sm text-[#e2e2ea]">Test webhook</span></div>
            <Button variant="outline" size="sm" onClick={() => postAction("test-webhook")} disabled={controlling === "test-webhook"}>
              {controlling === "test-webhook" ? "Sending..." : "Send Test"}
            </Button>
          </div>
          <div className="border-t border-[rgba(255,255,255,0.07)] pt-4 mt-4">
            <h3 className="text-sm font-medium text-[#e2e2ea] mb-2">Configuration Status</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Database Webhook URL</span>{statusBadge(!!settings?.discord_webhook_url)}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Environment DISCORD_SUBMISSION_WEBHOOK_URL</span>{statusBadge(settings?._env_discord_webhook_url === "set")}</div>
            </div>
          </div>
        </div>

        {/* Admin Configuration */}
        <div className="glass-card p-6">
          {sectionHeader(
            <Shield className="w-5 h-5 text-indigo-400" />,
            "Admin Access",
            "Discord user IDs with bot admin permissions for /review commands",
          )}
          {renderConfigField("discord_admin_ids", "Admin User IDs", "123456789012345678, 234567890123456789", false,
            "Comma-separated Discord user IDs. These users can use /review commands in Discord.")}
          <div className="border-t border-[rgba(255,255,255,0.07)] pt-4">
            <h3 className="text-sm font-medium text-[#e2e2ea] mb-2">Configuration Status</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Database Admin IDs</span>{statusBadge(!!settings?.discord_admin_ids)}</div>
              <div className="flex justify-between py-1"><span className="text-[#9090a8]">Environment DISCORD_ADMIN_IDS</span>{statusBadge(settings?._env_discord_admin_ids === "set")}</div>
            </div>
          </div>
        </div>

        {/* Moderation Statistics */}
        <div className="glass-card p-6">
          {sectionHeader(
            <ShieldAlert className="w-5 h-5 text-indigo-400" />,
            "Moderation Overview",
            "Quick stats and link to moderation logs",
          )}
          <div className="flex items-center justify-between p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
            <p className="text-sm text-[#9090a8]">View full moderation history, search by user ID, and filter by action type.</p>
            <a href="/admin/discord/moderation" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
              View Logs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Warn", icon: "⚠️" },
              { label: "Mute", icon: "🔇" },
              { label: "Kick", icon: "👢" },
              { label: "Ban", icon: "🔨" },
              { label: "Unban", icon: "✅" },
              { label: "Purge", icon: "🧹" },
              { label: "Unmute", icon: "🔊" },
              { label: "Modlogs", icon: "📋" },
            ].map(cmd => (
              <div key={cmd.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111118] border border-[rgba(255,255,255,0.07)]">
                <span className="text-sm">{cmd.icon}</span>
                <span className="text-xs text-[#9090a8]">/{cmd.label.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commands Reference */}
        <div className="glass-card p-6">
          {sectionHeader(
            <MessageSquare className="w-5 h-5 text-indigo-400" />,
            "Bot Commands Reference",
            "Available Discord slash commands",
          )}
          <div className="text-sm text-[#55556a] space-y-3">
            <div>
              <h3 className="text-xs font-medium text-[#e2e2ea] mb-1.5">Marketplace</h3>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <code className="text-indigo-400">/stats</code><span>Show marketplace statistics</span>
                <code className="text-indigo-400">/plugin search &lt;query&gt;</code><span>Search plugins by name or keyword</span>
                <code className="text-indigo-400">/plugin info &lt;name|id&gt;</code><span>Show plugin details</span>
                <code className="text-indigo-400">/agent search &lt;query&gt;</code><span>Search agents by name or keyword</span>
                <code className="text-indigo-400">/agent info &lt;name|id&gt;</code><span>Show agent details</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-[#e2e2ea] mb-1.5">Review</h3>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <code className="text-indigo-400">/review list</code><span>List pending submissions (admin only)</span>
                <code className="text-indigo-400">/review approve &lt;id&gt;</code><span>Approve a submission (admin only)</span>
                <code className="text-indigo-400">/review reject &lt;id&gt; &lt;reason&gt;</code><span>Reject a submission (admin only)</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-[#e2e2ea] mb-1.5">Moderation (Mod/Admin only)</h3>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <code className="text-indigo-400">/warn &lt;user&gt; [reason]</code><span>Warn a user</span>
                <code className="text-indigo-400">/mute &lt;user&gt; [duration] [reason]</code><span>Timeout a user (default 1h)</span>
                <code className="text-indigo-400">/unmute &lt;user&gt; [reason]</code><span>Remove timeout from a user</span>
                <code className="text-indigo-400">/kick &lt;user&gt; [reason]</code><span>Kick a user from the server</span>
                <code className="text-indigo-400">/ban &lt;user&gt; [reason] [days]</code><span>Ban a user (0-7 days message delete)</span>
                <code className="text-indigo-400">/unban &lt;user_id&gt; [reason]</code><span>Unban a user by ID</span>
                <code className="text-indigo-400">/purge &lt;count&gt; [user]</code><span>Bulk delete messages (1-100)</span>
                <code className="text-indigo-400">/modlogs [user] [action]</code><span>View moderation logs</span>
                <code className="text-indigo-400">/slowmode [duration] [channel]</code><span>Set channel slowmode</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-[#e2e2ea] mb-1.5">Information</h3>
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <code className="text-indigo-400">/guild info</code><span>View server information</span>
                <code className="text-indigo-400">/guild settings view|set</code><span>View or modify guild settings</span>
                <code className="text-indigo-400">/user [user]</code><span>View user information</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
