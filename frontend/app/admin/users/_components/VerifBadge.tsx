import { cn } from "@/lib/utils";
import { VerifStatus } from "../_types/admin-users";

export function VerifBadge({ status }: { status: VerifStatus }) {
  const map = {
    VERIFIED:
      'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
    PENDING:
      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    UNVERIFIED:
      'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400',
    REJECTED: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  };
  const label = {
    VERIFIED: 'Verified',
    PENDING: 'Pending',
    UNVERIFIED: 'Unverified',
    REJECTED: 'Rejected',
  };
  return (
    <span
      className={cn('text-xs font-bold px-2 py-0.5 rounded-md', map[status])}
    >
      {label[status]}
    </span>
  );
}
