import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  MessageCircle,
  Pen,
  Trash,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileStickyButtonsProps {
  isOwnListing: boolean;
  visitorUnavailableState: boolean;
  isSold: boolean;
  isSell: boolean;
  isRent: boolean;
  isDeletedState: boolean;
  isListingAvailable: boolean;
  toggling: boolean;
  deleting: boolean;
  listingId: string;
  router: any;
  handleMessage: () => void;
  handleBuy: () => void;
  handleListingVisibility: () => void;
  handleRemoveListing: () => void;
}

export function MobileStickyButtons({
  isOwnListing,
  visitorUnavailableState,
  isSold,
  isSell,
  isRent,
  isDeletedState,
  isListingAvailable,
  toggling,
  deleting,
  listingId,
  router,
  handleMessage,
  handleBuy,
  handleListingVisibility,
  handleRemoveListing,
}: MobileStickyButtonsProps) {
  return (
    <>
      {!isOwnListing ? (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1c1f2e] border-t border-stone-200 dark:border-[#2a2d3e] px-4 py-3 flex gap-3 shadow-lg">
          {visitorUnavailableState ? (
            <Button
              variant={'outline'}
              size={'lg'}
              disabled
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-stone-400/80 text-white text-sm font-bold cursor-not-allowed opacity-95"
            >
              <AlertTriangle className="w-4 h-4" /> Unavailable
            </Button>
          ) : isSold ? (
            <Button
              variant={'outline'}
              size={'lg'}
              disabled
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600/90 text-white text-sm font-bold cursor-not-allowed opacity-95"
            >
              <CheckCircle className="w-4 h-4" /> Sold
            </Button>
          ) : (
            <>
              <Button
                variant={'outline'}
                size={'lg'}
                onClick={handleMessage}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-stone-200 dark:border-[#2a2d3e] text-stone-700 dark:text-stone-200 text-sm font-semibold"
              >
                <MessageCircle className="w-4 h-4" /> Message
              </Button>

              <Button
                size={'lg'}
                onClick={handleBuy}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-bold',
                  isSell
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : isRent
                      ? 'bg-emerald-700 hover:bg-emerald-600'
                      : 'bg-violet-700 hover:bg-violet-600',
                )}
              >
                {/* className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#3A4A6A] text-white text-sm font-bold"> */}
                <Zap className="w-4 h-4" />
                {isSell ? 'Offer' : isRent ? 'Rent' : 'Book'}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1c1f2e] border-t border-stone-200 dark:border-[#2a2d3e] px-4 py-3 flex gap-3 shadow-lg">
          {isDeletedState || isSold ? (
            <Button
              disabled
              className="flex-1 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-stone-400/80 text-white text-sm font-bold cursor-not-allowed opacity-95"
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
                  router.push(`/listing/${listingId}/edit`);
                }}
                className="flex-1 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <Pen className="w-4 h-4" />
                Edit
              </Button>

              {/* Hide Listing Button */}
              <Button
                variant={'outline'}
                size={'lg'}
                onClick={handleListingVisibility}
                disabled={toggling}
                className="flex-1 flex rounded-lg border-stone-200 dark:border-[#2a2d3e] text-stone-700 dark:text-stone-200 bg-white dark:bg-transparent text-sm font-semibold hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-[#252837] transition-all"
              >
                {isListingAvailable ? (
                  <>
                    <EyeOff className="w-4 h-4" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> Show
                  </>
                )}
              </Button>

              {/* Remove Listing Button */}
              <Button
                variant={'destructive'}
                size={'lg'}
                onClick={handleRemoveListing}
                disabled={deleting}
                className="flex-1 flex rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Trash className="w-4 h-4" />
                {deleting ? 'Removing...' : 'Remove'}
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
