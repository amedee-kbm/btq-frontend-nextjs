"use client";

import {
  CaretRightIcon,
  ChatCircleDotsIcon,
  DownloadSimpleIcon,
  QuestionIcon,
  SparkleIcon,
  SquaresFourIcon,
  TagIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { InstallAppButton } from "@/components/pwa/install-banner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import type { NavLink } from "./nav-types";

const rowClass =
  "flex min-h-13 w-full items-center gap-3 px-4 text-base font-medium text-ink hover:bg-bone focus-visible:bg-bone focus-visible:outline-none";

function Row({
  href,
  icon,
  children,
  className,
  onClick,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${rowClass} ${className ?? ""}`}
    >
      <span aria-hidden="true" className="text-ink-muted">
        {icon}
      </span>
      <span className="flex-1">{children}</span>
      <CaretRightIcon
        size={18}
        aria-hidden="true"
        className="text-ink-disabled"
      />
    </Link>
  );
}

/** Everything that isn't a category: collections, help, the app, language. */
export function MobileMenu({
  collections,
  open,
  onOpenChange,
  onBrowseCategories,
}: {
  collections: NavLink[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBrowseCategories: () => void;
}) {
  const { t } = useI18n();
  // Closes even when the link is to the page already shown.
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[88dvh] gap-0 pb-[env(safe-area-inset-bottom)]"
      >
        <SheetHeader className="min-h-16 justify-center border-b border-divider">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label={t.nav.main}
          className="flex flex-col overflow-y-auto overscroll-contain py-2"
        >
          <button
            type="button"
            onClick={onBrowseCategories}
            className={`${rowClass} font-bold`}
          >
            <span aria-hidden="true" className="text-ink-muted">
              <SquaresFourIcon size={22} />
            </span>
            <span className="flex-1 text-left">{t.browse.title}</span>
            <CaretRightIcon
              size={18}
              aria-hidden="true"
              className="text-ink-disabled"
            />
          </button>
          <Row
            onClick={close}
            href="/shop"
            icon={<TagIcon size={22} />}
            className="font-bold"
          >
            {t.common.shopAll}
          </Row>
          {collections.map((c) => (
            <Row
              onClick={close}
              key={c.href}
              href={c.href}
              icon={<SparkleIcon size={22} className="text-brand" />}
              className="font-bold text-brand"
            >
              {c.label}
            </Row>
          ))}
          <div className="my-2 border-t border-divider" />
          <Row onClick={close} href="/faq" icon={<QuestionIcon size={22} />}>
            {t.common.howToOrder}
          </Row>
          <Row
            onClick={close}
            href="/contact"
            icon={<ChatCircleDotsIcon size={22} />}
          >
            {t.common.contact}
          </Row>
          <InstallAppButton className={`${rowClass} font-bold text-action`}>
            <span aria-hidden="true">
              <DownloadSimpleIcon size={22} />
            </span>
            <span className="flex-1 text-left">{t.pwa.installTheApp}</span>
          </InstallAppButton>
          <div className="my-2 border-t border-divider" />
          <div className="flex min-h-13 items-center gap-3 px-4">
            <TranslateIcon
              size={22}
              aria-hidden="true"
              className="text-ink-muted"
            />
            <LanguageSwitcher full className="text-base" />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
