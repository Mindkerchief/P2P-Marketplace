import { cn } from "@/lib/utils";

const STRENGTH_CONFIG = [
  { label: 'Weak', bar: 'bg-red-500', text: 'text-red-500' },
  { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-500' },
  { label: 'Good', bar: 'bg-yellow-400', text: 'text-yellow-500' },
  { label: 'Strong', bar: 'bg-teal-500', text: 'text-teal-500' },
] as const;

function getStrengthScore(pw: string): number {
  return [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[!@#$%^&*()_+\-=[\]{}|;',.<>?]/.test(pw),
  ].filter(Boolean).length;
}

export function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;

  const score = getStrengthScore(password); // 0–4
  const cfg = STRENGTH_CONFIG[Math.max(0, score - 1)]; // clamp so index never goes below 0
  const filled = Math.max(1, score); // always show at least 1 segment

  return (
    <div className="space-y-2">
      {/* Segmented bar */}
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-all duration-300',
              i < filled ? cfg.bar : 'bg-stone-200 dark:bg-stone-700',
            )}
          />
        ))}
      </div>

      {/* Strength label */}
      <p className={cn('text-[11px] font-bold', cfg.text)}>
        {cfg.label} password
      </p>
    </div>
  );
}
