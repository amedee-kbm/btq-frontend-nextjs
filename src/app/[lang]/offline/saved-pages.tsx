"use client";

import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { splitLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { useI18n } from "@/i18n/provider";

export function OfflineActions() {
  const { t, href } = useI18n();
  useEffect(() => {
    const reload = () => window.location.reload();
    window.addEventListener("online", reload);
    return () => window.removeEventListener("online", reload);
  }, []);

  return (
    <div className="flex gap-2">
      <Button size="lg" onClick={() => window.location.reload()}>
        {t.common.tryAgain}
      </Button>
      {/* A full load, so the service worker can serve the saved home page. */}
      <a
        href={href("/")}
        className={buttonVariants({ size: "lg", variant: "outline" })}
      >
        {t.common.home}
      </a>
    </div>
  );
}

type SavedPage = { href: string; label: string };

const sectionLabels = (t: Dictionary): Record<string, string> => ({
  products: "",
  categories: t.offline.category,
  collections: t.offline.collection,
  occasions: t.offline.occasion,
});

/** Saved pages in either language; each keeps the language it was saved in. */
function describe(url: URL, t: Dictionary): SavedPage | null {
  const [section, slug] = splitLocale(url.pathname)
    .path.split("/")
    .filter(Boolean);
  const sections = sectionLabels(t);
  if (!slug || !(section in sections)) return null;
  const name = decodeURIComponent(slug).replace(/-/g, " ");
  const prefix = sections[section];
  return {
    href: url.pathname + url.search,
    label: `${prefix ? `${prefix}: ` : ""}${name.charAt(0).toUpperCase()}${name.slice(1)}`,
  };
}

/** Pages the service worker kept from earlier visits, newest first. */
export function SavedPages() {
  const [pages, setPages] = useState<SavedPage[]>([]);
  const { t } = useI18n();

  // biome-ignore lint/correctness/useExhaustiveDependencies: read the cache once; the language is fixed per page load
  useEffect(() => {
    if (!("caches" in window)) return;
    (async () => {
      const names = (await caches.keys()).filter((n) => n.startsWith("pages-"));
      const seen = new Set<string>();
      const found: SavedPage[] = [];
      for (const name of names) {
        const keys = await (await caches.open(name)).keys();
        for (const request of [...keys].reverse()) {
          const page = describe(new URL(request.url), t);
          if (page && !seen.has(page.href)) {
            seen.add(page.href);
            found.push(page);
          }
        }
      }
      setPages(found.slice(0, 12));
    })().catch(() => {});
  }, []);

  if (pages.length === 0) return null;

  return (
    <section className="mt-6 w-full text-left">
      <h2 className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
        {t.offline.saved}
      </h2>
      <ul className="mt-2 divide-y divide-divider border-y border-divider">
        {pages.map((page) => (
          <li key={page.href}>
            <a
              href={page.href}
              className="flex min-h-11 items-center text-sm font-medium text-ink-soft hover:text-ink"
            >
              {page.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
