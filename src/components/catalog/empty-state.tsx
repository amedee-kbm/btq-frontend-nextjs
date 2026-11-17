"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import { useListing } from "./listing-state";

export function EmptyState() {
  const { clear } = useListing();
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-2xl">{t.listing.emptyTitle}</p>
      <p className="text-sm text-ink-muted">{t.listing.emptyText}</p>
      <Button variant="outline" size="lg" onClick={clear}>
        {t.listing.clearFilters}
      </Button>
    </div>
  );
}
