"use client";

import { Star } from "lucide-react";
import { type ReviewStats } from "@/utils/ReviewContext";
import { cn } from "@/lib/utils";

export default function RatingSummary({ stats }: { stats: ReviewStats }) {
  const { average, total, breakdown } = stats;
  if (total === 0) return (
    <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
      <Star className="w-4 h-4" />
      <span className="text-sm">No reviews yet</span>
    </div>
  );

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Big score */}
      <div className="text-center">
        <p className="text-4xl font-extrabold text-stone-900 dark:text-stone-50 leading-none">{average.toFixed(1)}</p>
        <div className="flex items-center justify-center gap-0.5 mt-1.5">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className={cn("w-3.5 h-3.5", s <= Math.round(average) ? "fill-amber-400 text-amber-400" : "fill-stone-200 dark:fill-stone-700 text-stone-200 dark:text-stone-700")} />
          ))}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{total} review{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 min-w-[160px] flex flex-col gap-1.5">
        {([5,4,3,2,1] as const).map((star) => {
          const count = breakdown[star] ?? 0;
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-stone-500 dark:text-stone-400 w-2 shrink-0">{star}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <div className="flex-1 h-1.5 bg-stone-100 dark:bg-[#2a2d3e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-400 dark:text-stone-500 w-6 text-right shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
