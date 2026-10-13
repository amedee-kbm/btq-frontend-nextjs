"use client";

import { Button } from "@/components/ui/button";
import { useListing } from "./listing-state";

export function EmptyState() {
  const { clear } = useListing();
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-2xl">Nothing matches these filters</p>
      <p className="text-sm text-ink-muted">
        Try removing a filter or two to see more styles.
      </p>
      <Button variant="outline" size="lg" onClick={clear}>
        Clear filters
      </Button>
    </div>
  );
}
