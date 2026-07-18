import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function InlineFeedback({
  msg,
  type,
}: {
  msg: string;
  type: 'success' | 'error';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium',
        type === 'success'
          ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
          : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 shrink-0" />
      )}
      {msg}
    </div>
  );
}
