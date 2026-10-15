"use client";

import { WhatsappLogoIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Price } from "@/components/catalog/price";
import { SwatchRow } from "@/components/catalog/swatch";
import { useAskUsAbout } from "@/components/layout/ask-us";
import type { ProductDetail } from "@/lib/catalog/types";
import { productUrl, type WhatsAppSettings } from "@/lib/whatsapp";
import { FavoriteButton } from "./favorite-button";
import { Gallery, orderImages } from "./gallery";
import { OrderFlow, type Selection } from "./order-flow";
import { ShareButton } from "./share-button";
import { ColorPicker, SizePicker } from "./variant-picker";
import { WhatsAppButton } from "./whatsapp-button";

function only<T>(list: T[]) {
  return list.length === 1 ? list[0] : undefined;
}

/** Gallery + purchase column; owns the size/colour selection (mirrored in ?size=&color=). */
export function ProductView({
  product,
  settings,
  children,
}: {
  product: ProductDetail;
  settings: WhatsAppSettings;
  /** Server-rendered details shown under the purchase controls. */
  children?: React.ReactNode;
}) {
  const colorNames = product.colors.map((c) => c.name);
  const [selection, setSelection] = useState<Selection>({
    size: only(product.sizes),
    color: only(colorNames),
  });

  useAskUsAbout({ product, ...selection });

  // Preselect from the URL. Read on mount so the page itself stays static.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once per product
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const size = product.sizes.find(
      (s) => s.toLowerCase() === params.get("size")?.toLowerCase(),
    );
    const color = colorNames.find(
      (c) => c.toLowerCase() === params.get("color")?.toLowerCase(),
    );
    if (size || color) {
      setSelection((current) => ({
        size: size ?? current.size,
        color: color ?? current.color,
      }));
    }
  }, [product.slug]);

  const select = (next: Selection) => {
    setSelection(next);
    const params = new URLSearchParams(window.location.search);
    for (const key of ["size", "color"] as const) {
      const value = next[key];
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    // Native history keeps this a URL update, not a server navigation.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  };

  const available = useMemo(() => {
    const set = new Set(
      product.variants
        .filter((v) => v.is_available)
        .map((v) => `${v.size}|${v.color}`),
    );
    return (size: string, color: string) => set.has(`${size}|${color}`);
  }, [product.variants]);

  const sizeAvailable = (size: string) =>
    selection.color
      ? available(size, selection.color)
      : product.variants.some((v) => v.size === size && v.is_available);
  const colorAvailable = (color: string) =>
    selection.size
      ? available(selection.size, color)
      : product.colors.some((c) => c.name === color && c.is_available);

  const images = orderImages(product.images, selection.color);

  const colorPicker = useRef<HTMLDivElement>(null);
  const sizePicker = useRef<HTMLDivElement>(null);

  const [ordering, setOrdering] = useState(false);

  /** Desktop: scroll to the picker that still needs an answer. */
  const showPicker = (missing: "size" | "color") => {
    const button = (
      missing === "size" ? sizePicker : colorPicker
    ).current?.querySelector("button");
    button?.scrollIntoView({ behavior: "smooth", block: "center" });
    button?.focus({ preventScroll: true });
  };

  // Mobile orders go through the step-by-step flow instead of the pickers.
  const buttons = (close = (then: () => void) => then()) => (
    <div className="flex gap-2">
      <div className="hidden flex-1 md:block">
        <WhatsAppButton
          settings={settings}
          product={product}
          size={selection.size}
          color={selection.color}
          onPick={(missing) => close(() => showPicker(missing))}
        />
      </div>
      <div className="flex-1 md:hidden">
        {product.is_sold_out ? (
          <WhatsAppButton
            settings={settings}
            product={product}
            size={selection.size}
            color={selection.color}
          />
        ) : (
          <button
            type="button"
            onClick={() => close(() => setOrdering(true))}
            className="flex h-13 w-full items-center justify-center gap-2 bg-action px-4 text-base font-bold text-white transition-colors hover:bg-action-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <WhatsappLogoIcon size={22} weight="fill" aria-hidden="true" />
            Order on WhatsApp
          </button>
        )}
      </div>
      <FavoriteButton
        product={product}
        size={22}
        className="size-13 shrink-0 rounded-none border border-divider bg-card"
      />
      <ShareButton
        title={product.name}
        url={productUrl(product.slug)}
        className="size-13"
      />
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
      <div className="-mx-4 md:mx-0">
        <div className="md:sticky md:top-32">
          <Gallery
            images={images}
            name={product.name}
            actions={(close) => (
              <div className="flex flex-col gap-3">
                <Price product={product} />
                {buttons(close)}
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-wider text-ink-muted uppercase">
            {product.code}
          </p>
          <h1 className="font-heading text-3xl leading-tight md:text-4xl">
            {product.name}
          </h1>
          <Price product={product} className="text-xl" />
          {product.is_sold_out && (
            <p className="w-fit bg-ink px-2 py-1 text-xs font-bold tracking-wider text-white uppercase">
              Sold out
            </p>
          )}
        </div>

        {/* Mobile: what's on offer; choosing happens in the order flow. */}
        {(product.colors.length > 1 || product.sizes.length > 1) && (
          <div className="flex flex-col gap-2 text-sm md:hidden">
            {product.colors.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-ink-muted">
                  {product.colors.length} colours
                </span>
                <SwatchRow colors={product.colors} />
              </div>
            )}
            {product.sizes.length > 1 && (
              <p className="text-ink-muted">Sizes {product.sizes.join(", ")}</p>
            )}
          </div>
        )}

        <div ref={colorPicker} className="hidden md:block">
          <ColorPicker
            colors={product.colors}
            selected={selection.color}
            isAvailable={colorAvailable}
            onSelect={(color) => select({ ...selection, color })}
          />
        </div>
        <div ref={sizePicker} className="hidden md:block">
          <SizePicker
            sizes={product.sizes}
            selected={selection.size}
            isAvailable={sizeAvailable}
            onSelect={(size) => select({ ...selection, size })}
          />
        </div>

        <div className="flex flex-col gap-3">
          {buttons()}
          <p className="text-xs text-ink-muted">
            Pay with MoMo or cash on delivery · Motard delivery or pickup at
            CHIC Building B30A
          </p>
        </div>

        {children}
      </div>

      <OrderFlow
        open={ordering}
        onOpenChange={setOrdering}
        product={product}
        settings={settings}
        selection={selection}
        onSelect={select}
        isColorAvailable={colorAvailable}
        isSizeAvailable={sizeAvailable}
      />
    </div>
  );
}
