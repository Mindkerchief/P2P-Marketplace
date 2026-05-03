import { Camera, CheckCircle2 } from 'lucide-react';
import { CameraInputProps } from '../_types/become-seller';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function CameraInput({
  label,
  capture,
  file,
  inputRef,
  onChange,
}: CameraInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          file
            ? 'border-teal-400 bg-teal-50 dark:bg-teal-950/20'
            : 'border-stone-200 dark:border-[#2a2d3e] hover:border-stone-400 dark:hover:border-stone-500 bg-stone-50 dark:bg-[#13151f]',
        )}
      >
        {file ? (
          <>
            <CheckCircle2 className="w-7 h-7 text-teal-500 dark:text-teal-400" />
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 text-center truncate max-w-full px-2">
              {file.name}
            </p>
            <p className="text-[10px] text-stone-400 dark:text-stone-500">
              Tap to retake
            </p>
          </>
        ) : (
          <>
            <Camera className="w-6 h-6 text-stone-400 dark:text-stone-500" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
              Tap to open camera
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Camera opens automatically
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
