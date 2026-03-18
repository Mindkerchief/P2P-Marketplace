"use client";

import { useState } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { type Review } from "@/utils/ReviewContext";
import { useReviews } from "@/utils/ReviewContext";
import { cn } from "@/lib/utils";

function timeAgo(date: Date) {
  const d = date instanceof Date ? date : new Date(date);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: days > 365 ? "numeric" : undefined });
}

const TAG_COLORS: Record<string, string> = {
  "Item as described": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
  "Fast replies":      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  "Smooth transaction":"bg-stone-100 dark:bg-[#252837] text-stone-600 dark:text-stone-300",
  "Above & beyond":    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  "Trusted seller":    "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
};

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  isSeller?: boolean; // can reply
}

export default function ReviewCard({ review, currentUserId, isSeller = false }: ReviewCardProps) {
  const { voteHelpful, addReply } = useReviews();
  const [replyOpen, setReplyOpen]   = useState(false);
  const [replyText, setReplyText]   = useState(review.sellerReply ?? "");
  const [expanded, setExpanded]     = useState(false);

  const hasVoted = currentUserId ? review.helpfulVoters.includes(currentUserId) : false;
  const TRUNCATE = 180;
  const long     = review.comment.length > TRUNCATE;

  const initials = review.reviewerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  function submitReply() {
    if (!replyText.trim()) return;
    addReply(review.id, replyText.trim());
    setReplyOpen(false);
  }

  return (
    <div className="bg-white dark:bg-[#1c1f2e] rounded-2xl border border-stone-200 dark:border-[#2a2d3e] p-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3a4a6a] to-[#1e2a40] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">{review.reviewerName}</p>
            {review.listingTitle && (
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">re: {review.listingTitle}</p>
            )}
          </div>
        </div>

        {/* Stars + date */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-0.5 justify-end">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={cn("w-3.5 h-3.5", s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 dark:fill-stone-700 text-stone-200 dark:text-stone-700")} />
            ))}
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">{timeAgo(review.createdAt)}</p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
        {long && !expanded ? review.comment.slice(0, TRUNCATE) + "…" : review.comment}
      </p>
      {long && (
        <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 mt-1 transition-colors">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show more</>}
        </button>
      )}

      {/* Tags */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {review.tags.map((tag) => (
            <span key={tag} className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", TAG_COLORS[tag] ?? "bg-stone-100 dark:bg-[#252837] text-stone-500 dark:text-stone-400")}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Seller reply */}
      {review.sellerReply && (
        <div className="mt-3 ml-4 pl-4 border-l-2 border-amber-200 dark:border-amber-800">
          <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1">Seller's response</p>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{review.sellerReply}</p>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 dark:border-[#252837]">
        {/* Helpful vote */}
        <button
          onClick={() => currentUserId && voteHelpful(review.id, currentUserId)}
          className={cn(
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all",
            hasVoted
              ? "border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400"
              : "border-stone-200 dark:border-[#2a2d3e] text-stone-400 dark:text-stone-500 hover:border-stone-300 dark:hover:border-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
          )}
        >
          <ThumbsUp className="w-3 h-3" />
          Helpful {review.helpful > 0 && `(${review.helpful})`}
        </button>

        {/* Reply (seller only, no existing reply) */}
        {isSeller && !review.sellerReply && (
          <button
            onClick={() => setReplyOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-stone-200 dark:border-[#2a2d3e] text-stone-400 dark:text-stone-500 hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-all"
          >
            <MessageSquare className="w-3 h-3" />
            Reply
          </button>
        )}
      </div>

      {/* Reply input */}
      {replyOpen && (
        <div className="mt-3 ml-4">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply to this review…"
            className="w-full text-sm bg-stone-50 dark:bg-[#13151f] border border-stone-200 dark:border-[#2a2d3e] rounded-xl px-3 py-2.5 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 outline-none focus:border-stone-400 dark:focus:border-stone-500 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setReplyOpen(false)} className="text-xs px-3 py-1.5 rounded-full border border-stone-200 dark:border-[#2a2d3e] text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#252837] transition-colors">
              Cancel
            </button>
            <button onClick={submitReply} className="text-xs px-4 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold hover:opacity-90 transition-opacity">
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
