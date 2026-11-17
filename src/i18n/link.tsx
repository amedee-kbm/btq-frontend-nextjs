"use client";

import NextLink from "next/link";
import { useI18n } from "./provider";

/** next/link that keeps the shopper in their language: "/shop" → "/en/shop" in English. */
export function Link({
  href,
  ...props
}: React.ComponentProps<typeof NextLink>) {
  const { href: localize } = useI18n();
  return (
    <NextLink
      href={typeof href === "string" ? localize(href) : href}
      {...props}
    />
  );
}
