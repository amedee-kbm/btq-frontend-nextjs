import { cn } from "@/lib/utils";

export const BRAND_NAME = "Bukiaa";

const GOLD = "#C9902E";

/**
 * The shopping bag + gold "B" from public/brand/logo-mark.svg, drawn inline so the bag
 * follows the text colour (dark mode) while the B stays gold.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="20 8 212 214"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M53 62 H206 L224 204 Q225 214 214 214 H35 Q25 214 27 203 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d="M88 62 V42 C88 12 169 12 169 42 V62"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M78 86 Q78 80 84 80 H142 C166 80 176 94 176 108 C176 120 169 128 160 132 C176 136 186 148 186 162 C186 180 172 192 148 192 H84 Q78 192 78 186 Z M104 102 V124 H138 C146 124 150 120 150 113 C150 106 146 102 138 102 Z M104 144 V170 H144 C153 170 158 165 158 157 C158 149 153 144 144 144 Z"
        fill={GOLD}
        fillRule="evenodd"
      />
    </svg>
  );
}

/**
 * Mark + wordmark. The wordmark is live text rather than the SVG's so it stays
 * crisp and follows the text colour at header size.
 */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={size === "sm" ? "size-9" : "size-9 md:size-10"} />
      <span
        aria-hidden="true"
        className={cn(
          "flex flex-col border-l border-current pl-2 font-bold leading-none",
          size === "sm" ? "text-base" : "text-lg md:text-xl",
        )}
      >
        <span className="tracking-[0.12em]">BUKIAA</span>
        {/* The gold swoosh from public/brand/logo.svg. */}
        <svg
          viewBox="0 0 404 22"
          aria-hidden="true"
          preserveAspectRatio="none"
          className="mt-0.5 h-1.5 w-full"
        >
          <path
            d="M2 19 C128 0 257 1 402 18"
            fill="none"
            stroke={GOLD}
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
      <span className="sr-only">{BRAND_NAME}</span>
    </span>
  );
}
