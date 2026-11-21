import { SITE_URL } from "@/config/defaults";
import { DEFAULT_LOCALE, type Locale, localizePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { ProductListItem, SiteSettings } from "@/lib/catalog/types";
import { formatRWF } from "@/lib/format";

export type WhatsAppKind = "order" | "restock";

export type WhatsAppSettings = Pick<
  SiteSettings,
  | "show_prices"
  | "whatsapp_number"
  | "whatsapp_template"
  | "whatsapp_restock_template"
>;

/** Absolute product link; in the default language unless `lang` says otherwise. */
export function productUrl(
  slug: string,
  { size, color }: { size?: string; color?: string } = {},
  lang: Locale = DEFAULT_LOCALE,
) {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const query = params.toString();
  const path = localizePath(lang, `/products/${slug}`);
  return `${SITE_URL}${path}${query ? `?${query}` : ""}`;
}

export function buildWhatsAppUrl(
  settings: WhatsAppSettings,
  product: Pick<ProductListItem, "slug" | "code" | "name" | "effective_price">,
  { size, color }: { size?: string; color?: string },
  kind: WhatsAppKind,
) {
  let template =
    kind === "order"
      ? settings.whatsapp_template
      : settings.whatsapp_restock_template;
  const price = settings.show_prices ? product.effective_price : null;
  // Hidden or unpriced: drop the placeholder rather than quote "RWF 0".
  if (price === null) template = dropPlaceholder(template, "price");
  // Hidden names come blank; the code alone tells the shop what's wanted.
  if (!product.name) template = dropPlaceholder(template, "name");
  const values: Record<string, string> = {
    code: product.code,
    name: product.name,
    size: size ?? "any",
    color: color ?? "any",
    price: price === null ? "" : formatRWF(price),
    url: productUrl(product.slug, { size, color }),
  };
  const message = template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
  return `${whatsAppChatUrl(settings.whatsapp_number)}?text=${encodeURIComponent(message)}`;
}

/** Removes `{key}` with any brackets, dash and space before it: "A – {name}," → "A,". */
function dropPlaceholder(template: string, key: string) {
  return template.replace(
    new RegExp(`\\s*[–-]?\\s*\\(?\\{${key}\\}\\)?`, "g"),
    "",
  );
}

export function whatsAppChatUrl(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

/** The product a page is about, for "ask us" links. */
export type InquirySubject = {
  product: Pick<ProductListItem, "slug" | "code" | "name">;
  size?: string;
  color?: string;
};

/**
 * A chat with a general question, or one about the given product. Questions, as
 * opposed to orders, are worded in the shopper's language (`messages`), not by
 * the backend templates.
 */
export function buildInquiryUrl(
  number: string,
  messages: Dictionary["inquiry"],
  subject?: InquirySubject,
) {
  let message = messages.general;
  if (subject) {
    const { product, size, color } = subject;
    const item = [
      product.name ? `${product.code} – ${product.name}` : product.code,
      size && messages.size(size),
      color && messages.colour(color),
    ]
      .filter(Boolean)
      .join(", ");
    message = messages.about(item, productUrl(product.slug, { size, color }));
  }
  return `${whatsAppChatUrl(number)}?text=${encodeURIComponent(message)}`;
}
