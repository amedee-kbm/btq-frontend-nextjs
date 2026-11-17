"use client";

import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { SORT_OPTIONS } from "@/lib/catalog/filters";
import type { ProductSort } from "@/lib/catalog/types";
import { useListing } from "./listing-state";
import { useShowPrices } from "./visibility";

export function SortSelect() {
  const { filters, apply } = useListing();
  const { t } = useI18n();
  // With prices hidden only "Newest" is left, so there's nothing to choose.
  if (!useShowPrices()) return null;
  return (
    <label className="relative flex items-center gap-2 text-sm">
      <span className="sr-only md:not-sr-only md:text-ink-muted">
        {t.sort.label}
      </span>
      <select
        value={filters.sort}
        onChange={(event) => apply({ sort: event.target.value as ProductSort })}
        className="h-9 appearance-none border border-divider bg-card pr-8 pl-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t.sort[option]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-2 text-ink-muted"
        aria-hidden="true"
      />
    </label>
  );
}
