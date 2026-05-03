import { Clock, MapPin } from 'lucide-react';
import { ExtraDetail } from '../_types/listings';

export function ServiceInfoCard({ extra }: { extra: ExtraDetail }) {
  const hasData =
    extra.turnaround ||
    extra.serviceArea ||
    extra.inclusions?.filter(Boolean).length;
  if (!hasData) return null;

  return (
    <div className="bg-white dark:bg-[#1c1f2e] rounded-lg border border-stone-200 dark:border-[#2a2d3e] shadow-sm p-6">
      <h2 className="font-bold text-stone-900 dark:text-stone-50 text-base mb-4">
        Service Details
      </h2>
      <div className="flex flex-col gap-4">
        {(extra.turnaround || extra.serviceArea) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {extra.turnaround && (
              <div className="bg-stone-50 dark:bg-[#13151f] rounded-lg p-3">
                <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">
                  Turnaround
                </p>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  {extra.turnaround}
                </p>
              </div>
            )}
            {extra.serviceArea && (
              <div className="bg-stone-50 dark:bg-[#13151f] rounded-lg p-3">
                <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">
                  Service Area
                </p>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  {extra.serviceArea}
                </p>
              </div>
            )}
          </div>
        )}

        {extra.inclusions && extra.inclusions.filter(Boolean).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">
              What&apos;s Included
            </p>
            <div className="flex flex-wrap gap-1.5">
              {extra.inclusions.filter(Boolean).map((item) => (
                <span
                  key={item}
                  className="text-sm bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2.5 py-1 rounded-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
