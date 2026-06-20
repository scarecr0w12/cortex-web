"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, XCircle, Send } from "lucide-react";
import { Button } from "@/components/shared/Button";

export default function AdminEmailPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { setLoading(false); return; }
    fetch("/api/admin/settings", {
      headers: { authorization: `Bearer ${token}` },
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
        const s = data.settings || {};
        setEnvStatus({
          sendgrid_api_key: s._env_sendgrid_api_key === "set",
          sendgrid_from_email: s._env_sendgrid_from_email === "set",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const sendTest = async () => {
    if (!testEmail) { showMsg("error", "Enter an email address"); return; }
    setSending(true);
    setMessage(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("success", "Test email sent to " + testEmail);
      } else {
        showMsg("error", data.error || "Failed to send");
      }
    } catch {
      showMsg("error", "Connection error");
    }
    setSending(false);
  };

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

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8"><div className="text-center py-12 text-[#55556a]">Loading...</div></div>;
  }

  const allConfigured = envStatus.sendgrid_api_key && envStatus.sendgrid_from_email;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e2ea]">Email Configuration</h1>
        <p className="text-[#9090a8] text-sm">SendGrid-powered email notifications and alerts</p>
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
        {/* Status */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="p-2 rounded-lg bg-indigo-500/10"><Mail className="w-5 h-5 text-indigo-400" /></div>
            <div>
              <h2 className="text-lg font-semibold text-[#e2e2ea]">Email Status</h2>
              <p className="text-xs text-[#55556a]">Current SendGrid email configuration status</p>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
              <span className="text-[#9090a8]">SENDGRID_API_KEY</span>
              {statusBadge(envStatus.sendgrid_api_key)}
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
              <span className="text-[#9090a8]">SENDGRID_FROM_EMAIL</span>
              {statusBadge(envStatus.sendgrid_from_email)}
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
            <p className="text-xs text-[#55556a]">
              {allConfigured
                ? "All required environment variables are configured. Email delivery is active."
                : "Email sending requires SENDGRID_API_KEY and SENDGRID_FROM_EMAIL to be set in the .env file."}
            </p>
          </div>
        </div>

        {/* Test Email */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="p-2 rounded-lg bg-indigo-500/10"><Send className="w-5 h-5 text-indigo-400" /></div>
            <div>
              <h2 className="text-lg font-semibold text-[#e2e2ea]">Send Test Email</h2>
              <p className="text-xs text-[#55556a]">Send a test email to verify configuration</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="admin@example.com"
              className="flex-1 px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
            />
            <Button onClick={sendTest} disabled={sending || !testEmail}>
              <Send className="w-4 h-4 mr-1.5" /> {sending ? "Sending..." : "Send Test"}
            </Button>
          </div>
        </div>

        {/* Email Events */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="p-2 rounded-lg bg-indigo-500/10"><Mail className="w-5 h-5 text-indigo-400" /></div>
            <div>
              <h2 className="text-lg font-semibold text-[#e2e2ea]">Automated Emails</h2>
              <p className="text-xs text-[#55556a]">Events that trigger email notifications</p>
            </div>
          </div>

          <div className="text-sm text-[#55556a] space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div>
                <p className="text-[#e2e2ea] font-medium">Welcome Email</p>
                <p className="text-xs">Sent on account registration with getting-started links</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div>
                <p className="text-[#e2e2ea] font-medium">Submission Approved</p>
                <p className="text-xs">Sent to plugin/agent author when their submission is approved</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div>
                <p className="text-[#e2e2ea] font-medium">Submission Rejected</p>
                <p className="text-xs">Sent to plugin/agent author with review notes when rejected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#111118] rounded-lg border border-[rgba(255,255,255,0.07)]">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div>
                <p className="text-[#e2e2ea] font-medium">Email Preferences</p>
                <p className="text-xs">Users can opt out of emails via their dashboard settings. Respects the <code className="text-indigo-400">emailNotifications</code> preference flag.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
