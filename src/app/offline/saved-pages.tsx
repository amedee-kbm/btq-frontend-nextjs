"use client";

import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

export function OfflineActions() {
  useEffect(() => {
    const reload = () => window.location.reload();
    window.addEventListener("online", reload);
    return () => window.removeEventListener("online", reload);
  }, []);

  return (
    <div className="flex gap-2">
      <Button size="lg" onClick={() => window.location.reload()}>
        Try again
      </Button>
      {/* A full load, so the service worker can serve the saved home page. */}
      <a
        href="/"
        className={buttonVariants({ size: "lg", variant: "outline" })}
      >
        Home
      </a>
    </div>
  );
}

type SavedPage = { href: string; label: string };

const SECTIONS: Record<string, string> = {
  products: "",
  categories: "Category",
  collections: "Collection",
  occasions: "Occasion",
};

function describe(url: URL): SavedPage | null {
  const [section, slug] = url.pathname.split("/").filter(Boolean);
  if (!slug || !(section in SECTIONS)) return null;
  const name = decodeURIComponent(slug).replace(/-/g, " ");
  const prefix = SECTIONS[section];
  return {
    href: url.pathname + url.search,
    label: `${prefix ? `${prefix}: ` : ""}${name.charAt(0).toUpperCase()}${name.slice(1)}`,
  };
}

/** Pages the service worker kept from earlier visits, newest first. */
export function SavedPages() {
  const [pages, setPages] = useState<SavedPage[]>([]);

  useEffect(() => {
    if (!("caches" in window)) return;
    (async () => {
      const names = (await caches.keys()).filter((n) => n.startsWith("pages-"));
      const seen = new Set<string>();
      const found: SavedPage[] = [];
      for (const name of names) {
        const keys = await (await caches.open(name)).keys();
        for (const request of [...keys].reverse()) {
          const page = describe(new URL(request.url));
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
        Saved on this device
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
