"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

// A client component: not-found.tsx gets no route params to read the language from.
export default function ProductNotFound() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-heading text-2xl">{t.notFound.title}</p>
      <p className="max-w-sm text-sm text-ink-muted">{t.notFound.text}</p>
      <Link href="/shop" className={buttonVariants({ size: "lg" })}>
        {t.common.shopAll}
      </Link>
    </div>
  );
}
