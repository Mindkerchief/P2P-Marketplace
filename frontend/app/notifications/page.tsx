"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/utils/UserContext";
import { Bell, ShieldAlert, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  markNotificationsRead,
  type Notification,
} from "@/services/notificationService";

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function NotificationIcon({ type }: { type: string }) {
  const base = "w-9 h-9 rounded-full flex items-center justify-center shrink-0";
  if (type === "REPORT_ACTION") {
    return (
      <div className={cn(base, "bg-red-500/10")}>
        <ShieldAlert size={18} className="text-red-400" />
      </div>
    );
  }
  return (
    <div className={cn(base, "bg-amber-500/10")}>
      <Bell size={18} className="text-amber-400" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1c1f2e] border border-border shadow-sm flex items-center justify-center">
        <Bell size={28} className="text-stone-300 dark:text-stone-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">No notifications yet</p>
        <p className="text-xs text-stone-400 dark:text-stone-600 mt-1 max-w-[200px] mx-auto leading-relaxed">
          You'll be notified here when something important happens.
        </p>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { isAuth } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (isAuth === false) router.replace("/login");
  }, [isAuth, router]);

  useEffect(() => {
    if (!isAuth) return;
    const load = async () => {
      setLoading(true);
      try {
        setNotifications(await getNotifications());
      } catch {
        // show empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuth]);

  const handleMarkAllRead = async () => {
    if (markingRead || unreadCount === 0) return;
    setMarkingRead(true);
    try {
      await markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silently fail
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0f1117]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingRead}
              className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-50"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-[#1c1f2e] rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-5 py-4 transition-colors",
                    !n.isRead ? "bg-amber-50/60 dark:bg-amber-900/10" : "hover:bg-stone-50 dark:hover:bg-white/5"
                  )}
                >
                  <NotificationIcon type={n.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-800 dark:text-stone-200 leading-snug">{n.message}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}