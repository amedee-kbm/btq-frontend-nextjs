import { SITE_URL } from "@/config/defaults";
import type { ProductListItem, SiteSettings } from "@/lib/catalog/types";
import { formatRWF } from "@/lib/format";

export type WhatsAppKind = "order" | "restock";

export type WhatsAppSettings = Pick<
  SiteSettings,
  "whatsapp_number" | "whatsapp_template" | "whatsapp_restock_template"
>;

export function productUrl(
  slug: string,
  { size, color }: { size?: string; color?: string } = {},
) {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const query = params.toString();
  return `${SITE_URL}/products/${slug}${query ? `?${query}` : ""}`;
}

export function buildWhatsAppUrl(
  settings: WhatsAppSettings,
  product: Pick<ProductListItem, "slug" | "code" | "name" | "effective_price">,
  { size, color }: { size?: string; color?: string },
  kind: WhatsAppKind,
) {
  const template =
    kind === "order"
      ? settings.whatsapp_template
      : settings.whatsapp_restock_template;
  const values: Record<string, string> = {
    code: product.code,
    name: product.name,
    size: size ?? "any",
    color: color ?? "any",
    price: formatRWF(product.effective_price),
    url: productUrl(product.slug, { size, color }),
  };
  const message = template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
  return `${whatsAppChatUrl(settings.whatsapp_number)}?text=${encodeURIComponent(message)}`;
}

export function whatsAppChatUrl(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}
