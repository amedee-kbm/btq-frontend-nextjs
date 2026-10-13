import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/product/favorite-button";
import type { ProductListItem } from "@/lib/catalog/types";
import { Price } from "./price";
import { SwatchRow } from "./swatch";

// No "use client": renders on the server in listings and on the client after "Load more".

export const GRID_IMAGE_SIZES =
  "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductListItem;
  priority?: boolean;
}) {
  const [first, second] = product.images;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-2/3 w-full overflow-hidden bg-bone">
        {first ? (
          <>
            <Image
              src={first.url}
              alt={first.alt || product.name}
              fill
              priority={priority}
              sizes={GRID_IMAGE_SIZES}
              className="object-cover transition-opacity duration-300"
            />
            {second && (
              <Image
                src={second.url}
                alt=""
                fill
                sizes={GRID_IMAGE_SIZES}
                className="hidden object-cover opacity-0 transition-opacity duration-300 md:block md:group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="grid h-full place-items-center font-logo text-2xl italic text-ink-disabled">
            Btq.
          </div>
        )}
        {product.is_sold_out ? (
          <span className="absolute top-2 left-2 bg-ink px-2 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            Sold out
          </span>
        ) : product.is_on_sale ? (
          <span className="absolute top-2 left-2 bg-danger px-2 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            Sale
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-2 pt-3 pb-6">
        <h3 className="line-clamp-2 text-sm leading-snug tracking-wide">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <Price product={product} className="text-sm" />
        <SwatchRow colors={product.colors} />
      </div>

      <FavoriteButton
        product={product}
        className="absolute top-2 right-2 z-10 size-9 bg-surface/80 backdrop-blur"
      />
    </article>
  );
}
