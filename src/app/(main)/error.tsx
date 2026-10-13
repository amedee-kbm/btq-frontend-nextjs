"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-heading text-2xl">We couldn't load this page</p>
      <p className="max-w-sm text-sm text-ink-muted">
        Our shop is waking up — this can take a few seconds. Please try again.
      </p>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
