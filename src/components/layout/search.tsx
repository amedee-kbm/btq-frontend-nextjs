"use client";

import { Search as SearchIcon } from "lucide-react";
import Form from "next/form";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { splitLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/** Submits to /shop?q=… (works before hydration too: it's a plain GET form). */
type SearchBarProps = {
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onSubmit?: () => void;
};

export function SearchBar(props: SearchBarProps) {
  // Suspense keeps useSearchParams from turning static pages client-rendered.
  return (
    <Suspense fallback={<SearchForm {...props} current="" />}>
      <CurrentSearch {...props} />
    </Suspense>
  );
}

function CurrentSearch(props: SearchBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current =
    splitLocale(pathname).path === "/shop" ? (searchParams.get("q") ?? "") : "";
  return <SearchForm {...props} current={current} />;
}

function SearchForm({
  className,
  current,
  inputRef,
  onSubmit,
}: SearchBarProps & { current: string }) {
  const { t, href } = useI18n();
  return (
    <search className={cn("w-full", className)}>
      <Form
        action={href("/shop")}
        onSubmit={onSubmit}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-pill border border-divider bg-card px-4 text-sm transition-colors focus-within:border-ink-muted hover:border-ink-disabled",
        )}
      >
        <SearchIcon
          size={20}
          className="shrink-0 text-ink-muted"
          aria-hidden="true"
        />
        <input
          key={current}
          ref={inputRef}
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
