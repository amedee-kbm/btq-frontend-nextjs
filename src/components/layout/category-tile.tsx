import Image from "next/image";
import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

// No "use client": the home page renders these on the server, the category
// browser on the client.

/**
 * A category shown as a photo with its name underneath, so it can be
 * recognised at a glance rather than read.
 */
export function CategoryTileContent({
  label,
  image,
  detail,
  sizes,
  className,
}: {
  label: string;
  image: string | null;
  /** A short line under the name, e.g. "12 items" or "4 types". */
  detail?: string;
  sizes: string;
  className?: string;
}) {
  return (
    <span className={cn("flex flex-col gap-2 text-left", className)}>
      <span className="relative block aspect-square w-full overflow-hidden bg-bone">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="grid h-full place-items-center text-ink-disabled opacity-60">
            <LogoMark className="size-1/3" />
          </span>
        )}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="line-clamp-2 text-sm leading-snug font-semibold text-ink">
          {label}
        </span>
        {detail && <span className="text-xs text-ink-muted">{detail}</span>}
      </span>
    </span>
  );
}
