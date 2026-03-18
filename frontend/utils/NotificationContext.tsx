"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type NotifType =
  | "message"
  | "offer"
  | "offer_accepted"
  | "offer_declined"
  | "review"
  | "listing_saved"
  | "system";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: Date;
  meta?: {
    userName?: string;
    listingTitle?: string;
    amount?: number;
    rating?: number;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

const Ctx = createContext<NotificationContextType | null>(null);
const KEY = "p2p_notifs_v1";

const SEED: Notification[] = [
  {
    id: "n1", type: "message", read: false,
    title: "New message from Juan dela Cruz",
    body: "Is the G-Shock still available? Can we meet tomorrow?",
    href: "/messages/1",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    meta: { userName: "Juan dela Cruz", listingTitle: "Casio G-Shock GA-2100" },
  },
  {
    id: "n2", type: "offer", read: false,
    title: "New offer on your listing",
    body: "Ana Reyes offered ₱1,500 for Casio G-Shock GA-2100",
    href: "/listing/s1",
    createdAt: new Date(Date.now() - 22 * 60 * 1000),
    meta: { userName: "Ana Reyes", listingTitle: "Casio G-Shock GA-2100", amount: 1500 },
  },
  {
    id: "n3", type: "review", read: false,
    title: "You received a new review ⭐",
    body: "Maria Santos left you a 5-star review",
    href: "/profile",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    meta: { userName: "Maria Santos", rating: 5 },
  },
  {
    id: "n4", type: "listing_saved", read: true,
    title: "Someone saved your listing",
    body: "Pedro Reyes bookmarked MacBook Pro M1 2022",
    href: "/listing/s2",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    meta: { userName: "Pedro Reyes", listingTitle: "MacBook Pro M1 2022" },
  },
  {
    id: "n5", type: "offer_accepted", read: true,
    title: "Your offer was accepted! 🎉",
    body: "Your offer of ₱11,500 for Studio Unit — Makati CBD was accepted",
    href: "/listing/2",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    meta: { userName: "Maria Santos", listingTitle: "Studio Unit — Makati CBD", amount: 11500 },
  },
  {
    id: "n6", type: "system", read: true,
    title: "Welcome to P2P Marketplace! 🎉",
    body: "Complete your profile to increase listing visibility",
    href: "/profile",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: Notification[] = JSON.parse(raw).map((n: Notification) => ({
          ...n, createdAt: new Date(n.createdAt),
        }));
        setNotifications(parsed);
      } else {
        setNotifications(SEED);
      }
    } catch {
      setNotifications(SEED);
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0)
      localStorage.setItem(KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "createdAt">) => {
    setNotifications((prev) => [{ ...n, id: `n-${Date.now()}`, read: false, createdAt: new Date() }, ...prev]);
  }, []);

  const markRead    = useCallback((id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n)), []);
  const markAllRead = useCallback(() => setNotifications((p) => p.map((n) => ({ ...n, read: true }))), []);
  const remove      = useCallback((id: string) => setNotifications((p) => p.filter((n) => n.id !== id)), []);
  const clearAll    = useCallback(() => { setNotifications([]); localStorage.removeItem(KEY); }, []);

  return (
    <Ctx.Provider value={{ notifications, unreadCount, addNotification, markRead, markAllRead, remove, clearAll }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
