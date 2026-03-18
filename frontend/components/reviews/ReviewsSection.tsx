"use client";

import { useState } from "react";
import { Star, SlidersHorizontal } from "lucide-react";
import { useReviews } from "@/utils/ReviewContext";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import WriteReviewModal from "./WriteReviewModal";
import { cn } from "@/lib/utils";

type SortOrder = "newest" | "highest" | "lowest" | "helpful";
type FilterStar = 0 | 1 | 2 | 3 | 4 | 5;

interface ReviewsSectionProps {
  sellerId: string;
  sellerName: string;
  currentUserId?: string;
  isOwnProfile?: boolean;
}

export default function ReviewsSection({
  sellerId, sellerName, currentUserId, isOwnProfile = false,
}: ReviewsSectionProps) {
  const { getSellerReviews, getSellerStats, canReview } = useReviews();
  const [sort,        setSort]        = useState<SortOrder>("newest");
  const [filterStar,  setFilterStar]  = useState<FilterStar>(0);
  const [writeOpen,   setWriteOpen]   = useState(false);
  const [showAll,     setShowAll]     = useState(false);

  const reviews = getSellerReviews(sellerId);
  const stats   = getSellerStats(sellerId);

  const canLeaveReview = currentUserId
    ? !isOwnProfile && canReview(currentUserId, sellerId)
    : false;

  // Filter by star
  const filtered = filterStar === 0
    ? reviews
    : reviews.filter((r) => r.rating === filterStar);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest")  return b.createdAt.getTime() - a.createdAt.getTime();
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest")  return a.rating - b.rating;
    if (sort === "helpful") return b.helpful - a.helpful;
    return 0;
  });

  const visible = showAll ? sorted : sorted.slice(0, 3);

  return (
    <div>
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50">Reviews</h2>
          {stats.total > 0 && (
            <span className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              {stats.average.toFixed(1)}
              <span className="text-stone-400 dark:text-stone-500 font-normal text-xs">({stats.total})</span>
            </span>
          )}
        </div>
        {canLeaveReview && (
          <button
            onClick={() => setWriteOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#1a2235] hover:bg-[#2a3650] text-white transition-colors"
          >
            <Star className="w-3.5 h-3.5" /> Write a Review
          </button>
        )}
      </div>

      {/* ── Rating summary ── */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-[#1c1f2e] rounded-2xl border border-stone-200 dark:border-[#2a2d3e] p-5 mb-5">
          <RatingSummary stats={stats} />
        </div>
      )}

      {/* ── Filters & sort ── */}
      {stats.total > 0 && (
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          {/* Star filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {([0, 5, 4, 3, 2, 1] as FilterStar[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStar(s)}
                className={cn(
                  "flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all",
                  filterStar === s
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold"
                    : "border-stone-200 dark:border-[#2a2d3e] text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-500"
                )}
              >
                {s === 0 ? "All" : <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{s}</>}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              className="text-xs bg-transparent text-stone-500 dark:text-stone-400 border-none outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Review list ── */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-[#1c1f2e] rounded-2xl border border-stone-200 dark:border-[#2a2d3e] gap-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#252837] flex items-center justify-center">
            <Star className="w-5 h-5 text-stone-300 dark:text-stone-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              {filterStar > 0 ? `No ${filterStar}-star reviews yet` : "No reviews yet"}
            </p>
            {canLeaveReview && filterStar === 0 && (
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Be the first to review this seller</p>
            )}
          </div>
          {canLeaveReview && filterStar === 0 && (
            <button onClick={() => setWriteOpen(true)} className="text-xs font-semibold px-4 py-2 rounded-full bg-[#1a2235] text-white hover:bg-[#2a3650] transition-colors mt-1">
              Write a Review
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              currentUserId={currentUserId}
              isSeller={isOwnProfile}
            />
          ))}

          {sorted.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full py-3 rounded-2xl border border-stone-200 dark:border-[#2a2d3e] text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#252837] transition-all font-medium"
            >
              {showAll ? "Show less ↑" : `Show all ${sorted.length} reviews ↓`}
            </button>
          )}
        </div>
      )}

      {/* ── Write review modal ── */}
      <WriteReviewModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        sellerId={sellerId}
        sellerName={sellerName}
        reviewerId={currentUserId ?? "guest"}
        reviewerName="You"
      />
    </div>
  );
}
