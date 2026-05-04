import { Expand, IdCard } from "lucide-react";

import ImageSafe from "@/components/image/ImageSafe";
import { validateImageURL } from "@/utils/validation";


export function IdImageCard({
  label,
  imageUrl,
  onOpenFullscreen,
}: {
  label: string;
  imageUrl?: string | null;
  onOpenFullscreen?: () => void;
}) {
  const resolvedUrl = imageUrl ? validateImageURL(imageUrl) : '';

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
        {label}
      </p>
      {resolvedUrl ? (
        <div className="relative w-full rounded-lg overflow-hidden border border-stone-200 dark:border-[#2a2d3e] bg-stone-100 dark:bg-[#13151f] hover:opacity-95 transition-opacity">
          <ImageSafe
            src={resolvedUrl}
            type="id"
            alt={`Image of ${label}`}
            width={120}
            height={120}
            className="w-full h-auto"
          />
          {onOpenFullscreen && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onOpenFullscreen();
              }}
              className="absolute bottom-2 right-2 w-8 h-8 rounded-md bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label={`Open ${label} fullscreen`}
            >
              <Expand className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="aspect-4/3 rounded-lg bg-stone-100 dark:bg-[#13151f] border-2 border-dashed border-stone-200 dark:border-[#2a2d3e] flex flex-col items-center justify-center gap-2">
          <IdCard className="w-9 h-9 text-stone-300 dark:text-stone-600" />
          <span className="text-xs font-medium text-stone-400 dark:text-stone-500">
            No image
          </span>
        </div>
      )}
    </div>
  );
}
