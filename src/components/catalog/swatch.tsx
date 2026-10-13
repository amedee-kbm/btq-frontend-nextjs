import { cn } from "@/lib/utils";

/** A round color dot. Colors without a hex (e.g. "Multicolor") get a gradient. */
export function Swatch({
  hex,
  className,
}: {
  hex: string | null;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-3 shrink-0 rounded-full border border-black/15",
        className,
      )}
      style={{
        background:
          hex ??
          "conic-gradient(#c8102e, #f4e68c, #1f6b45, #2643a6, #7a3e8e, #c8102e)",
      }}
    />
  );
}

export function SwatchRow({
  colors,
  max = 5,
}: {
  colors: { name: string; hex: string | null; is_available: boolean }[];
  max?: number;
}) {
  if (colors.length === 0) return null;
  const shown = colors.slice(0, max);
  return (
    <ul
      className="flex items-center gap-1.5"
      aria-label={`Colours: ${colors.map((c) => c.name).join(", ")}`}
    >
      {shown.map((color) => (
        <li
          key={color.name}
          className={cn(!color.is_available && "opacity-35")}
        >
          <Swatch hex={color.hex} />
        </li>
      ))}
      {colors.length > max && (
        <li className="text-xs text-ink-muted" aria-hidden="true">
          +{colors.length - max}
        </li>
      )}
    </ul>
  );
}
