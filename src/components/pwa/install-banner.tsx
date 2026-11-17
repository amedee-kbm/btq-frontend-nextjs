"use client";

import { XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { splitLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { usePwa } from "./pwa-provider";

const STORAGE_KEY = "bukiaa:install-banner";
const SNOOZE_MS = 21 * 24 * 60 * 60 * 1000;
// Offer the app once someone is clearly browsing, not on first landing.
const PAGES_BEFORE_OFFER = 3;
const NEW_VISIT_AFTER_MS = 30 * 60 * 1000;
const SHOW_DELAY_MS = 2500;
const HIDDEN_ON = ["/login", "/register", "/offline", "/install"];

type Stored = { visits: number; lastSeen: number; dismissedAt?: number };

function read(): Stored {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (value && typeof value.visits === "number") return value;
  } catch {}
  return { visits: 0, lastSeen: 0 };
}

function write(value: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

/** A one-off invitation to install, shown to returning or engaged shoppers. */
export function InstallBanner() {
  const { installMethod, install } = usePwa();
  const pathname = splitLocale(usePathname()).path;
  const { t } = useI18n();
  const returning = useRef(false);
  const [pagesSeen, setPagesSeen] = useState(0);
  const [visible, setVisible] = useState(false);

  // Count visits once per mount.
  useEffect(() => {
    const stored = read();
    const now = Date.now();
    const visits =
      now - stored.lastSeen > NEW_VISIT_AFTER_MS
        ? stored.visits + 1
        : stored.visits;
    returning.current = visits >= 2;
    write({ ...stored, visits, lastSeen: now });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: count route changes
  useEffect(() => setPagesSeen((n) => n + 1), [pathname]);

  useEffect(() => {
    // In-app browsers can't install; nagging there only frustrates.
    if (!installMethod || installMethod === "in-app" || visible) return;
    if (HIDDEN_ON.includes(pathname)) return;
    const { dismissedAt } = read();
    if (dismissedAt && Date.now() - dismissedAt < SNOOZE_MS) return;
    if (!returning.current && pagesSeen < PAGES_BEFORE_OFFER) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname, pagesSeen, installMethod, visible]);

  if (!visible || !installMethod) return null;

  const dismiss = () => {
    write({ ...read(), dismissedAt: Date.now() });
    setVisible(false);
  };

  return (
    <section
      aria-label={t.pwa.bannerLabel}
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md items-center gap-3 border border-divider bg-card p-3 shadow-lg duration-300 animate-in fade-in-0 slide-in-from-bottom-6 md:right-4 md:left-auto md:mx-0"
    >
      <Image
        src="/icons/icon-192.png"
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{t.pwa.getTheApp}</p>
        <p className="text-xs text-ink-muted">{t.pwa.bannerText}</p>
      </div>
      <Button
        size="lg"
        onClick={async () => {
          await install();
          // Native dialog answered, or instructions shown: either way, done.
          dismiss();
        }}
      >
        {t.pwa.install}
      </Button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.pwa.notNow}
        className="-mr-1 grid size-8 shrink-0 place-items-center text-ink-muted hover:text-ink"
      >
        <XIcon size={18} />
      </button>
    </section>
  );
}

/**
 * A permanent "Install the app" entry (menu, footer). Renders nothing once
 * installed or where installing isn't possible.
 */
export function InstallAppButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { installMethod, install } = usePwa();
  const { t } = useI18n();
  if (!installMethod) return null;
  return (
    <button type="button" onClick={install} className={className}>
      {children ?? t.pwa.installTheApp}
    </button>
  );
}
