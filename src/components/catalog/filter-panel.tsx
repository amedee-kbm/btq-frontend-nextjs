"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/i18n/provider";
import { countActiveFilters } from "@/lib/catalog/filters";
import type { Category, Color, Tag } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { useListing } from "./listing-state";
import { Swatch } from "./swatch";
import { useShowPrices } from "./visibility";

export type FilterOptions = {
  categories: Category[];
  tags: Tag[];
  sizes: string[];
  colors: Color[];
};

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group border-b border-divider py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold tracking-wider uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden="true"
          className="text-lg leading-none font-normal text-ink-muted group-open:rotate-45 transition-transform"
        >
          +
        </span>
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

const chip =
  "inline-flex min-h-9 items-center gap-2 border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand";
const chipState = (active: boolean) =>
  active
    ? "border-ink bg-ink text-surface"
    : "border-divider bg-card hover:border-ink-muted";

function PriceRange() {
  const { filters, apply } = useListing();
  const { t } = useI18n();
  const field =
    "h-9 w-full min-w-0 border border-divider bg-card px-2 text-sm focus-visible:outline-2 focus-visible:outline-brand";

  return (
    <form
      // Remount when the URL changes so the inputs show the applied values.
      key={`${filters.min_price}-${filters.max_price}`}
      className="flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const read = (name: string) => {
          const n = Number.parseInt(String(data.get(name) ?? ""), 10);
          return Number.isFinite(n) && n >= 0 ? n : undefined;
        };
        apply({ min_price: read("min_price"), max_price: read("max_price") });
      }}
    >
      <label className="flex-1 text-xs text-ink-muted">
        {t.filters.min}
        <input
          name="min_price"
          type="number"
          inputMode="numeric"
          min={0}
          step={1000}
          defaultValue={filters.min_price}
          className={field}
        />
      </label>
      <label className="flex-1 text-xs text-ink-muted">
        {t.filters.max}
        <input
          name="max_price"
          type="number"
          inputMode="numeric"
          min={0}
          step={1000}
          defaultValue={filters.max_price}
          className={field}
        />
      </label>
      <Button type="submit" variant="outline" className="h-9">
        {t.filters.apply}
      </Button>
    </form>
  );
}

function FilterFields({ options }: { options: FilterOptions }) {
  const { filters, fixed, apply } = useListing();
  const showPrices = useShowPrices();
  const { t } = useI18n();

  return (
    <div>
      {!fixed.category && options.categories.length > 0 && (
        <Section title={t.filters.category}>
          <ul className="flex flex-col gap-1">
            {options.categories.map((parent) => (
              <li key={parent.slug}>
                <CategoryOption category={parent} />
                {parent.children.length > 0 && (
                  <ul className="ml-3 border-l border-divider pl-2">
                    {parent.children.map((child) => (
                      <li key={child.slug}>
                        <CategoryOption category={child} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {!fixed.tag?.length && options.tags.length > 0 && (
        <Section title={t.filters.occasion}>
          <div className="flex flex-wrap gap-2">
            {options.tags.map((tag) => {
              const active = filters.tag.includes(tag.slug);
              return (
                <button
                  key={tag.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => apply({ tag: toggle(filters.tag, tag.slug) })}
                  className={cn(chip, chipState(active))}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {options.sizes.length > 0 && (
        <Section title={t.common.size}>
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((size) => {
              const active = filters.size.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => apply({ size: toggle(filters.size, size) })}
                  className={cn(
                    chip,
                    "min-w-11 justify-center",
                    chipState(active),
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {options.colors.length > 0 && (
        <Section title={t.common.colour}>
          <div className="grid grid-cols-2 gap-1">
            {options.colors.map((color) => {
              const active = filters.color.includes(color.name);
              return (
                <button
                  key={color.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    apply({ color: toggle(filters.color, color.name) })
                  }
                  className={cn(
                    "flex min-h-9 items-center gap-2 px-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-brand",
                    active ? "bg-bone font-bold" : "hover:bg-bone/60",
                  )}
                >
                  <Swatch
                    hex={color.hex}
                    className={cn(
                      "size-5",
                      active && "ring-2 ring-ink ring-offset-1",
                    )}
                  />
                  <span className="truncate">{color.name}</span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {showPrices && (
        <Section title={t.filters.price}>
          <PriceRange />
        </Section>
      )}

      <div className="flex flex-col gap-3 py-4">
        {showPrices && (
          <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={filters.on_sale}
              onChange={(event) => apply({ on_sale: event.target.checked })}
            />
            {t.filters.onSale}
          </label>
        )}
        <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={filters.in_stock}
            onChange={(event) => apply({ in_stock: event.target.checked })}
          />
          {t.filters.inStock}
        </label>
      </div>
    </div>
  );
}

function CategoryOption({ category }: { category: Category }) {
  const { filters, apply } = useListing();
  const active = filters.category === category.slug;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => apply({ category: active ? undefined : category.slug })}
      className={cn(
        "flex min-h-9 w-full items-center justify-between px-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-brand",
        active ? "bg-bone font-bold" : "hover:bg-bone/60",
      )}
    >
      {category.name}
      <span className="text-xs text-ink-muted">{category.product_count}</span>
    </button>
  );
}

export function FilterSidebar({ options }: { options: FilterOptions }) {
  const { filters, fixed, clear } = useListing();
  const { t } = useI18n();
  const active = countActiveFilters(filters, fixed);
  return (
    <aside
      aria-label={t.filters.filters}
      className="hidden w-64 shrink-0 lg:block"
    >
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          {t.filters.filters}
        </h2>
        {active > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-ink-muted underline hover:text-ink"
          >
            {t.filters.clearAll}
          </button>
        )}
      </div>
      <FilterFields options={options} />
    </aside>
  );
}

export function FilterSheet({
  options,
  count,
}: {
  options: FilterOptions;
  count: number;
}) {
  const { filters, fixed, isPending, clear } = useListing();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const active = countActiveFilters(filters, fixed);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="h-9 gap-2 lg:hidden">
            <SlidersHorizontal size={16} />
            {t.filters.filter}
            {active > 0 && ` (${active})`}
          </Button>
        }
      />
      <SheetContent side="bottom" className="max-h-[88dvh] gap-0">
        <SheetHeader className="border-b border-divider">
          <SheetTitle className="text-base font-bold">
            {t.filters.filter}
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4">
          <FilterFields options={options} />
        </div>
        <SheetFooter className="flex-row border-t border-divider">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={clear}
            disabled={active === 0}
          >
            {t.filters.clear}
          </Button>
          <Button size="lg" className="flex-2" onClick={() => setOpen(false)}>
            {isPending ? t.filters.updating : t.filters.show(count)}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
