"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, Clock, MapPin, PackageCheck,
  XCircle, ChevronDown, ChevronUp, ShieldCheck,
  Truck, CalendarCheck, Loader2,
} from "lucide-react";
import { type OrderStatus, type ListingType } from "@/types/messaging";
import { cn } from "@/lib/utils";

// ── Storage key per conversation ──────────────────────────────────────────────
function storageKey(conversationId: string) {
  return `p2p_order_status_${conversationId}`;
}

// ── Status config ─────────────────────────────────────────────────────────────
interface StatusConfig {
  label: string;
  sellerLabel: string;    // action label for seller button
  icon: React.ReactNode;
  color: string;          // text color
  bg: string;             // badge bg
  border: string;
  description: (type: ListingType) => string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    sellerLabel: "Confirm Order",
    icon: <Clock className="w-3.5 h-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    description: (t) =>
      t === "SELL"    ? "Waiting for seller to confirm the sale."
      : t === "RENT"  ? "Waiting for seller to confirm the rental."
                      : "Waiting for seller to confirm the booking.",
  },
  CONFIRMED: {
    label: "Confirmed",
    sellerLabel: "Set Meetup / Schedule",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-300 dark:border-blue-700",
    description: (t) =>
      t === "SELL"    ? "Order confirmed! Arrange pickup or delivery with the seller."
      : t === "RENT"  ? "Rental confirmed! Coordinate the pickup schedule."
                      : "Booking confirmed! Coordinate the service schedule.",
  },
  MEETUP_SET: {
    label: "Meetup Set",
    sellerLabel: "Mark as Completed",
    icon: <CalendarCheck className="w-3.5 h-3.5" />,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    border: "border-violet-300 dark:border-violet-700",
    description: (t) =>
      t === "SELL"    ? "Meetup is scheduled. Complete the transaction at the agreed place."
      : t === "RENT"  ? "Pickup/return schedule is set. Proceed with the rental."
                      : "Service schedule is confirmed. Service will be done soon.",
  },
  COMPLETED: {
    label: "Completed",
    sellerLabel: "Completed ✓",
    icon: <PackageCheck className="w-3.5 h-3.5" />,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-900/30",
    border: "border-teal-300 dark:border-teal-700",
    description: (t) =>
      t === "SELL"    ? "Transaction complete! Don't forget to leave a review."
      : t === "RENT"  ? "Rental completed! Item has been returned."
                      : "Service completed! Hope everything went well.",
  },
  CANCELLED: {
    label: "Cancelled",
    sellerLabel: "Cancelled",
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
    description: () => "This transaction has been cancelled.",
  },
};

// Flow: PENDING → CONFIRMED → MEETUP_SET → COMPLETED
const SELLER_FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "MEETUP_SET", "COMPLETED"];

// Step indicator labels per listing type
function stepLabel(status: OrderStatus, type: ListingType): string {
  if (type === "RENT") {
    return { PENDING: "Pending", CONFIRMED: "Confirmed", MEETUP_SET: "Pickup Set", COMPLETED: "Returned", CANCELLED: "Cancelled" }[status];
  }
  if (type === "SERVICE") {
    return { PENDING: "Pending", CONFIRMED: "Booked", MEETUP_SET: "Scheduled", COMPLETED: "Done", CANCELLED: "Cancelled" }[status];
  }
  return { PENDING: "Pending", CONFIRMED: "Confirmed", MEETUP_SET: "Meetup Set", COMPLETED: "Sold", CANCELLED: "Cancelled" }[status];
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StatusStepper({ current, type }: { current: OrderStatus; type: ListingType }) {
  const steps: OrderStatus[] = ["PENDING", "CONFIRMED", "MEETUP_SET", "COMPLETED"];
  const currentIdx = steps.indexOf(current);
  if (current === "CANCELLED") return null;

  return (
    <div className="flex items-center gap-0 mt-3">
      {steps.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all",
                done   ? "bg-teal-500 text-white"
                : active ? "bg-amber-500 text-white ring-2 ring-amber-300 dark:ring-amber-700"
                         : "bg-stone-200 dark:bg-[#2a2d3e] text-stone-400 dark:text-stone-600"
              )}>
                {done ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-[9px] font-medium text-center leading-tight max-w-[48px] truncate",
                done   ? "text-teal-600 dark:text-teal-400"
                : active ? "text-amber-600 dark:text-amber-400"
                         : "text-stone-400 dark:text-stone-600"
              )}>
                {stepLabel(step, type)}
              </span>
            </div>
            {/* Connector */}
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-1 rounded transition-all",
                i < currentIdx ? "bg-teal-400 dark:bg-teal-600" : "bg-stone-200 dark:bg-[#2a2d3e]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Confirm modal for seller actions ─────────────────────────────────────────
function ActionModal({
  nextStatus, listingType, onConfirm, onClose, loading,
}: {
  nextStatus: OrderStatus;
  listingType: ListingType;
  onConfirm: (note: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [note, setNote] = useState("");
  const cfg = STATUS_CONFIG[nextStatus];

  const placeholders: Record<OrderStatus, string> = {
    PENDING: "",
    CONFIRMED: "e.g. Let's meet at SM Calamba on Saturday at 2pm",
    MEETUP_SET: "e.g. Meet at the agreed location, bring valid ID",
    COMPLETED: "e.g. Thanks for the smooth transaction!",
    CANCELLED: "e.g. Sorry, item is no longer available",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#1c1f2e] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-[#1a2235] px-5 py-4">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            {cfg.icon} {cfg.sellerLabel}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {nextStatus === "COMPLETED"
              ? listingType === "SELL" ? "Mark this item as sold"
                : listingType === "RENT" ? "Mark this rental as completed"
                : "Mark this service as done"
              : nextStatus === "CANCELLED" ? "Cancel this transaction"
              : "Update the order status for this buyer"}
          </p>
        </div>
        <div className="p-5">
          <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 block mb-1.5">
            Message to buyer <span className="font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={placeholders[nextStatus]}
            className="w-full bg-stone-50 dark:bg-[#13151f] border border-stone-200 dark:border-[#2a2d3e] rounded-xl px-3 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 outline-none focus:border-stone-400 dark:focus:border-stone-500 resize-none"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-stone-200 dark:border-[#2a2d3e] text-stone-600 dark:text-stone-300 text-sm font-semibold hover:bg-stone-50 dark:hover:bg-[#252837] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(note)}
              disabled={loading}
              className={cn(
                "flex-1 py-2.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2",
                nextStatus === "CANCELLED"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-[#1a2235] hover:bg-[#2a3650] text-white",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface OrderStatusPanelProps {
  conversationId: string;
  listingId: string;
  listingType: ListingType;
  listingTitle: string;
  isSeller: boolean;
  currentUserId: string;
}

export default function OrderStatusPanel({
  conversationId, listingId, listingType, listingTitle, isSeller, currentUserId,
}: OrderStatusPanelProps) {
  const [status,      setStatus]      = useState<OrderStatus>("PENDING");
  const [updatedAt,   setUpdatedAt]   = useState<string | null>(null);
  const [note,        setNote]        = useState<string | null>(null);
  const [expanded,    setExpanded]    = useState(true);
  const [modal,       setModal]       = useState<OrderStatus | null>(null);
  const [loading,     setLoading]     = useState(false);

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(conversationId));
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        setStatus(saved.status ?? "PENDING");
        setUpdatedAt(saved.updatedAt ?? null);
        setNote(saved.note ?? null);
      } catch {
        // ignore
      }
    }
  }, [conversationId]);

  function persist(newStatus: OrderStatus, newNote: string) {
    const payload = { status: newStatus, updatedAt: new Date().toISOString(), updatedBy: currentUserId, note: newNote || null };
    localStorage.setItem(storageKey(conversationId), JSON.stringify(payload));
    setStatus(newStatus);
    setUpdatedAt(payload.updatedAt);
    setNote(payload.note ?? null);
  }

  function handleAction(targetStatus: OrderStatus) {
    setModal(targetStatus);
  }

  function handleConfirm(noteText: string) {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      persist(modal!, noteText);
      setLoading(false);
      setModal(null);
    }, 700);
  }

  const cfg      = STATUS_CONFIG[status];
  const nextIdx  = SELLER_FLOW.indexOf(status) + 1;
  const nextStep = nextIdx < SELLER_FLOW.length ? SELLER_FLOW[nextIdx] : null;
  const canAdvance = isSeller && nextStep !== null && status !== "COMPLETED" && status !== "CANCELLED";
  const canCancel  = isSeller && status !== "COMPLETED" && status !== "CANCELLED";

  const typeLabel = listingType === "SELL" ? "Sale" : listingType === "RENT" ? "Rental" : "Service";
  const timeStr   = updatedAt ? new Date(updatedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <>
      <div className={cn(
        "mx-3 mb-2 rounded-xl border overflow-hidden transition-all",
        cfg.border,
        cfg.bg.replace("bg-", "bg-").replace("/30", "/20")
      )}>
        {/* Header row */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn("shrink-0", cfg.color)}>{cfg.icon}</span>
            <span className={cn("text-xs font-bold", cfg.color)}>{typeLabel} Status:</span>
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", cfg.bg, cfg.color, cfg.border, "border")}>
              {cfg.label}
            </span>
            {status === "COMPLETED" && (
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {timeStr && (
              <span className="text-[10px] text-stone-400 dark:text-stone-500 hidden sm:block">{timeStr}</span>
            )}
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              : <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
            }
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-3.5 pb-3.5 border-t border-stone-200/60 dark:border-white/5">
            {/* Step progress */}
            <StatusStepper current={status} type={listingType} />

            {/* Description */}
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 leading-relaxed">
              {cfg.description(listingType)}
            </p>

            {/* Seller note to buyer */}
            {note && (
              <div className="mt-2.5 flex items-start gap-2 bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2">
                <Truck className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed italic">"{note}"</p>
              </div>
            )}

            {/* Seller action buttons */}
            {isSeller && status !== "CANCELLED" && status !== "COMPLETED" && (
              <div className="flex gap-2 mt-3">
                {canAdvance && (
                  <button
                    onClick={() => handleAction(nextStep!)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all",
                      "bg-[#1a2235] hover:bg-[#2a3650] text-white"
                    )}
                  >
                    {STATUS_CONFIG[nextStep!].icon}
                    {STATUS_CONFIG[nextStep!].sellerLabel}
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => handleAction("CANCELLED")}
                    className="px-4 py-2 rounded-full text-xs font-semibold border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}

            {/* Completed actions */}
            {status === "COMPLETED" && (
              <div className="mt-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-center">
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                  {listingType === "SELL" ? "🎉 Item sold successfully!" : listingType === "RENT" ? "🎉 Rental completed!" : "🎉 Service completed!"}
                </p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5">
                  {!isSeller ? "Leave a review to help other buyers!" : "Thanks for using P2P Marketplace!"}
                </p>
              </div>
            )}

            {/* Cancelled state */}
            {status === "CANCELLED" && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium">Transaction cancelled</p>
                {isSeller && (
                  <button
                    onClick={() => { persist("PENDING", ""); }}
                    className="w-full mt-2 py-1.5 rounded-full text-xs font-semibold border border-stone-200 dark:border-[#2a2d3e] text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#252837] transition-colors"
                  >
                    Restart Transaction
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action modal */}
      {modal && (
        <ActionModal
          nextStatus={modal}
          listingType={listingType}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
          loading={loading}
        />
      )}
    </>
  );
}
