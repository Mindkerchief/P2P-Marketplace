import { cn } from "@/lib/utils";

export function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0 mt-2" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            'text-sm wrap-break-word',
            mono
              ? 'font-mono text-stone-700 dark:text-stone-200'
              : 'text-stone-700 dark:text-stone-200',
            !value && 'text-stone-400 dark:text-stone-600 italic font-normal',
          )}
        >
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
