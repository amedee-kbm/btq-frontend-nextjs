"use client";

import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ProductImage } from "@/lib/catalog/types";

/** Closes the viewer; `then` runs once it's gone (and takes over focus). */
export type CloseViewer = (then?: () => void) => void;

/**
 * Full-screen, swipeable photos with the purchase actions pinned underneath,
 * so tapping a photo leads somewhere instead of nowhere.
 */
export function PhotoViewer({
  images,
  name,
  alt,
  open,
  startAt,
  onClose,
  actions,
}: {
  images: ProductImage[];
  name: string;
  alt: (image: ProductImage, i: number) => string;
  open: boolean;
  startAt: number;
  /** Called with the photo the shopper ended on. */
  onClose: (index: number) => void;
  actions?: (close: CloseViewer) => React.ReactNode;
}) {
  const [index, setIndex] = useState(startAt);
  const pending = useRef<(() => void) | null>(null);
  // Open on the photo that was tapped.
  const track = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      el.scrollLeft = startAt * el.clientWidth;
      setIndex(startAt);
    },
    [startAt],
  );

  const close: CloseViewer = (then) => {
    pending.current = then ?? null;
    onClose(index);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
      onOpenChangeComplete={(next) => {
        if (next || !pending.current) return;
        pending.current();
        pending.current = null;
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup
          finalFocus={() => !pending.current}
          className="fixed inset-0 z-50 flex flex-col text-white outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-4">
            <Dialog.Title className="truncate text-sm">
              {name}
              {images.length > 1 && (
                <span className="text-white/60">
                  {" "}
                  · {index + 1}/{images.length}
                </span>
              )}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close photos"
              className="-mr-2 grid size-11 shrink-0 place-items-center focus-visible:outline-2 focus-visible:outline-white"
            >
              <XIcon size={24} />
            </Dialog.Close>
          </div>

          <section
            ref={track}
            className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={(event) => {
              const el = event.currentTarget;
              setIndex(Math.round(el.scrollLeft / el.clientWidth));
            }}
            aria-roledescription="carousel"
            aria-label={`${name} photos`}
          >
            {images.map((image, i) => (
              <div
                key={image.url}
                className="relative w-full shrink-0 snap-start"
              >
                <Image
                  src={image.url}
                  alt={alt(image, i)}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            ))}
          </section>

          {actions && (
            <div className="shrink-0 bg-surface px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink">
              <div className="mx-auto max-w-xl">{actions(close)}</div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
