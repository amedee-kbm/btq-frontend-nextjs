"use client";

import { Swatch } from "@/components/catalog/swatch";
import type { ProductColor } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

// Unavailable or non-existent combinations are crossed out but stay selectable,
// so the shopper can still ask whether they're coming back.

const crossed =
  "after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),currentColor_calc(50%-0.5px),currentColor_calc(50%+0.5px),transparent_calc(50%+0.5px))] after:opacity-40";

export function SizePicker({
  sizes,
  selected,
  isAvailable,
  onSelect,
}: {
  sizes: string[];
  selected?: string;
  isAvailable: (size: string) => boolean;
  onSelect: (size: string) => void;
}) {
  if (sizes.length === 0) return null;
  return (
    <fieldset>
      <legend className="pb-2 text-sm">
        <span className="font-bold">Size</span>
        {selected && <span className="text-ink-muted">: {selected}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const active = size === selected;
          const available = isAvailable(size);
          return (
            <button
              key={size}
              type="button"
              aria-pressed={active}
              aria-label={available ? size : `${size} (unavailable)`}
              onClick={() => onSelect(size)}
              className={cn(
                "relative inline-flex h-11 min-w-12 items-center justify-center overflow-hidden border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
                active
                  ? "border-ink bg-ink text-surface"
                  : "border-divider bg-card hover:border-ink-muted",
                !available && crossed,
                !available && !active && "text-ink-muted",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ColorPicker({
  colors,
  selected,
  isAvailable,
  onSelect,
}: {
  colors: ProductColor[];
  selected?: string;
  isAvailable: (color: string) => boolean;
  onSelect: (color: string) => void;
}) {
  if (colors.length === 0) return null;
  return (
    <fieldset>
      <legend className="pb-2 text-sm">
        <span className="font-bold">Colour</span>
        {selected && <span className="text-ink-muted">: {selected}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const active = color.name === selected;
          const available = isAvailable(color.name);
          return (
            <button
              key={color.name}
              type="button"
              aria-pressed={active}
              aria-label={
                available ? color.name : `${color.name} (unavailable)`
              }
              onClick={() => onSelect(color.name)}
              className={cn(
                "relative inline-flex h-11 items-center gap-2 overflow-hidden border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
                active
                  ? "border-ink ring-1 ring-ink"
                  : "border-divider bg-card hover:border-ink-muted",
                !available && crossed,
                !available && "text-ink-muted",
              )}
            >
              <Swatch hex={color.hex} className="size-5" />
              {color.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
