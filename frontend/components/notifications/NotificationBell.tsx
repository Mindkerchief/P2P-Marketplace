"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell, MessageCircle, Tag, Star, Heart,
  CheckCircle, XCircle, Megaphone, X, Check, Trash2,
} from "lucide-react";
import { useNotifications, type Notification, type NotifType } from "@/utils/NotificationContext";
import { cn } from "@/lib/utils";

// ── Icon & bg per type ────────────────────────────────────────────────────────
function typeIcon(t: NotifType) {
  const c = "w-3.5 h-3.5";
  const icons: Record<NotifType, React.ReactNode> = {
    message:        <MessageCircle className={cn(c, "text-blue-400")} />,
    offer:          <Tag           className={cn(c, "text-amber-400")} />,
    offer_accepted: <CheckCircle   className={cn(c, "text-teal-400")} />,
    offer_declined: <XCircle       className={cn(c, "text-red-400")} />,
    review:         <Star          className={cn(c, "text-amber-400")} />,
    listing_saved:  <Heart         className={cn(c, "text-rose-400")} />,
    system:         <Megaphone     className={cn(c, "text-stone-400")} />,
  };
  return icons[t];
}

function typeBg(t: NotifType) {
  const map: Record<NotifType, string> = {
    message:        "bg-blue-500/15",
    offer:          "bg-amber-500/15",
    offer_accepted: "bg-teal-500/15",
    offer_declined: "bg-red-500/15",
    review:         "bg-amber-500/15",
    listing_saved:  "bg-rose-500/15",
    system:         "bg-stone-500/15",
  };
  return map[t];
}

function timeAgo(date: Date) {
  const d = date instanceof Date ? date : new Date(date);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60)   return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

// ── Single row ────────────────────────────────────────────────────────────────
function NotifRow({ n, close }: { n: Notification; close: () => void }) {
  const { markRead, remove } = useNotifications();

  const inner = (
    <div
      onClick={() => markRead(n.id)}
      className={cn(
        "group relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors",
        n.read
          ? "hover:bg-stone-50 dark:hover:bg-white/5"
          : "bg-amber-50/60 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20"
      )}
    >
      {/* Unread indicator */}
      {!n.read && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
      )}

      {/* Icon bubble */}
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5", typeBg(n.type))}>
        {typeIcon(n.type)}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pr-5">
        <p className={cn("text-xs leading-snug", n.read ? "text-stone-600 dark:text-stone-300" : "font-semibold text-stone-900 dark:text-stone-50")}>
          {n.title}
        </p>
        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
          {n.body}
        </p>
        <p className="text-[10px] text-stone-300 dark:text-stone-600 mt-1">{timeAgo(n.createdAt)}</p>
      </div>

      {/* Delete on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); remove(n.id); }}
        className="absolute top-3 right-3 w-5 h-5 rounded-full items-center justify-center text-stone-300 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all flex"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );

  return n.href
    ? <Link href={n.href} onClick={close} className="block divide-y-0">{inner}</Link>
    : inner;
}

// ── Bell + dropdown ───────────────────────────────────────────────────────────
export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [open, setOpen]     = useState(false);
  const [tab, setTab]       = useState<"all" | "unread">("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const visible = tab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div ref={ref} className="relative">

      {/* ── Bell button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className={cn(
          "relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
          open ? "bg-white/15 text-white" : "text-stone-400 hover:bg-white/10 hover:text-white"
        )}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none pointer-events-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-16px)] rounded-2xl shadow-2xl border border-white/10 dark:border-[#2a2d3e] bg-white dark:bg-[#1a2235] overflow-hidden z-50">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-50">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
                  <Check className="w-3 h-3" /> All read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg text-stone-400 dark:text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-100 dark:border-white/10">
            {(["all", "unread"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 text-xs font-semibold capitalize transition-colors",
                  tab === t
                    ? "text-stone-900 dark:text-stone-50 border-b-2 border-amber-500"
                    : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
                )}
              >
                {t === "unread" ? `Unread (${unreadCount})` : `All (${notifications.length})`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100 dark:divide-white/5">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-white/5 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                </div>
                <p className="text-sm text-stone-400 dark:text-stone-500">
                  {tab === "unread" ? "You're all caught up!" : "No notifications yet"}
                </p>
              </div>
            ) : (
              visible.map((n) => <NotifRow key={n.id} n={n} close={() => setOpen(false)} />)
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-stone-100 dark:border-white/10 px-4 py-2.5 text-center">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
