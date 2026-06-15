"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, CheckCheck, Check, ExternalLink, Package, Bot, Info, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/shared/Button";
import { cn, formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

interface PageInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async (page = 1) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${page}&limit=20`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setPageInfo({ page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages });
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    fetchNotifications(1);
  }, [user, authLoading, router, fetchNotifications]);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      // silently fail
    }
  };

  const markRead = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // silently fail
    }
  };

  const deleteNotification = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {
      // silently fail
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "submission_approved": return <Check className="w-5 h-5 text-green-400" />;
      case "submission_rejected": return <Package className="w-5 h-5 text-red-400" />;
      case "new_submission": return <Bot className="w-5 h-5 text-indigo-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  if (authLoading) return <div className="max-w-page-narrow mx-auto px-4 py-20 text-center text-[#55556a]">Loading...</div>;
  if (!user) return null;

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold text-[#e2e2ea]">Notifications</h1>
            <p className="text-[#9090a8] text-sm">
              {pageInfo.total} total{unread > 0 ? ` · ${unread} unread` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm">Settings</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center text-sm text-[#55556a]">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bell className="w-8 h-8 mx-auto mb-3 text-[#55556a]" />
          <p className="text-[#9090a8] font-medium">No notifications yet</p>
          <p className="text-sm text-[#55556a] mt-1">Notifications about submissions and marketplace updates will appear here.</p>
          <Link href="/marketplace">
            <Button variant="outline" size="sm" className="mt-4">Browse Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "glass-card p-4 flex items-start gap-4 transition-colors",
                !n.read && "border-l-2 border-l-indigo-500"
              )}
            >
              <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className={cn("text-sm font-medium", n.read ? "text-[#9090a8]" : "text-[#e2e2ea]")}>{n.title}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)}
                        className="p-1.5 rounded-lg text-[#55556a] hover:text-indigo-400 hover:bg-[#111118] transition-colors"
                        title="Mark as read">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)}
                      className="p-1.5 rounded-lg text-[#55556a] hover:text-red-400 hover:bg-[#111118] transition-colors"
                      title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {n.body && <p className="text-sm text-[#55556a] mt-1">{n.body}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-[#55556a]">{formatDate(n.createdAt)}</span>
                  {n.link && (
                    <Link href={n.link} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
                      View details <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => fetchNotifications(pageInfo.page - 1)}
            disabled={pageInfo.page <= 1}
            className="p-2 rounded-lg text-[#9090a8] hover:text-[#e2e2ea] hover:bg-[#111118] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-[#9090a8]">
            Page {pageInfo.page} of {pageInfo.totalPages}
          </span>
          <button
            onClick={() => fetchNotifications(pageInfo.page + 1)}
            disabled={pageInfo.page >= pageInfo.totalPages}
            className="p-2 rounded-lg text-[#9090a8] hover:text-[#e2e2ea] hover:bg-[#111118] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
