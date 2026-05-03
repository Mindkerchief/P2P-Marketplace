import { ExtraDetail } from "../_types/listings";

export function RentInfoCard({ extra }: { extra: ExtraDetail }) {
  const hasData =
    extra.minPeriod ||
    extra.availability ||
    extra.deposit ||
    extra.amenities?.length;
  if (!hasData) return null;

  return (
    <div className="bg-white dark:bg-[#1c1f2e] rounded-lg border border-stone-200 dark:border-[#2a2d3e] shadow-sm p-6">
      <h2 className="font-bold text-stone-900 dark:text-stone-50 text-base mb-4">
        Rental Terms
      </h2>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {extra.minPeriod && (
            <div className="bg-stone-50 dark:bg-[#13151f] rounded-lg p-3">
              <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">
                Min. Period
              </p>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                {extra.minPeriod}
              </p>
            </div>
          )}
          {extra.deposit && (
            <div className="bg-stone-50 dark:bg-[#13151f] rounded-lg p-3">
              <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">
                Deposit
              </p>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                {extra.deposit}
              </p>
            </div>
          )}
        </div>

        {extra.amenities && extra.amenities.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2.5">
              Amenities & Features
            </p>
            <div className="flex flex-wrap gap-1.5">
              {extra.amenities.map((a) => (
                <span
                  key={a}
                  className="text-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
