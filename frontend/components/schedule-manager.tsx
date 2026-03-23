"use client";

import { useState, useCallback } from "react";
import {
  CalendarDays, Lock, Unlock, Trash2,
  Clock, Save, CheckCircle2, Info, Settings,
} from "lucide-react";
import {
  useSchedule, type ListingSchedule, type RecurringDay,
  getSlotStatus, toYMD,
} from "@/utils/ScheduleContext";
import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getGridDays(year: number, month: number): Date[] {
  const first  = new Date(year, month, 1);
  const offset = first.getDay();
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}

// ── Colour tokens per listing type ────────────────────────────────────────────
function typeTokens(type: "rent" | "service") {
  return type === "rent"
    ? { btn: "bg-teal-700 hover:bg-teal-600", ring: "ring-teal-500", pill: "bg-teal-600" }
    : { btn: "bg-violet-700 hover:bg-violet-600", ring: "ring-violet-500", pill: "bg-violet-600" };
}

// ── Mini manager calendar ──────────────────────────────────────────────────────
interface ManagerCalProps {
  schedule:     ListingSchedule;
  selectedDate: Date | null;
  onSelect:     (d: Date) => void;
  tokens:       ReturnType<typeof typeTokens>;
}

function ManagerCalendar({ schedule, selectedDate, onSelect, tokens }: ManagerCalProps) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const cells = getGridDays(year, month);

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prev} className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-[#252837] transition-colors text-sm">‹</button>
        <span className="text-sm font-bold text-stone-900 dark:text-stone-50">{MONTH_NAMES[month]} {year}</span>
        <button type="button" onClick={next} className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-[#252837] transition-colors text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(l => (
          <div key={l} className="text-center text-[10px] font-bold text-stone-400 dark:text-stone-600 pb-1">{l}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (d.getMonth() !== month) return <div key={i} className="h-8" />;

          const isPast   = d < new Date(toYMD(today) + "T00:00:00");
          const isSelected = selectedDate ? toYMD(d) === toYMD(selectedDate) : false;
          const status   = getSlotStatus(schedule, d);

          const cellCls = cn(
            "w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs transition-all",
            isPast
              ? "text-stone-300 dark:text-stone-700 cursor-not-allowed"
              : isSelected
                ? cn("text-white font-bold", tokens.pill)
                : status === "booked"
                  ? "bg-red-100 dark:bg-red-950/40 text-red-400 dark:text-red-500 cursor-pointer text-[10px] line-through"
                  : status === "blocked"
                    ? "bg-stone-100 dark:bg-[#252837] text-stone-400 dark:text-stone-600 cursor-pointer"
                    : "text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#252837] cursor-pointer"
          );

          return (
            <div key={i} className="h-8 flex items-center justify-center">
              <button
                type="button"
                disabled={isPast}
                onClick={() => !isPast && onSelect(d)}
                className={cellCls}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3 border-t border-stone-100 dark:border-[#2a2d3e]">
        {[
          { dot: tokens.pill,                                  label: "Selected" },
          { dot: "bg-stone-100 dark:bg-[#252837]",            label: "Blocked"  },
          { dot: "bg-red-200 dark:bg-red-950",                label: "Booked"   },
          { dot: "bg-white dark:bg-[#1c1f2e] border border-stone-200 dark:border-[#2a2d3e]", label: "Available" },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-stone-400 dark:text-stone-500">
            <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", dot)} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface ScheduleManagerProps {
  listingId:    string;
  listingType:  "rent" | "service";
  listingTitle: string;
}

export default function ScheduleManager({ listingId, listingType, listingTitle }: ScheduleManagerProps) {
  const { getSchedule, saveSchedule, addSlot, removeSlot } = useSchedule();

  const existing = getSchedule(listingId);
  const [schedule, setSchedule] = useState<ListingSchedule>(
    existing ?? {
      listingId,
      listingType,
      operatingDays:      listingType === "rent" ? [1,2,3,4,5,6] : [1,2,3,4,5],
      operatingStart:     "09:00",
      operatingEnd:       "17:00",
      advanceBookingDays: 30,
      slots:              [],
    }
  );

  const [tab,          setTab]         = useState<"calendar" | "settings" | "bookings">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockNote,    setBlockNote]   = useState("");
  const [saved,        setSaved]       = useState(false);

  const tokens     = typeTokens(listingType);
  const typeLabel  = listingType === "rent" ? "Rental" : "Service";
  const bookedSlots  = schedule.slots.filter(s => s.status === "booked");
  const blockedSlots = schedule.slots.filter(s => s.status === "blocked");

  const selectedStatus = selectedDate ? getSlotStatus(schedule, selectedDate) : null;
  const selectedYMD    = selectedDate ? toYMD(selectedDate) : null;

  function refreshLocal() {
    const fresh = getSchedule(listingId);
    if (fresh) setSchedule({ ...fresh });
  }

  function handleBlock() {
    if (!selectedDate) return;
    addSlot(listingId, { date: toYMD(selectedDate), status: "blocked", note: blockNote || undefined });
    setBlockNote("");
    setSelectedDate(null);
    setTimeout(refreshLocal, 50);
  }

  function handleUnblock() {
    if (!selectedDate) return;
    const slot = schedule.slots.find(s => s.date === selectedYMD);
    if (slot) removeSlot(listingId, slot.id);
    setSelectedDate(null);
    setTimeout(refreshLocal, 50);
  }

  function handleRemoveSlot(slotId: string) {
    removeSlot(listingId, slotId);
    setTimeout(refreshLocal, 50);
  }

  function handleSaveSettings() {
    saveSchedule(schedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleDay(day: RecurringDay) {
    const days = schedule.operatingDays.includes(day)
      ? schedule.operatingDays.filter(d => d !== day)
      : [...schedule.operatingDays, day].sort() as RecurringDay[];
    setSchedule(s => ({ ...s, operatingDays: days }));
  }

  return (
    <div className="bg-white dark:bg-[#1c1f2e] rounded-2xl border border-stone-200 dark:border-[#2a2d3e] shadow-sm overflow-hidden">

      {/* Header */}
      <div className={cn(
        "px-5 py-4 border-b border-stone-200 dark:border-[#2a2d3e]",
        listingType === "rent" ? "bg-teal-50 dark:bg-teal-950/20" : "bg-violet-50 dark:bg-violet-950/20"
      )}>
        <div className="flex items-center gap-2.5 mb-3">
          <CalendarDays className={cn("w-4 h-4", listingType === "rent" ? "text-teal-600 dark:text-teal-400" : "text-violet-600 dark:text-violet-400")} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-stone-900 dark:text-stone-50">{typeLabel} Schedule</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{listingTitle}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {(["calendar", "settings", "bookings"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                tab === t ? cn("text-white", tokens.pill) : "text-stone-500 dark:text-stone-400 hover:bg-white/60 dark:hover:bg-white/5"
              )}
            >
              {t === "bookings" ? `Bookings (${bookedSlots.length})` : t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">

        {/* ── Calendar tab ── */}
        {tab === "calendar" && (
          <div className="flex flex-col gap-4">
            <ManagerCalendar
              schedule={schedule}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              tokens={tokens}
            />

            {/* Actions for selected date */}
            {selectedDate && (
              <div className="bg-stone-50 dark:bg-[#13151f] rounded-xl p-4 border border-stone-200 dark:border-[#2a2d3e]">
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200 mb-0.5">
                  {selectedDate.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
                <p className={cn(
                  "text-[11px] font-semibold mb-3 capitalize",
                  selectedStatus === "available" ? "text-teal-600 dark:text-teal-400"
                  : selectedStatus === "booked"  ? "text-red-500 dark:text-red-400"
                                                  : "text-stone-400 dark:text-stone-500"
                )}>
                  Status: {selectedStatus}
                  {schedule.slots.find(s => s.date === selectedYMD)?.bookedBy && (
                    ` · Booked by ${schedule.slots.find(s => s.date === selectedYMD)?.bookedBy}`
                  )}
                </p>

                {selectedStatus === "available" && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={blockNote}
                      onChange={e => setBlockNote(e.target.value)}
                      placeholder="Reason (optional) — e.g. Family event"
                      className="w-full text-sm bg-white dark:bg-[#1c1f2e] border border-stone-200 dark:border-[#2a2d3e] rounded-lg px-3 py-2 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 outline-none focus:border-stone-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleBlock}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" /> Block this date
                    </button>
                  </div>
                )}

                {selectedStatus === "blocked" && (
                  <button
                    type="button"
                    onClick={handleUnblock}
                    className={cn("flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors", tokens.btn)}
                  >
                    <Unlock className="w-3.5 h-3.5" /> Unblock this date
                  </button>
                )}

                {selectedStatus === "booked" && (
                  <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2.5">
                    <Info className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-600 dark:text-red-400 leading-relaxed">
                      This date is confirmed as booked. Contact the buyer via messages to make changes.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mt-2 block"
                >
                  Deselect
                </button>
              </div>
            )}

            {/* Blocked dates list */}
            {blockedSlots.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Blocked Dates</p>
                <div className="flex flex-col gap-1.5">
                  {blockedSlots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between bg-stone-50 dark:bg-[#13151f] rounded-xl px-3 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                          {new Date(slot.date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", weekday: "short" })}
                        </p>
                        {slot.note && <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{slot.note}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Settings tab ── */}
        {tab === "settings" && (
          <div className="flex flex-col gap-5">
            {/* Operating days */}
            <div>
              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">Operating Days</p>
              <div className="flex gap-1.5 flex-wrap">
                {DAY_NAMES.map((name, i) => {
                  const day    = i as RecurringDay;
                  const active = schedule.operatingDays.includes(day);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-xs font-bold transition-all",
                        active
                          ? cn("text-white", tokens.pill)
                          : "bg-stone-100 dark:bg-[#252837] text-stone-400 dark:text-stone-500 hover:bg-stone-200 dark:hover:bg-[#2a2d3e]"
                      )}
                    >
                      {name.slice(0, 2)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operating hours */}
            <div>
              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">Operating Hours</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Start",  key: "operatingStart" as const },
                  { label: "End",    key: "operatingEnd"   as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 mb-1">{label} time</p>
                    <div className="flex items-center gap-2 bg-stone-50 dark:bg-[#13151f] border border-stone-200 dark:border-[#2a2d3e] rounded-xl px-3 py-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="time"
                        value={schedule[key]}
                        onChange={e => setSchedule(s => ({ ...s, [key]: e.target.value }))}
                        className="text-sm text-stone-800 dark:text-stone-100 bg-transparent outline-none flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advance booking */}
            <div>
              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">Advance Booking Window</p>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={7} max={90} step={1}
                  value={schedule.advanceBookingDays}
                  onChange={e => setSchedule(s => ({ ...s, advanceBookingDays: Number(e.target.value) }))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-sm font-bold text-stone-800 dark:text-stone-100 w-16 text-right">
                  {schedule.advanceBookingDays}d
                </span>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                Buyers can book up to {schedule.advanceBookingDays} days in advance
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all",
                saved ? "bg-teal-500" : tokens.btn
              )}
            >
              {saved
                ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                : <><Save className="w-4 h-4" /> Save Settings</>
              }
            </button>
          </div>
        )}

        {/* ── Bookings tab ── */}
        {tab === "bookings" && (
          <div>
            {bookedSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#252837] flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                </div>
                <p className="text-sm text-stone-400 dark:text-stone-500">No bookings yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Confirmed Bookings</p>
                {bookedSlots.map(slot => (
                  <div key={slot.id} className="bg-stone-50 dark:bg-[#13151f] rounded-xl px-4 py-3 border border-stone-200 dark:border-[#2a2d3e]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-stone-800 dark:text-stone-100">
                          {new Date(slot.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        </p>
                        {slot.bookedBy && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            By: <span className="font-semibold">{slot.bookedBy}</span>
                          </p>
                        )}
                        {slot.timeWindow && (
                          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                            Time: {slot.timeWindow.replace("-", ":00 – ")}:00
                          </p>
                        )}
                        {slot.note && (
                          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 italic">"{slot.note}"</p>
                        )}
                      </div>
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-500 px-2 py-0.5 rounded-full shrink-0">Booked</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
