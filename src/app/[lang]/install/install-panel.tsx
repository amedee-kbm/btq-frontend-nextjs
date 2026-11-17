"use client";

import { useEffect, useState } from "react";
import { InstallSteps } from "@/components/pwa/install-help";
import { usePwa } from "@/components/pwa/pwa-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

// Chrome fires beforeinstallprompt shortly after load, not instantly.
const PROMPT_WAIT_MS = 3000;

export function InstallPanel() {
  const { isStandalone, installMethod, install } = usePwa();
  const [waited, setWaited] = useState(false);
  const { lang, t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), PROMPT_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  const shop = (
    <Link
      href="/shop"
      className={buttonVariants({ size: "lg", variant: "outline" })}
    >
      {t.install.browse}
    </Link>
  );

  if (isStandalone) {
    return (
      <>
        <p className="text-sm font-bold text-ink">{t.install.alreadyInApp}</p>
        {shop}
      </>
    );
  }

  if (installMethod === "prompt") {
    return (
      <>
        <Button size="lg" className="w-full" onClick={install}>
          {t.install.installBukiaa}
        </Button>
        {shop}
      </>
    );
  }

  if (installMethod === "ios" || installMethod === "in-app") {
    return (
      <>
        <InstallSteps
          method={installMethod}
          className="w-full border border-divider p-4 text-left"
        />
        {shop}
      </>
    );
  }

  // Installed already (Chrome stops offering it), or a browser that can't.
  if (!waited)
    return <p className="text-sm text-ink-muted">{t.install.oneMoment}</p>;
  return (
    <>
      <p className="text-sm text-ink-muted">
        {lang === "rw" ? (
          <>
            Niba Bukiaa isanzwe iri ahabanza ha telefoni yawe, uyifungurire aho.
            Bitabaye ibyo, fungura iyi paji muri <strong>Chrome</strong> kuri
            Android cyangwa <strong>Safari</strong> kuri iPhone kugira ngo
            uyishyiremo.
          </>
        ) : (
          <>
            If Bukiaa is already on your home screen, open it from there.
            Otherwise, open this page in <strong>Chrome</strong> on Android or{" "}
            <strong>Safari</strong> on iPhone to install it.
          </>
        )}
      </p>
      {shop}
    </>
  );
}
