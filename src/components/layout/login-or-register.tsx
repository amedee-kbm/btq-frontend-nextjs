"use client";

import { UserIcon } from "@phosphor-icons/react";
import { useI18n } from "@/i18n/provider";
import { useAuthSheet } from "./auth-sheet";

export default function LoginOrRegister() {
  const { openAuthSheet } = useAuthSheet();
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => openAuthSheet()}
      className="inline-flex items-center justify-center gap-1"
      aria-label={t.nav.signInOrRegister}
    >
      <UserIcon size={22} />
      <span className="hidden text-xs sm:inline">{t.nav.signInRegister}</span>
    </button>
  );
}
