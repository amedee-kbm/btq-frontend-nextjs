"use client";

import { ArrowsOutIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { type CloseViewer, PhotoViewer } from "./photo-viewer";

const SIZES = "(min-width: 768px) 50vw, 100vw";

/** The selected colour's photos first, then shared ones, then other colours. */
export function orderImages(images: ProductImage[], color?: string) {
  if (!color) return images;
  return [
    ...images.filter((i) => i.color === color),
    ...images.filter((i) => i.color === null),
    ...images.filter((i) => i.color !== null && i.color !== color),
  ];
}

export function Gallery({
  images,
  name,
  actions,
}: {
  images: ProductImage[];
  name: string;
  /** Purchase actions shown under the full-screen photos. */
  actions?: (close: CloseViewer) => React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  // Kept separately from `viewing` so the photo doesn't jump while closing.
  const [viewing, setViewing] = useState(false);
  const [viewFrom, setViewFrom] = useState(0);
  const view = (i: number) => {
    setViewFrom(i);
    setViewing(true);
  };
  const track = useRef<HTMLElement>(null);
  const first = images[0]?.url;

  // When the order changes (a colour was picked), go back to the first photo.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when the first photo changes
  useEffect(() => {
    setIndex(0);
    track.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [first]);

  if (images.length === 0) {
    return (
      <div className="grid aspect-2/3 w-full place-items-center bg-bone font-logo text-4xl italic text-ink-disabled">
        Btq.
      </div>
    );
  }

  const alt = (image: ProductImage, i: number) =>
    image.alt || `${name}, photo ${i + 1}`;

  return (
    <div>
      {/* Mobile: swipeable carousel */}
      <div className="relative md:hidden">
        <section
          ref={track}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            const el = event.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          aria-roledescription="carousel"
          aria-label={`${name} photos`}
        >
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => view(i)}
              aria-label={`View photo ${i + 1} full screen`}
              className="relative aspect-2/3 w-full shrink-0 snap-start bg-bone"
            >
              <Image
                src={image.url}
                alt={alt(image, i)}
                fill
                priority={i === 0}
                sizes={SIZES}
                className="object-cover"
              />
            </button>
          ))}
        </section>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/35 text-white"
        >
          <ArrowsOutIcon size={18} />
        </span>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.url}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={() =>
                  track.current?.scrollTo({
                    left: i * track.current.clientWidth,
                    behavior: "smooth",
                  })
                }
                className={cn(
                  "size-2 rounded-full border border-white/70 transition-colors",
                  i === index ? "bg-white" : "bg-white/30",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: thumbnails + main photo */}
      <div className="hidden gap-3 md:flex">
        {images.length > 1 && (
          <ul className="flex w-20 shrink-0 flex-col gap-2">
            {images.map((image, i) => (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "relative block aspect-2/3 w-full overflow-hidden bg-bone outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand",
                    i === index
                      ? "ring-2 ring-ink"
                      : "opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => view(index)}
          aria-label="View photos full screen"
          className="group relative aspect-2/3 flex-1 cursor-zoom-in bg-bone outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Image
            key={images[index]?.url}
            src={images[index]?.url ?? images[0].url}
            alt={alt(images[index] ?? images[0], index)}
            fill
            priority
            sizes={SIZES}
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/35 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ArrowsOutIcon size={18} />
          </span>
        </button>
      </div>

      <PhotoViewer
        images={images}
        name={name}
        alt={alt}
        open={viewing}
        startAt={viewFrom}
        onClose={(i) => {
          // Leave the page gallery on the photo they ended on.
          setViewing(false);
          setIndex(i);
          track.current?.scrollTo({ left: i * track.current.clientWidth });
        }}
        actions={actions}
      />
    </div>
  );
}
