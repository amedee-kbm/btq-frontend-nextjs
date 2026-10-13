"use client";

import { ShareNetworkIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareButton({
  title,
  url,
  className,
}: {
  title: string;
  url: string;
  className?: string;
}) {
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this item"
      className={cn(
        "grid size-11 place-items-center border border-divider bg-card transition-colors hover:border-ink-muted focus-visible:outline-2 focus-visible:outline-brand",
        className,
      )}
    >
      <ShareNetworkIcon size={20} />
    </button>
  );
}
