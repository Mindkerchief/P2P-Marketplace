import { cn } from "@/lib/utils";

export function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold',
        active
          ? 'text-teal-600 dark:text-teal-400'
          : 'text-stone-400 dark:text-stone-500',
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          active ? 'bg-teal-500' : 'bg-stone-400',
        )}
      />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
