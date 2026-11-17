"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-heading text-2xl">{t.error.title}</p>
      <p className="max-w-sm text-sm text-ink-muted">{t.error.text}</p>
      <Button size="lg" onClick={reset}>
        {t.common.tryAgain}
      </Button>
    </div>
  );
}
