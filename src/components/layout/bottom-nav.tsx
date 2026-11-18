"use client";

import {
  HeartIcon,
  HouseIcon,
  type Icon,
  ListIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUser } from "@/hooks/use-user";
import { splitLocale } from "@/i18n/config";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { useAuthSheet } from "./auth-sheet";
import { CategoryBrowser } from "./category-browser";
import { MobileMenu } from "./mobile-menu";
import type { NavCategory, NavLink } from "./nav-types";
import { SearchBar } from "./search";

type Panel = "categories" | "search" | "menu";

const BROWSING = ["/shop", "/categories/", "/collections/", "/occasions"];

const tabClass =
  "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 pt-1.5 pb-1 text-xs font-medium text-ink-muted transition-colors aria-[current]:text-action aria-expanded:text-action";

function TabContent({
  icon: TabIcon,
  label,
  active,
}: {
  icon: Icon;
  label: string;
  active: boolean;
}) {
  return (
    <>
      {/* A bar over the current tab, so "where am I" doesn't rely on colour alone. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 h-0.5 w-8 rounded-full bg-action transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <TabIcon
        size={26}
        weight={active ? "fill" : "regular"}
        aria-hidden="true"
      />
      <span className={cn("max-w-full truncate px-0.5", active && "font-bold")}>
        {label}
      </span>
    </>
  );
}

function SearchPanel({
  categories,
  open,
  onOpenChange,
}: {
  categories: NavCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        initialFocus={inputRef}
        className="max-h-[85dvh] gap-0 pt-[env(safe-area-inset-top)]"
      >
        <SheetHeader className="min-h-16 justify-center pr-14">
          <SheetTitle className="text-xl">{t.tabs.search}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <SearchBar inputRef={inputRef} onSubmit={() => onOpenChange(false)} />
          {categories.length > 0 && (
            <>
              <p className="pt-6 pb-3 text-sm font-semibold text-ink-muted">
                {t.browse.orBrowse}
              </p>
              <ul className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      onClick={() => onOpenChange(false)}
                      className="inline-flex min-h-11 items-center rounded-pill border border-divider bg-card px-4 text-sm font-medium hover:border-ink-muted"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * A labelled tab bar along the bottom of phones and tablets: the main places
 * are always one thumb-tap away, and the current one is highlighted.
 */
export function BottomNav({
  categories,
  collections,
}: {
  categories: NavCategory[];
  collections: NavLink[];
}) {
  const { t, href } = useI18n();
  const path = splitLocale(usePathname()).path;
  const { isAuthenticated } = useUser();
  const { openAuthSheet } = useAuthSheet();
  const [panel, setPanel] = useState<Panel | null>(null);

  // Close whatever is open once the shopper lands somewhere.
  // biome-ignore lint/correctness/useExhaustiveDependencies: close on route change
  useEffect(() => setPanel(null), [path]);

  const toggle = (next: Panel) => (open: boolean) =>
    setPanel(open ? next : null);

  const onHome = path === "/";
  const onFavorites = path === "/favorites";
  const browsing =
    panel === null && BROWSING.some((prefix) => path.startsWith(prefix));

  return (
    <>
      <nav
        aria-label={t.tabs.label}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-divider bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-surface/85 lg:hidden"
      >
        <div className="mx-auto flex h-16 max-w-xl items-stretch">
          <Link
            href="/"
            aria-current={onHome && !panel ? "page" : undefined}
            className={tabClass}
          >
            <TabContent
              icon={HouseIcon}
              label={t.tabs.home}
              active={onHome && !panel}
            />
          </Link>
          <button
            type="button"
            aria-expanded={panel === "categories"}
            aria-current={browsing ? "page" : undefined}
            onClick={() => setPanel("categories")}
            className={tabClass}
          >
            <TabContent
              icon={SquaresFourIcon}
              label={t.tabs.categories}
              active={browsing || panel === "categories"}
            />
          </button>
          <button
            type="button"
            aria-expanded={panel === "search"}
            onClick={() => setPanel("search")}
            className={tabClass}
          >
            <TabContent
              icon={MagnifyingGlassIcon}
              label={t.tabs.search}
              active={panel === "search"}
            />
          </button>
          {isAuthenticated ? (
            <Link
              href="/favorites"
              aria-current={onFavorites && !panel ? "page" : undefined}
              className={tabClass}
            >
              <TabContent
                icon={HeartIcon}
                label={t.tabs.favorites}
                active={onFavorites && !panel}
              />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthSheet(undefined, href("/favorites"))}
              className={tabClass}
            >
              <TabContent
                icon={HeartIcon}
                label={t.tabs.favorites}
                active={false}
              />
            </button>
          )}
          <button
            type="button"
            aria-expanded={panel === "menu"}
            onClick={() => setPanel("menu")}
            className={tabClass}
          >
            <TabContent
              icon={ListIcon}
              label={t.tabs.menu}
              active={panel === "menu"}
            />
          </button>
        </div>
      </nav>

      <CategoryBrowser
        categories={categories}
        open={panel === "categories"}
        onOpenChange={toggle("categories")}
      />
      <SearchPanel
        categories={categories}
        open={panel === "search"}
        onOpenChange={toggle("search")}
      />
      <MobileMenu
        collections={collections}
        open={panel === "menu"}
        onOpenChange={toggle("menu")}
        onBrowseCategories={() => setPanel("categories")}
      />
    </>
  );
}
