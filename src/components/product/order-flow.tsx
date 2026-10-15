"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowLeftIcon,
  CheckIcon,
  PencilSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";
import { Price } from "@/components/catalog/price";
import { Swatch } from "@/components/catalog/swatch";
import type { ProductDetail } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { orderImages } from "./gallery";
import { WhatsAppButton } from "./whatsapp-button";

export type Selection = { size?: string; color?: string };
type Step = "color" | "size" | "review";

/**
 * Ordering one question at a time, for shoppers new to size/colour pickers:
 * pick a colour, pick a size, check and send. Steps with a single option are
 * skipped, and it opens on the first thing still to choose.
 */
export function OrderFlow({
  open,
  onOpenChange,
  ...props
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & FlowProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed inset-0 z-50 flex flex-col bg-surface text-ink outline-none duration-200 data-open:animate-in data-open:slide-in-from-bottom-8 data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 md:inset-auto md:top-1/2 md:left-1/2 md:h-[min(46rem,90vh)] md:w-lg md:-translate-x-1/2 md:-translate-y-1/2">
          {/* Mounted only while open, so every opening starts fresh. */}
          <Flow {...props} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type FlowProps = {
  product: ProductDetail;
  settings: WhatsAppSettings;
  selection: Selection;
  onSelect: (next: Selection) => void;
  isColorAvailable: (color: string) => boolean;
  isSizeAvailable: (size: string) => boolean;
};

function Flow({
  product,
  settings,
  selection,
  onSelect,
  isColorAvailable,
  isSizeAvailable,
}: FlowProps) {
  const steps: Step[] = [
    ...(product.colors.length > 1 ? (["color"] as const) : []),
    ...(product.sizes.length > 1 ? (["size"] as const) : []),
    "review",
  ];
  const [step, setStep] = useState<Step>(
    () => steps.find((s) => s !== "review" && !selection[s]) ?? "review",
  );
  const at = steps.indexOf(step);
  const next = () => setStep(steps[at + 1]);

  const title = {
    color: "Which colour would you like?",
    size: "Which size do you wear?",
    review: "Check your order",
  }[step];

  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-divider px-2">
        {at > 0 ? (
          <button
            type="button"
            onClick={() => setStep(steps[at - 1])}
            className="flex h-11 items-center gap-1 px-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand"
          >
            <ArrowLeftIcon size={20} aria-hidden="true" />
            Back
          </button>
        ) : (
          <span className="w-11" />
        )}
        <p className="flex-1 text-center text-sm text-ink-muted">
          Step {at + 1} of {steps.length}
        </p>
        <Dialog.Close
          aria-label="Close"
          className="grid size-11 place-items-center focus-visible:outline-2 focus-visible:outline-brand"
        >
          <XIcon size={22} />
        </Dialog.Close>
      </div>
      <div className="flex h-1 shrink-0 bg-bone" aria-hidden="true">
        <div
          className="bg-action transition-[width] duration-300"
          style={{ width: `${((at + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-6 pb-4">
        <Dialog.Title className="font-heading text-2xl leading-tight">
          {title}
        </Dialog.Title>

        {step === "color" && (
          <ul className="grid grid-cols-2 gap-3">
            {product.colors.map((color) => {
              const active = color.name === selection.color;
              const available = isColorAvailable(color.name);
              const photo =
                product.images.find((i) => i.color === color.name) ??
                product.images[0];
              return (
                <li key={color.name}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      onSelect({ ...selection, color: color.name });
                      next();
                    }}
                    className={cn(
                      "flex w-full flex-col overflow-hidden border-2 bg-card text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      active ? "border-ink" : "border-divider",
                    )}
                  >
                    <span className="relative block aspect-3/4 w-full bg-bone">
                      {photo && (
                        <Image
                          src={photo.url}
                          alt=""
                          fill
                          sizes="50vw"
                          className={cn(
                            "object-cover",
                            !available && "opacity-50",
                          )}
                        />
                      )}
                      {active && <Chosen />}
                    </span>
                    <span className="flex items-center gap-2 p-3">
                      <Swatch hex={color.hex} className="size-5" />
                      <span className="flex flex-col">
                        <span className="font-bold">{color.name}</span>
                        {!available && (
                          <span className="text-xs text-ink-muted">
                            Sold out
                            {selection.size && ` in size ${selection.size}`}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {step === "size" && (
          <>
            {product.fit_note && (
              <p className="bg-bone p-3 text-sm text-ink-soft">
                <span className="font-bold text-ink">Fit: </span>
                {product.fit_note}
              </p>
            )}
            <ul className="grid grid-cols-3 gap-3">
              {product.sizes.map((size) => {
                const active = size === selection.size;
                const available = isSizeAvailable(size);
                return (
                  <li key={size}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        onSelect({ ...selection, size });
                        next();
                      }}
                      className={cn(
                        "relative flex h-20 w-full flex-col items-center justify-center border-2 text-lg font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                        active
                          ? "border-ink bg-ink text-surface"
                          : "border-divider bg-card",
                        !available && !active && "text-ink-muted",
                      )}
                    >
                      {size}
                      {!available && (
                        <span className="text-xs font-normal">Sold out</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-ink-muted">
              Not sure? Pick the closest — we'll help you confirm on WhatsApp.
            </p>
          </>
        )}

        {step === "review" && (
          <Review
            product={product}
            selection={selection}
            canEdit={(s) => steps.includes(s)}
            onEdit={setStep}
          />
        )}
      </div>

      {step === "review" && (
        <div className="shrink-0 border-t border-divider px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <WhatsAppButton
            settings={settings}
            product={product}
            size={selection.size}
            color={selection.color}
          />
          <p className="pt-2 text-center text-xs text-ink-muted">
            This opens WhatsApp with your order written for you. Just press
            send.
          </p>
        </div>
      )}
    </>
  );
}

function Review({
  product,
  selection,
  canEdit,
  onEdit,
}: {
  product: ProductDetail;
  selection: Selection;
  canEdit: (step: Step) => boolean;
  onEdit: (step: Step) => void;
}) {
  const photo = orderImages(product.images, selection.color)[0];
  const rows = [
    { step: "color" as const, label: "Colour", value: selection.color },
    { step: "size" as const, label: "Size", value: selection.size },
  ].filter((row) => row.value);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        <div className="relative aspect-2/3 w-28 shrink-0 bg-bone">
          {photo && (
            <Image
              src={photo.url}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-wider text-ink-muted uppercase">
            {product.code}
          </p>
          <p className="font-heading text-lg leading-tight">{product.name}</p>
          <Price product={product} />
        </div>
      </div>

      <dl className="divide-y divide-divider border-y border-divider">
        {rows.map((row) => (
          <div key={row.step} className="flex items-center gap-3 py-3">
            <dt className="w-16 text-sm text-ink-muted">{row.label}</dt>
            <dd className="flex-1 font-bold">{row.value}</dd>
            {canEdit(row.step) && (
              <dd>
                <button
                  type="button"
                  onClick={() => onEdit(row.step)}
                  className="flex h-11 items-center gap-1 px-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <PencilSimpleIcon size={16} aria-hidden="true" />
                  Change
                  <span className="sr-only"> {row.label.toLowerCase()}</span>
                </button>
              </dd>
            )}
          </div>
        ))}
      </dl>

      {!product.variants.some(
        (v) =>
          v.size === selection.size &&
          v.color === selection.color &&
          v.is_available,
      ) && (
        <p className="bg-bone p-3 text-sm">
          This one is sold out right now. Ask us if it's coming back, or go back
          and pick another option.
        </p>
      )}

      <p className="text-sm text-ink-muted">
        Pay with MoMo or cash on delivery · Motard delivery or pickup at CHIC
        Building B30A
      </p>
    </div>
  );
}

function Chosen() {
  return (
    <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-ink text-surface">
      <CheckIcon size={16} weight="bold" aria-hidden="true" />
    </span>
  );
}
