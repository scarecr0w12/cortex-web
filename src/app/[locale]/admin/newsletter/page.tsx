"use client";

import { useEffect, useState } from "react";
import { Send, Trash2, Users, Megaphone, AlertCircle, CheckCircle, XCircle, RefreshCw, Upload, Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";

type Subscriber = {
  id: string;
  email: string;
  status: string;
  subscribedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
};

type Campaign = {
  id: string;
  subject: string;
  status: string;
  sentCount: number;
  sentAt: string | null;
  createdAt: string;
};

type Tab = "subscribers" | "campaigns";

export default function AdminNewsletterPage() {
  const [tab, setTab] = useState<Tab>("subscribers");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e2ea]">Newsletter</h1>
        <p className="text-[#9090a8] text-sm">Manage subscribers and send email campaigns</p>
      </div>

      {message && (
        <div className={"mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 " + (message.type === "success"
          ? "bg-green-500/10 text-green-300 border border-green-500/20"
          : "bg-red-500/10 text-red-300 border border-red-500/20")}>
          {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-[#0a0a0f] rounded-lg p-1 border border-[rgba(255,255,255,0.07)] w-fit">
        <button
          onClick={() => setTab("subscribers")}
          className={"px-4 py-2 rounded-md text-sm font-medium transition-colors " +
            (tab === "subscribers" ? "bg-indigo-500/20 text-indigo-300" : "text-[#9090a8] hover:text-[#e2e2ea]")}
        >
          <Users className="w-4 h-4 inline mr-1.5" /> Subscribers
        </button>
        <button
          onClick={() => setTab("campaigns")}
          className={"px-4 py-2 rounded-md text-sm font-medium transition-colors " +
            (tab === "campaigns" ? "bg-indigo-500/20 text-indigo-300" : "text-[#9090a8] hover:text-[#e2e2ea]")}
        >
          <Megaphone className="w-4 h-4 inline mr-1.5" /> Campaigns
        </button>
      </div>

      {tab === "subscribers" ? <SubscribersPanel showMsg={showMsg} /> : <CampaignsPanel showMsg={showMsg} />}
    </div>
  );
}

function SubscribersPanel({ showMsg }: { showMsg: (type: "success" | "error", text: string) => void }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<"active" | "pending">("active");
  const [importing, setImporting] = useState(false);

  const fetchSubscribers = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/newsletter/subscribers?${params}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
        setSubscribers(data.subscribers || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => showMsg("error", "Failed to load subscribers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubscribers(); }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchSubscribers();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showMsg("success", "Subscriber deleted");
        fetchSubscribers();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "Failed to delete");
      }
    } catch {
      showMsg("error", "Connection error");
    }
  };

  const handleImport = async () => {
    const emails = importText
      .split(/[\n,;]+/)
      .map(e => e.trim())
      .filter(e => e.includes("@"));
    if (emails.length === 0) {
      showMsg("error", "No valid email addresses found");
      return;
    }
    setImporting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ emails, status: importStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("success", `Imported ${data.created} subscribers (${data.skipped} skipped)`);
        setShowImport(false);
        setImportText("");
        fetchSubscribers();
      } else {
        showMsg("error", data.error || "Failed to import");
      }
    } catch {
      showMsg("error", "Connection error");
    }
    setImporting(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-300 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
      case "unsubscribed": return "bg-red-500/10 text-red-300 border-red-500/20";
      default: return "bg-[#18181f] text-[#9090a8] border-[rgba(255,255,255,0.07)]";
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search by email..."
            className="flex-1 px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          />
          <Button onClick={handleSearch} size="sm" variant="secondary">Search</Button>
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <Button onClick={() => setShowImport(true)} size="sm" variant="outline">
          <Upload className="w-4 h-4 mr-1.5" /> Import
        </Button>
        <Button onClick={() => fetchSubscribers()} size="sm" variant="ghost">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {showImport && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#e2e2ea]">Import Subscribers</h3>
            <button onClick={() => { setShowImport(false); setImportText(""); }} className="text-[#55556a] hover:text-[#e2e2ea]">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9090a8] mb-1">
                Email addresses (one per line, or comma/semicolon separated)
              </label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                rows={8}
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50 font-mono resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9090a8] mb-1">Status</label>
              <select
                value={importStatus}
                onChange={e => setImportStatus(e.target.value as "active" | "pending")}
                className="px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
              >
                <option value="active">Active (no verification required)</option>
                <option value="pending">Pending (requires verification)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={importing || !importText.trim()}>
                <Plus className="w-4 h-4 mr-1.5" /> {importing ? "Importing..." : "Import"}
              </Button>
              <Button onClick={() => { setShowImport(false); setImportText(""); }} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-3 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs text-[#55556a]">
          <span>{total} subscriber{total !== 1 ? "s" : ""}</span>
        </div>
        {loading ? (
          <div className="text-center py-12 text-[#55556a]">Loading...</div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12 text-[#55556a]">No subscribers found</div>
        ) : (
          <>
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {subscribers.map(s => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-[#e2e2ea] font-medium">{s.email}</p>
                    <p className="text-xs text-[#55556a]">
                      {s.subscribedAt
                        ? `Subscribed ${new Date(s.subscribedAt).toLocaleDateString()}`
                        : `Created ${new Date(s.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={"inline-flex items-center px-2 py-0.5 text-xs rounded-full border " + statusColor(s.status)}>
                      {s.status}
                    </span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded text-[#55556a] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="p-3 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                  Prev
                </Button>
                <span className="text-xs text-[#55556a]">{page} / {totalPages}</span>
                <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CampaignsPanel({ showMsg }: { showMsg: (type: "success" | "error", text: string) => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState<string | null>(null);
  const [subCount, setSubCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCampaigns = (p = 1) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`/api/admin/newsletter/campaigns?page=${p}&limit=20`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        setCampaigns(data.campaigns);
        setTotalPages(data.totalPages);
      })
      .catch(() => showMsg("error", "Failed to load campaigns"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/admin/newsletter/subscribers?status=active&limit=1", {
      headers: { authorization: `Bearer ${token}` },
    })
      .then(async r => {
        const data = await r.json();
        if (r.ok) setSubCount(data.total);
      })
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!subject || !content) { showMsg("error", "Subject and content are required"); return; }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/newsletter/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject, content }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("success", "Campaign draft created");
        setShowForm(false);
        setSubject("");
        setContent("");
        fetchCampaigns();
      } else {
        showMsg("error", data.error || "Failed to create");
      }
    } catch {
      showMsg("error", "Connection error");
    }
  };

  const handleSend = async (id: string) => {
    setSending(id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("success", `Campaign sent! Delivered: ${data.sent}, Failed: ${data.failed}`);
        fetchCampaigns();
      } else {
        showMsg("error", data.error || "Failed to send");
      }
    } catch {
      showMsg("error", "Connection error");
    }
    setSending(null);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showMsg("success", "Campaign deleted");
        fetchCampaigns();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "Failed to delete");
      }
    } catch {
      showMsg("error", "Connection error");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-500/10 text-green-300 border-green-500/20";
      case "sending": return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
      case "error": return "bg-red-500/10 text-red-300 border-red-500/20";
      case "draft": return "bg-[#18181f] text-[#9090a8] border-[rgba(255,255,255,0.07)]";
      default: return "bg-[#18181f] text-[#9090a8] border-[rgba(255,255,255,0.07)]";
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#55556a]">{subCount} active subscriber{subCount !== 1 ? "s" : ""}</p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Megaphone className="w-4 h-4 mr-1.5" /> New Campaign
          </Button>
        )}
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#e2e2ea]">New Campaign</h3>
            <button onClick={() => { setShowForm(false); setSubject(""); setContent(""); }} className="text-[#55556a] hover:text-[#e2e2ea]">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9090a8] mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="What's new in CortexPrism..."
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9090a8] mb-1">Content (HTML)</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="<p>Your newsletter content here...</p>"
                rows={8}
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50 font-mono resize-y"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Send className="w-4 h-4 mr-1.5" /> Save Draft
              </Button>
              <Button onClick={() => { setShowForm(false); setSubject(""); setContent(""); }} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#55556a]">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 text-[#55556a]">No campaigns yet</div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-base font-semibold text-[#e2e2ea] truncate">{c.subject}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={"inline-flex items-center px-2 py-0.5 text-xs rounded-full border " + statusColor(c.status)}>
                      {c.status}
                    </span>
                    {c.sentAt && (
                      <span className="text-xs text-[#55556a]">
                        Sent {new Date(c.sentAt).toLocaleDateString()} — {c.sentCount} delivered
                      </span>
                    )}
                    {!c.sentAt && (
                      <span className="text-xs text-[#55556a]">
                        Created {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status === "draft" && (
                    <>
                      <Button onClick={() => handleSend(c.id)} size="sm" disabled={sending === c.id}>
                        <Send className="w-3.5 h-3.5 mr-1" />
                        {sending === c.id ? "Sending..." : "Send Now"}
                      </Button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 rounded text-[#55556a] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
            Prev
          </Button>
          <span className="text-xs text-[#55556a]">{page} / {totalPages}</span>
          <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
