"use client";

import { UserIcon } from "@phosphor-icons/react";
import { useAuthSheet } from "./auth-sheet";

export default function LoginOrRegister() {
  const { openAuthSheet } = useAuthSheet();
  return (
    <button
      type="button"
      onClick={() => openAuthSheet()}
      className="inline-flex items-center justify-center gap-1"
      aria-label="Sign in or register"
    >
      <UserIcon size={22} />
      <span className="hidden text-xs sm:inline">Sign In / Register</span>
    </button>
  );
}
