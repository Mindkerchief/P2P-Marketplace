import { Plus } from 'lucide-react';
import Link from 'next/link';

export function AddListingCard() {
  return (
    <Link href="/create" className="block group">
      <div className="bg-white dark:bg-[#1c1f2e] rounded-lg overflow-hidden border border-dashed border-stone-300 dark:border-[#3a3e52] hover:-translate-y-1 hover:shadow-md transition-all duration-200 h-full">
        <div className="relative aspect-square bg-stone-50 dark:bg-[#13151f] flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-stone-900 dark:bg-stone-200 text-white dark:text-stone-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Plus className="w-5 h-5" />
          </div>
        </div>
        <div className="p-3">
          <p className="text-stone-800 dark:text-stone-100 font-semibold text-sm leading-tight">
            Add Listing
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
            Post a new item or service
          </p>
        </div>
      </div>
    </Link>
  );
}
