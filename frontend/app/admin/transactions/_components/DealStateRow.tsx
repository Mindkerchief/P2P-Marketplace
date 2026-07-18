import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function DealStateRow({ label, agreed }: { label: string; agreed: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {agreed ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
      )}
      <span
        className={cn(
          'text-xs',
          agreed
            ? 'text-emerald-600 dark:text-emerald-300'
            : 'text-amber-600 dark:text-amber-300',
        )}
      >
        {label}: {agreed ? 'Agreed' : 'Pending'}
      </span>
    </div>
  );
}
