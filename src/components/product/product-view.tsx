"use client";

import { useEffect, useMemo, useState } from "react";
import { Price } from "@/components/catalog/price";
import type { ProductDetail } from "@/lib/catalog/types";
import { productUrl, type WhatsAppSettings } from "@/lib/whatsapp";
import { FavoriteButton } from "./favorite-button";
import { Gallery, orderImages } from "./gallery";
import { ShareButton } from "./share-button";
import { ColorPicker, SizePicker } from "./variant-picker";
import { WhatsAppButton } from "./whatsapp-button";

type Selection = { size?: string; color?: string };

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

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
      <div className="-mx-4 md:mx-0">
        <div className="md:sticky md:top-32">
          <Gallery images={images} name={product.name} />
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

        <ColorPicker
          colors={product.colors}
          selected={selection.color}
          isAvailable={colorAvailable}
          onSelect={(color) => select({ ...selection, color })}
        />
        <SizePicker
          sizes={product.sizes}
          selected={selection.size}
          isAvailable={sizeAvailable}
          onSelect={(size) => select({ ...selection, size })}
        />

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <WhatsAppButton
                settings={settings}
                product={product}
                size={selection.size}
                color={selection.color}
              />
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
          <p className="text-xs text-ink-muted">
            Pay with MoMo or cash on delivery · Motard delivery or pickup at
            CHIC Building B30A
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
