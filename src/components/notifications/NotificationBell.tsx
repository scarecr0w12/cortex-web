"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Bell, CheckCheck, Check, ExternalLink, Package, Bot, Info } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const t = useTranslations("components");
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/notifications?limit=10", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
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
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // silently fail
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "submission_approved": return <Check className="w-4 h-4 text-green-400" />;
      case "submission_rejected": return <Package className="w-4 h-4 text-red-400" />;
      case "new_submission": return <Bot className="w-4 h-4 text-indigo-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg text-[#9090a8] hover:text-[#e2e2ea] hover:bg-[#111118] transition-colors"
        title={t("notifications")}
        aria-label={`${t("notifications")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-80 glass-card shadow-2xl shadow-black/40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
            <span className="text-sm font-semibold text-[#e2e2ea]">{t("notifications")}</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <CheckCheck className="w-3 h-3" /> {t("markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#55556a]">{t("loading")}</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#55556a]">{t("noNotifications")}</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.03)] transition-colors",
                    n.read ? "opacity-60" : "bg-indigo-500/5"
                  )}
                >
                  <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm", n.read ? "text-[#9090a8]" : "text-[#e2e2ea]")}>{n.title}</p>
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="shrink-0 p-0.5 rounded text-[#55556a] hover:text-indigo-400 transition-colors"
                          title={t("markAllRead")}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {n.body && (
                      <p className="text-xs text-[#55556a] mt-0.5 line-clamp-2">{n.body}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#55556a]">{formatDate(n.createdAt)}</span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setOpen(false)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                        >
                          {t("view")} <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-center text-xs text-indigo-400 hover:text-indigo-300 border-t border-[rgba(255,255,255,0.07)] transition-colors"
            >
              {t("viewAllNotifications")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
