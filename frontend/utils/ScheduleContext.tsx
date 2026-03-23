"use client";

import {
  createContext, useContext, useState,
  useCallback, useEffect,
} from "react";

// ─── Types ──────────────────────────────────────────────────────────────────────
export type RecurringDay  = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun … 6=Sat
export type SlotStatus    = "available" | "booked" | "blocked";

export interface ScheduleSlot {
  id:       string;
  date:     string;      // "YYYY-MM-DD"
  status:   SlotStatus;
  note?:    string;
  bookedBy?: string;
  timeWindow?: string;   // e.g. "08-10"
}

export interface ListingSchedule {
  listingId:          string;
  listingType:        "rent" | "service";
  operatingDays:      RecurringDay[];   // days of week seller works
  operatingStart:     string;           // "HH:MM"
  operatingEnd:       string;           // "HH:MM"
  advanceBookingDays: number;           // how far ahead buyers can book
  slots:              ScheduleSlot[];   // date overrides
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
export function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getSlotStatus(schedule: ListingSchedule, date: Date): SlotStatus {
  const ymd = toYMD(date);
  const dow  = date.getDay() as RecurringDay;
  if (!schedule.operatingDays.includes(dow)) return "blocked";
  const slot = schedule.slots.find((s) => s.date === ymd);
  return slot?.status ?? "available";
}

export function isDateAvailable(schedule: ListingSchedule, date: Date): boolean {
  return getSlotStatus(schedule, date) === "available";
}

// ─── Context ─────────────────────────────────────────────────────────────────────
interface ScheduleContextType {
  getSchedule:   (listingId: string) => ListingSchedule | null;
  saveSchedule:  (schedule: ListingSchedule) => void;
  addSlot:       (listingId: string, slot: Omit<ScheduleSlot, "id">) => void;
  removeSlot:    (listingId: string, slotId: string) => void;
  createBooking: (listingId: string, date: Date, buyerName: string, timeWindow?: string, note?: string) => boolean;
}

const Ctx         = createContext<ScheduleContextType | null>(null);
const STORAGE_KEY = "p2p_schedules_v1";

function load(): Record<string, ListingSchedule> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); }
  catch { return {}; }
}

function persist(map: Record<string, ListingSchedule>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Record<string, ListingSchedule>>({});

  useEffect(() => { setMap(load()); }, []);

  const getSchedule = useCallback(
    (id: string) => map[id] ?? null,
    [map]
  );

  const saveSchedule = useCallback((schedule: ListingSchedule) => {
    setMap((prev) => {
      const next = { ...prev, [schedule.listingId]: schedule };
      persist(next);
      return next;
    });
  }, []);

  const addSlot = useCallback((listingId: string, slot: Omit<ScheduleSlot, "id">) => {
    setMap((prev) => {
      const schedule = prev[listingId];
      if (!schedule) return prev;
      const newSlot: ScheduleSlot = { ...slot, id: `slot-${Date.now()}` };
      // Replace any existing slot for the same date
      const slots = [
        ...schedule.slots.filter((s) => s.date !== slot.date),
        newSlot,
      ];
      const next = { ...prev, [listingId]: { ...schedule, slots } };
      persist(next);
      return next;
    });
  }, []);

  const removeSlot = useCallback((listingId: string, slotId: string) => {
    setMap((prev) => {
      const schedule = prev[listingId];
      if (!schedule) return prev;
      const next = { ...prev, [listingId]: { ...schedule, slots: schedule.slots.filter((s) => s.id !== slotId) } };
      persist(next);
      return next;
    });
  }, []);

  const createBooking = useCallback((
    listingId: string, date: Date, buyerName: string, timeWindow?: string, note?: string
  ): boolean => {
    const schedule = map[listingId];
    if (!schedule || !isDateAvailable(schedule, date)) return false;
    const ymd = toYMD(date);
    const newSlot: ScheduleSlot = {
      id:         `slot-${Date.now()}`,
      date:       ymd,
      status:     "booked",
      bookedBy:   buyerName,
      timeWindow,
      note,
    };
    setMap((prev) => {
      const s = prev[listingId];
      if (!s) return prev;
      const slots = [...s.slots.filter((sl) => sl.date !== ymd), newSlot];
      const next  = { ...prev, [listingId]: { ...s, slots } };
      persist(next);
      return next;
    });
    return true;
  }, [map]);

  return (
    <Ctx.Provider value={{ getSchedule, saveSchedule, addSlot, removeSlot, createBooking }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSchedule() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSchedule must be used within ScheduleProvider");
  return ctx;
}
