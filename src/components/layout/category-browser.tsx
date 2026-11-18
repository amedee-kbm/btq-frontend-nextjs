"use client";

import {
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { splitLocale } from "@/i18n/config";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { CategoryTileContent } from "./category-tile";
import type { NavCategory } from "./nav-types";

const TILE_SIZES = "(min-width: 640px) 25vw, 50vw";

/** The top-level category the shopper is currently in, if any. */
function currentParent(categories: NavCategory[], path: string) {
  return categories.find(
    (c) => c.href === path || c.children.some((child) => child.href === path),
  );
}

/**
 * Categories as photos, one level at a time: tapping a category with types
 * underneath opens those types, with a clear way back.
 */
export function CategoryBrowser({
  categories,
  open,
  onOpenChange,
}: {
  categories: NavCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const path = splitLocale(usePathname()).path;
  const [parent, setParent] = useState<NavCategory | undefined>();

  // Open where the shopper already is: inside a category, show its types.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only on opening
  useEffect(() => {
    if (open) setParent(currentParent(categories, path));
  }, [open]);

  // Closes even when the link is to the page already shown.
  const close = () => onOpenChange(false);

  const tiles: NavCategory[] = parent
    ? parent.children.map((child) => ({ ...child, children: [] }))
    : categories;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[92dvh] gap-0 pb-[env(safe-area-inset-bottom)]"
      >
        <SheetHeader className="min-h-16 flex-row items-center border-b border-divider pr-14">
          {parent ? (
            <button
              type="button"
              onClick={() => setParent(undefined)}
              className="-ml-2 flex min-h-11 items-center gap-1 pr-3 pl-1 text-base font-semibold text-action"
            >
              <CaretLeftIcon size={22} weight="bold" aria-hidden="true" />
              {t.browse.backTo}
            </button>
          ) : (
            <SheetTitle className="text-xl">{t.browse.title}</SheetTitle>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {parent && (
            <>
              <SheetTitle className="pb-3 text-2xl">{parent.label}</SheetTitle>
              <Link
                href={parent.href}
                onClick={close}
                className="mb-5 flex min-h-13 items-center justify-between gap-3 bg-action px-4 text-base font-bold text-white hover:bg-action-dark"
              >
                {t.browse.seeAll(parent.label)}
                <ArrowRightIcon size={20} weight="bold" aria-hidden="true" />
              </Link>
            </>
          )}

          <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
            {tiles.map((c) => {
              const active = c.href === path;
              const content = (
                <CategoryTileContent
                  label={c.label}
                  image={c.image}
                  detail={t.common.items(c.count)}
                  sizes={TILE_SIZES}
                />
              );
              return (
                <li key={c.href}>
                  {c.children.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setParent(c)}
                      aria-label={t.browse.moreIn(c.label)}
                      className="group relative block w-full"
                    >
                      {content}
                      <span
                        aria-hidden="true"
                        className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-surface/90 text-ink shadow-sm"
                      >
                        <CaretRightIcon size={18} weight="bold" />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={c.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="group block aria-[current=page]:outline-2 aria-[current=page]:outline-offset-4 aria-[current=page]:outline-action"
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {!parent && (
            <Link
              href="/shop"
              onClick={close}
              className="mt-6 flex min-h-13 items-center justify-between gap-3 border border-ink px-4 text-base font-bold text-ink hover:bg-bone"
            >
              {t.common.shopAll}
              <ArrowRightIcon size={20} weight="bold" aria-hidden="true" />
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
