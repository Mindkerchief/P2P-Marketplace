"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import StarRating from "./StarRating";
import { useReviews } from "@/utils/ReviewContext";
import { cn } from "@/lib/utils";

const QUICK_TAGS = [
  "Item as described",
  "Fast replies",
  "Smooth transaction",
  "Above & beyond",
  "Trusted seller",
];

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  listingId?: string;
  listingTitle?: string;
  reviewerId: string;
  reviewerName: string;
}

export default function WriteReviewModal({
  open, onClose, sellerId, sellerName,
  listingId, listingTitle, reviewerId, reviewerName,
}: WriteReviewModalProps) {
  const { addReview } = useReviews();
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState("");
  const [tags,      setTags]      = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  if (!open) return null;

  function toggleTag(t: string) {
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function handleSubmit() {
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (comment.trim().length < 10) { setError("Please write at least 10 characters."); return; }
    setError("");
    addReview({ reviewerId, reviewerName, sellerId, listingId, listingTitle, rating, comment: comment.trim(), tags });
    setSubmitted(true);
  }

  function handleClose() {
    setRating(0); setComment(""); setTags([]); setSubmitted(false); setError("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white dark:bg-[#1a2235] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#1a2235] px-6 py-5 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-white font-bold text-lg">Leave a Review</h2>
          <p className="text-slate-400 text-sm mt-0.5">for <span className="text-white font-medium">{sellerName}</span></p>
          {listingTitle && (
            <p className="text-slate-500 text-xs mt-1">re: {listingTitle}</p>
          )}
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-1">Review Submitted!</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">Thanks for helping the community.</p>
              <button onClick={handleClose} className="mt-5 w-full py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold hover:opacity-90 transition-opacity">
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Star rating */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
                  Overall Rating
                </label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>

              {/* Quick tags */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
                  Quick Tags <span className="normal-case font-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-all",
                        tags.includes(t)
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold"
                          : "border-stone-200 dark:border-[#2a2d3e] text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-500"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this seller. Was the item as described? How was communication?"
                  className="w-full bg-stone-50 dark:bg-[#13151f] border border-stone-200 dark:border-[#2a2d3e] rounded-xl px-3 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 outline-none focus:border-stone-400 dark:focus:border-stone-500 resize-none"
                />
                <div className="flex justify-between mt-1">
                  {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
                  <p className="text-xs text-stone-400 dark:text-stone-500">{comment.length} / 500</p>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-full bg-[#1a2235] hover:bg-[#2a3650] text-white text-sm font-bold transition-colors"
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
