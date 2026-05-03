import { Star } from 'lucide-react';

import { ImageLink } from '@/components/image/ImageLink';
import VerificationBadge from '@/components/badge/VerificationBadge';
import { cn } from '@/lib/utils';
import type { ProfileReviewItem } from '@/services/profileService';
import { formatPrice } from '@/utils/string-builder';
import { useUser } from '@/utils/UserContext';

export function ProfileReviewCard({ review }: { review: ProfileReviewItem }) {
  const { user } = useUser();
  const reviewerName =
    (review.reviewer.name ?? '').trim() || 'Anonymous Reviewer';
  const isReviewerVerified =
    (review.reviewer.status ?? '').trim().toLowerCase() === 'verified';
  const currentUserId = (user?.userId ?? '').trim();
  const reviewerId = (review.reviewer.id ?? '').trim();
  const reviewerProfileHref =
    reviewerId !== '' && reviewerId === currentUserId
      ? '/profile'
      : `/profile?userId=${reviewerId}`;
  const listingTypeLabel = (() => {
    const type = (review.listing.type ?? '').trim().toLowerCase();
    if (type === 'SELL') return 'For Sale';
    if (type === 'RENT') return 'For Rent';
    if (type === 'SERVICE') return 'Service';
    return '';
  })();

  return (
    <div className="bg-white dark:bg-[#1c1f2e] rounded-lg border border-stone-200 dark:border-[#2a2d3e] shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ImageLink
            href={reviewerProfileHref}
            src={review.reviewer.profileImageUrl}
            type="profile"
            label={reviewerName}
            className="w-9 h-9 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                {reviewerName}
              </p>
              <VerificationBadge verified={isReviewerVerified} />
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500">
              {review.reviewDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={cn(
                'w-3.5 h-3.5',
                value <= review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-stone-300 dark:text-stone-600',
              )}
            />
          ))}
        </div>
      </div>

      {review.comment && review.comment.trim() !== '' && (
        <p className="mt-3 text-sm leading-relaxed text-stone-700 dark:text-stone-200">
          {review.comment}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 rounded-lg border border-stone-200 dark:border-[#2a2d3e] bg-stone-50 dark:bg-[#13151f] p-2.5 hover:border-stone-300 dark:hover:border-[#3a3e52] transition-colors">
        <ImageLink
          href={`/listing/${review.listing.id}`}
          src={review.listing.imageUrl}
          type="thumbnail"
          label={review.listing.title}
          className="w-15 h-15"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 line-clamp-1">
              {review.listing.title}
            </p>
            {listingTypeLabel && (
              <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                {listingTypeLabel}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-amber-700 dark:text-amber-500 mt-0.5">
            {formatPrice(review.listing.price)}
            <span className="text-[11px] font-normal text-stone-400 dark:text-stone-500 ml-1">
              {review.listing.priceUnit}
            </span>
          </p>
          {/* Listing Location */}
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 truncate">
            {review.listing.location || 'Location unavailable'}
          </p>
        </div>
      </div>
    </div>
  );
}
