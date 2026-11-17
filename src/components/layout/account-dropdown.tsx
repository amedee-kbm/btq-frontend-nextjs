"use client";

import { UserCircleIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { splitLocale } from "@/i18n/config";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

export default function AccountDropdown() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { t, href } = useI18n();

  const handleLogout = async () => {
    await logout();
    if (splitLocale(pathname).path.startsWith("/favorites"))
      router.push(href("/"));
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center justify-center gap-1"
            aria-label={t.nav.accountMenu}
          >
            <UserCircleIcon size={22} weight="fill" />
            <span className="hidden max-w-32 truncate text-xs sm:inline">
              {user?.username || user?.email || t.common.account}
            </span>
          </button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="max-w-56 truncate">
            {user?.email}
          </DropdownMenuLabel>
          <DropdownMenuItem render={<Link href="/favorites" />}>
            {t.common.favorites}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {t.common.logOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
