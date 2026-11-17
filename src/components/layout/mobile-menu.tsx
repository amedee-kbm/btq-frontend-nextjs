"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { InstallAppButton } from "@/components/pwa/install-banner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import type { NavCategory, NavLink } from "./nav-types";

const linkClass =
  "flex min-h-11 items-center px-4 text-sm font-medium hover:bg-bone focus-visible:bg-bone focus-visible:outline-none";

export function MobileMenu({
  categories,
  collections,
}: {
  categories: NavCategory[];
  collections: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  // Close after navigating.
  // biome-ignore lint/correctness/useExhaustiveDependencies: close on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label={t.nav.openMenu}
          >
            <Menu />
          </Button>
        }
      />
      <SheetContent side="left" className="gap-0 overflow-y-auto">
        <SheetHeader className="border-b border-divider">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label={t.nav.main} className="flex flex-col py-2">
          <Link href="/shop" className={`${linkClass} font-bold`}>
            {t.common.shopAll}
          </Link>
          {collections.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`${linkClass} font-bold text-brand`}
            >
              {c.label}
            </Link>
          ))}
          <div className="my-2 border-t border-divider" />
          {categories.map((category) => (
            <div key={category.href}>
              <Link href={category.href} className={linkClass}>
                {category.label}
              </Link>
              {category.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`${linkClass} min-h-10 pl-8 font-normal text-ink-soft`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="my-2 border-t border-divider" />
          <Link href="/favorites" className={linkClass}>
            {t.common.favorites}
          </Link>
          <Link href="/faq" className={linkClass}>
            {t.common.howToOrder}
          </Link>
          <Link href="/contact" className={linkClass}>
            {t.common.contact}
          </Link>
          <InstallAppButton
            className={`${linkClass} w-full font-bold text-action`}
          />
          <div className="my-2 border-t border-divider" />
          <LanguageSwitcher full className="min-h-11 px-4 text-sm" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
