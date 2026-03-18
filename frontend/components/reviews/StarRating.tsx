"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const SIZES = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };
const LABELS = ["", "Terrible", "Poor", "Okay", "Good", "Excellent"];

export default function StarRating({ value, onChange, size = "md", readonly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn("transition-transform", !readonly && "hover:scale-110 cursor-pointer", readonly && "cursor-default")}
          aria-label={`${s} star`}
        >
          <Star
            className={cn(
              SIZES[size],
              "transition-colors",
              s <= active ? "fill-amber-400 text-amber-400" : "fill-stone-200 dark:fill-stone-700 text-stone-200 dark:text-stone-700"
            )}
          />
        </button>
      ))}
      {!readonly && active > 0 && (
        <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">{LABELS[active]}</span>
      )}
    </div>
  );
}
