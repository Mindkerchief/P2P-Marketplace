import {
  AlertTriangle,
  Bookmark,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  MessageCircle,
  Package,
  Pen,
  Share2,
  Trash,
  Zap
} from 'lucide-react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';

import type { PostCardProps } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice, formatTimeAgo } from '@/utils/string-builder';

export function DisplayListingCard(
  listing: PostCardProps,
  handleToggleBookmark: () => Promise<void>,
  isBookmarking: boolean,
  isBookmarked: boolean,
  isOwnListing: boolean,
  isDeletedState: boolean,
  isSold: boolean,
  router: AppRouterInstance,
  id: string,
  handleListingVisibility: () => Promise<void>,
  toggling: boolean,
  isListingAvailable: boolean,
  handleRemoveListing: () => Promise<void>,
  deleting: boolean,
  visitorUnavailableState: boolean,
  isSell: boolean,
  handleBuy: () => void,
  isRent: boolean,
  isService: boolean,
  handleMessage: () => Promise<void>,
  messaging: boolean,
) {
  return (
    <div className="bg-white dark:bg-[#1c1f2e] rounded-lg border border-stone-200 dark:border-[#2a2d3e] shadow-sm p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h1 className="text-md lg:text-lg font-bold text-stone-900 dark:text-stone-50 leading-tight">
          {listing.title}
        </h1>
        <div className="flex gap-1.5 shrink-0">
          <Button
            variant={'secondary'}
            onClick={handleToggleBookmark}
            disabled={isBookmarking}
            className={cn(
              'w-9 h-9 rounded-lg border disabled:opacity-60 disabled:cursor-not-allowed',
              isBookmarked
                ? 'border-rose-200 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-800 text-rose-500'
                : 'bg-transparent text-stone-400 dark:text-stone-500',
            )}
          >
            <Bookmark
              className={cn('w-4 h-4', isBookmarked && 'fill-rose-500')}
            />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() =>
              toast.info('Link copied to clipboard!', {
                position: 'top-center',
              })
            }
            className="w-9 h-9 rounded-lg bg-transparent border border-stone-200 dark:border-[#2a2d3e] text-stone-400 dark:text-stone-500"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-xl lg:text-2xl font-extrabold text-amber-700 dark:text-amber-500">
          {formatPrice(listing.price)}
        </span>
        {listing.priceUnit && (
          <span className="text-black dark:text-white text-sm">
            {listing.priceUnit}
          </span>
        )}
      </div>

      {/* Location + posted */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-black dark:text-white mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {listing.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Posted {formatTimeAgo(listing.postedAt)}
        </span>
      </div>

      {/* ── CTA buttons ── */}
      {isOwnListing ? (
        <div className="flex flex-col gap-3">
          {isDeletedState || isSold ? (
            <Button
              disabled
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-stone-400/80 text-white text-sm font-bold cursor-not-allowed opacity-95"
            >
              <AlertTriangle className="w-4 h-4" /> Unavailable
            </Button>
          ) : (
            <>
              {/* Edit Listing Button */}
              <Button
                variant={'default'}
                size={'lg'}
                onClick={() => {
                  router.push(`/listing/${id}/edit`);
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <Pen className="w-4 h-4" />
                Edit Listing
              </Button>

              {/* Hide Listing Button */}
              <Button
                variant={'outline'}
                size={'lg'}
                onClick={handleListingVisibility}
                disabled={toggling}
                className="rounded-lg border-stone-200 dark:border-[#2a2d3e] text-stone-700 dark:text-stone-200 bg-white dark:bg-transparent text-sm font-semibold hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-[#252837] transition-all"
              >
                {isListingAvailable ? (
                  <>
                    <EyeOff className="w-4 h-4" /> Hide Listing
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> Show Listing
                  </>
                )}
              </Button>

              {/* Remove Listing Button */}
              <Button
                variant={'destructive'}
                size={'lg'}
                onClick={handleRemoveListing}
                disabled={deleting}
                className="rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Trash className="w-4 h-4" />
                {deleting ? 'Removing...' : 'Remove Listing'}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visitorUnavailableState ? (
            <Button
              variant={'outline'}
              size={'lg'}
              disabled
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-stone-400/80 text-white text-sm font-bold cursor-not-allowed opacity-95"
            >
              <AlertTriangle className="w-4 h-4" /> Unavailable
            </Button>
          ) : isSold ? (
            <Button
              variant={'outline'}
              size={'lg'}
              disabled
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-emerald-600/90 text-white text-sm font-bold cursor-not-allowed opacity-95"
            >
              <CheckCircle className="w-4 h-4" /> Sold
            </Button>
          ) : (
            <>
              {isSell && (
                <Button
                  size={'lg'}
                  onClick={handleBuy}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600"
                >
                  <Zap className="w-4 h-4" /> Make an Offer
                </Button>
              )}
              {isRent && (
                <Button
                  size={'lg'}
                  onClick={handleBuy}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600"
                >
                  <Package className="w-4 h-4" /> Request to Rent
                </Button>
              )}
              {isService && (
                <Button
                  size={'lg'}
                  onClick={handleBuy}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-600"
                >
                  <CheckCircle className="w-4 h-4" /> Book Service
                </Button>
              )}
              <Button
                variant={'outline'}
                size={'lg'}
                onClick={handleMessage}
                disabled={messaging}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-stone-200 dark:border-[#2a2d3e] text-stone-700 dark:text-stone-200 text-sm font-semibold hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-[#252837]"
              >
                <MessageCircle className="w-4 h-4" />{' '}
                {messaging ? 'Opening chat...' : 'Message Seller'}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
