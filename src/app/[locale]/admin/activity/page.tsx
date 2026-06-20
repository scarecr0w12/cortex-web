"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/admin/activity", { headers: { authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setLogs(data.logs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-[#55556a]">Loading activity log...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#e2e2ea] mb-2">Activity Log</h1>
      <p className="text-[#9090a8] text-sm mb-6">Audit trail of admin actions</p>
      {logs.length === 0 ? (
        <div className="glass-card p-8 text-center text-sm text-[#55556a]">No activity recorded yet.</div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="glass-card p-3 flex items-center justify-between text-sm">
              <div>
                <span className="text-[#e2e2ea]">{log.action}</span>
                {log.entity && <span className="text-[#55556a] ml-2">on {log.entity}</span>}
              </div>
              <span className="text-xs text-[#55556a]">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
