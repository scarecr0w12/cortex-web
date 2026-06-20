"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle, VolumeX,
  Volume2, UserMinus, Ban, UserPlus, Trash2, Shield,
} from "lucide-react";
import { Button } from "@/components/shared/Button";

interface ModLog {
  id: string;
  guildId: string;
  actionType: string;
  moderatorId: string;
  moderatorTag: string;
  targetId: string;
  targetTag: string;
  reason: string | null;
  duration: string | null;
  expiresAt: string | null;
  metadata: string | null;
  createdAt: string;
}

interface ModLogsResponse {
  logs: ModLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  actionCounts: Record<string, number>;
  guildNames: Record<string, string>;
}

const actionLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  warn: { label: "Warn", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  mute: { label: "Mute", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: <VolumeX className="w-3.5 h-3.5" /> },
  unmute: { label: "Unmute", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <Volume2 className="w-3.5 h-3.5" /> },
  kick: { label: "Kick", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <UserMinus className="w-3.5 h-3.5" /> },
  ban: { label: "Ban", color: "bg-red-600/10 text-red-500 border-red-600/20", icon: <Ban className="w-3.5 h-3.5" /> },
  unban: { label: "Unban", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <UserPlus className="w-3.5 h-3.5" /> },
  purge: { label: "Purge", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: <Trash2 className="w-3.5 h-3.5" /> },
};

export default function AdminModerationPage() {
  const [data, setData] = useState<ModLogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const authHeaders = useCallback(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return t ? { authorization: `Bearer ${t}` } : {};
  }, []);

  const fetchLogs = useCallback(async () => {
    const headers = authHeaders();
    if (!headers.authorization) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "25");
      if (actionFilter) params.set("actionType", actionFilter);
      if (searchTerm) {
        if (/^\d{17,20}$/.test(searchTerm)) {
          params.set("targetId", searchTerm);
        } else {
          params.set("targetId", searchTerm);
        }
      }
      const res = await fetch(`/api/admin/discord/moderation?${params}`, { headers });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || `HTTP ${res.status}`);
      setData(d);
    } catch (e) {
      console.error("Failed to load moderation logs:", e);
    }
    setLoading(false);
  }, [page, actionFilter, searchTerm, authHeaders]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString();
  };

  const formatDuration = (ms: string | null) => {
    if (!ms) return null;
    const v = parseInt(ms);
    const hours = Math.floor(v / 3600000);
    const mins = Math.floor((v % 3600000) / 60000);
    const secs = Math.floor((v % 60000) / 1000);
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0) parts.push(`${secs}s`);
    return parts.join(" ") || "0s";
  };

  if (loading && !data) {
    return <div className="p-4 sm:p-6 lg:p-8"><div className="text-center py-12 text-[#55556a]">Loading...</div></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e2ea]">Moderation Logs</h1>
        <p className="text-[#9090a8] text-sm">View all moderation actions across Discord servers</p>
      </div>

      {/* Summary Cards */}
      {data?.actionCounts && Object.keys(data.actionCounts).length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(data.actionCounts).map(([type, count]) => {
            const info = actionLabels[type];
            if (!info) return null;
            return (
              <div key={type}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111118] border border-[rgba(255,255,255,0.07)]">
                <span className={info.color + " px-1.5 py-0.5 rounded text-xs flex items-center gap-1"}>
                  {info.icon}{info.label}
                </span>
                <span className="text-[#e2e2ea] font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55556a]" />
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
        >
          <option value="">All Actions</option>
          {Object.entries(actionLabels).map(([value, info]) => (
            <option key={value} value={value}>{info.label}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={fetchLogs}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Table */}
      {data && data.logs.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.07)]">
            <table className="w-full text-sm">
              <thead className="bg-[#0a0a0f] text-[#9090a8] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-left">Moderator</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Server</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {data.logs.map((log) => {
                  const info = actionLabels[log.actionType] || actionLabels.warn;
                  return (
                    <tr key={log.id} className="hover:bg-[#111118]/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${info.color}`}>
                          {info.icon}{info.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[#e2e2ea] font-medium">{log.targetTag}</div>
                        <div className="text-[#55556a] text-xs font-mono">{log.targetId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[#e2e2ea]">{log.moderatorTag}</div>
                        <div className="text-[#55556a] text-xs font-mono">{log.moderatorId}</div>
                      </td>
                      <td className="px-4 py-3 text-[#9090a8] max-w-[200px] truncate">
                        {log.reason || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#9090a8]">
                        {formatDuration(log.duration) || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#9090a8] text-xs max-w-[120px] truncate">
                        {data.guildNames[log.guildId] || log.guildId}
                      </td>
                      <td className="px-4 py-3 text-right text-[#55556a] text-xs whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-[#55556a]">
                Showing {(data.page - 1) * data.limit + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                <span className="px-3 py-1 text-[#9090a8]">
                  {page} / {data.totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-[#55556a]">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No moderation logs found</p>
          {actionFilter && <p className="text-xs mt-1">Try removing filters</p>}
        </div>
      )}
    </div>
  );
}
