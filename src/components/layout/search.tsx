"use client";

import { Search as SearchIcon } from "lucide-react";
import Form from "next/form";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { splitLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/** Submits to /shop?q=… (works before hydration too: it's a plain GET form). */
export function SearchBar({ className }: { className?: string }) {
  // Suspense keeps useSearchParams from turning static pages client-rendered.
  return (
    <Suspense fallback={<SearchForm className={className} current="" />}>
      <CurrentSearch className={className} />
    </Suspense>
  );
}

function CurrentSearch({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current =
    splitLocale(pathname).path === "/shop" ? (searchParams.get("q") ?? "") : "";
  return <SearchForm className={className} current={current} />;
}

function SearchForm({
  className,
  current,
}: {
  className?: string;
  current: string;
}) {
  const { t, href } = useI18n();
  return (
    <search className={cn("w-full", className)}>
      <Form
        action={href("/shop")}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-pill border border-divider bg-card px-4 text-sm transition-colors focus-within:border-ink-muted hover:border-ink-disabled",
        )}
      >
        <SearchIcon
          size={18}
          className="shrink-0 text-ink-muted"
          aria-hidden="true"
        />
        <input
          key={current}
          type="search"
          name="q"
          defaultValue={current}
          placeholder={t.search.placeholder}
          aria-label={t.search.label}
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-muted"
        />
      </Form>
    </search>
  );
}
