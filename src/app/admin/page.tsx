"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge";
import { Package, Bot, Check, X } from "lucide-react";

interface PendingItem {
  id: string; name: string; slug: string; version: string;
  description: string; kind?: string; provider?: string;
  category: string | null; status: string;
  user: { id: string; username: string; email: string } | null;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"plugins" | "agents">("plugins");
  const [plugins, setPlugins] = useState<PendingItem[]>([]);
  const [agents, setAgents] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSubmissions = async () => {
    if (!token) { router.push("/login"); return; }
    const headers = { authorization: `Bearer ${token}` };
    const [pRes, aRes] = await Promise.all([
      fetch("/api/admin/submissions/plugins?status=pending", { headers }),
      fetch("/api/admin/submissions/agents?status=pending", { headers }),
    ]);
    if (pRes.status === 403 || aRes.status === 403) { setError("Admin access required"); setLoading(false); return; }
    const pData = await pRes.json();
    const aData = await aRes.json();
    setPlugins(pData.plugins || []);
    setAgents(aData.agents || []);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleAction = async (id: string, action: "approved" | "rejected", type: "plugins" | "agents") => {
    if (!token) return;
    const res = await fetch(`/api/admin/submissions/${type}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) fetchSubmissions();
  };

  if (loading) return <div className="max-w-page-narrow mx-auto px-4 py-20 text-center text-[#55556a]">Loading...</div>;
  if (error) return <div className="max-w-page-narrow mx-auto px-4 py-20 text-center text-red-400">{error}</div>;

  const items = tab === "plugins" ? plugins : agents;

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#e2e2ea]">Admin Panel</h1>
          <p className="text-[#9090a8]">Review and manage marketplace submissions</p>
        </div>
        <Link href="/dashboard" className="text-sm text-[#55556a] hover:text-[#e2e2ea]">← Dashboard</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("plugins")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${tab === "plugins" ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" : "bg-[#111118] text-[#9090a8] border border-[rgba(255,255,255,0.07)]"}`}>
          <Package className="w-4 h-4 inline mr-1" /> Plugins {plugins.length > 0 && `(${plugins.length})`}
        </button>
        <button onClick={() => setTab("agents")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${tab === "agents" ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" : "bg-[#111118] text-[#9090a8] border border-[rgba(255,255,255,0.07)]"}`}>
          <Bot className="w-4 h-4 inline mr-1" /> Agents {agents.length > 0 && `(${agents.length})`}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-3xl mb-3">🎉</div>
          <p className="text-[#9090a8]">No pending {tab} submissions. Everything is reviewed!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/marketplace/${tab}/${item.slug}`} className="font-semibold text-[#e2e2ea] hover:text-indigo-400">
                      {item.name}
                    </Link>
                    <Badge variant="yellow">Pending</Badge>
                  </div>
                  <p className="text-sm text-[#55556a] mt-1">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-[#55556a]">
                  by {item.user?.username || "Anonymous"} · v{item.version}
                  {item.kind && ` · ${item.kind}`}
                  {item.provider && ` · ${item.provider}`}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(item.id, "approved", tab)}
                    className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleAction(item.id, "rejected", tab)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
