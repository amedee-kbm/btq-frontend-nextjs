import { WhatsappLogoIcon } from "@phosphor-icons/react";
import type { ProductDetail } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, type WhatsAppSettings } from "@/lib/whatsapp";

const base =
  "flex h-13 w-full items-center justify-center gap-2 px-4 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * "Order on WhatsApp" when the selected variant is available, "Ask if it's
 * coming back" when it isn't (or the product is sold out), otherwise a prompt
 * to pick the missing size/colour.
 */
export function WhatsAppButton({
  settings,
  product,
  size,
  color,
}: {
  settings: WhatsAppSettings;
  product: ProductDetail;
  size?: string;
  color?: string;
}) {
  const needsSize = product.sizes.length > 0 && !size;
  const needsColor = product.colors.length > 0 && !color;

  if (!product.is_sold_out && (needsSize || needsColor)) {
    return (
      <button
        type="button"
        disabled
        className={cn(base, "cursor-not-allowed bg-bone text-ink-muted")}
      >
        {needsSize ? "Select a size" : "Select a colour"}
      </button>
    );
  }

  const available = product.variants.some(
    (v) => v.size === size && v.color === color && v.is_available,
  );
  const kind = !product.is_sold_out && available ? "order" : "restock";

  return (
    <a
      href={buildWhatsAppUrl(settings, product, { size, color }, kind)}
      target="_blank"
      rel="noopener"
      className={cn(
        base,
        kind === "order"
          ? "bg-action text-white hover:bg-action-dark"
          : "border border-ink bg-card text-ink hover:bg-bone",
      )}
    >
      <WhatsappLogoIcon size={22} weight="fill" aria-hidden="true" />
      {kind === "order" ? "Order on WhatsApp" : "Ask if it's coming back"}
    </a>
  );
}
