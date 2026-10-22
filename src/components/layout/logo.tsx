import { cn } from "@/lib/utils";

export const BRAND_NAME = "Kigali Fashion Store";

const GOLD = "#C9902E";

/**
 * The shopping bag + gold "K" from public/brand/logo-mark.svg, drawn inline so the bag
 * follows the text colour (dark mode) while the K stays gold.
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
        d="M70 166 L122 81 Q126 75 132 80 Q137 84 133 91 L113 124 L177 80 Q184 75 189 81 Q193 87 185 93 L137 126 L194 177 Q201 184 194 190 Q188 195 181 189 L124 142 L94 191 Q90 198 83 194 Q77 190 81 183 L98 153 L70 177 Z"
        fill={GOLD}
        transform="translate(-2 -3)"
      />
    </svg>
  );
}

/**
 * Mark + wordmark. The wordmark is live text rather than the SVG's, because the
 * "FASHION STORE" line becomes unreadable at header size.
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
          "flex flex-col border-l border-current pl-2 font-bold leading-[1.15]",
          size === "sm" ? "text-[8px]" : "text-[12px] md:text-xs",
        )}
      >
        <span className="tracking-[0.1em]">KIGALI</span>
        <span className="tracking-[0.03em]">FASHION STORE</span>
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
