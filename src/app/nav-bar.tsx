"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import AccountDropdown from "@/components/layout/account-dropdown";
import { useAuthSheet } from "@/components/layout/auth-sheet";
import LoginOrRegister from "@/components/layout/login-or-register";
import { MobileMenu } from "@/components/layout/mobile-menu";
import type { NavCategory, NavLink } from "@/components/layout/nav-types";
import { SearchBar } from "@/components/layout/search";
import { useUser } from "@/hooks/use-user";

const parentVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: "-4rem" },
};

const childVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: "-2rem" },
};

const MotionLink = motion.create(Link);

function AuthActions() {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <div className="size-5 animate-pulse rounded-full bg-muted" />;
  }
  return isAuthenticated ? <AccountDropdown /> : <LoginOrRegister />;
}

function FavoritesLink() {
  const { isAuthenticated } = useUser();
  const { openAuthSheet } = useAuthSheet();

  if (isAuthenticated) {
    return (
      <Link
        href="/favorites"
        aria-label="Favorites"
        className="grid size-9 place-items-center"
      >
        <HeartIcon size={22} />
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label="Favorites"
      onClick={() => openAuthSheet(undefined, "/favorites")}
      className="grid size-9 place-items-center"
    >
      <HeartIcon size={22} />
    </button>
  );
}

export default function NavBar({
  categories,
  collections,
}: {
  categories: NavCategory[];
  collections: NavLink[];
}) {
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (latest < prevScroll) {
      setHidden(false);
    } else if (latest > 100 && latest > prevScroll) {
      setHidden(true);
    }
    setPrevScroll(latest);
  });

  const barLinks: NavLink[] = [...categories, ...collections];

  return (
    <motion.nav
      aria-label="Site"
      className="sticky top-0 z-40 w-full border-b border-divider/60 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
      variants={parentVariants}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{
        ease: [0.1, 0.25, 0.3, 1],
        duration: 0.6,
        staggerChildren: 0.05,
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pt-3">
        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <MobileMenu categories={categories} collections={collections} />
            <Link href="/" className="shrink-0" aria-label="Btq. home">
              <span className="font-logo text-3xl font-extrabold italic md:text-4xl">
                Btq.
              </span>
            </Link>
          </div>

          <div className="hidden min-w-0 justify-center px-2 md:flex">
            <SearchBar className="max-w-xl" />
          </div>

          <div className="flex items-center justify-end gap-2">
            <FavoritesLink />
            <AuthActions />
          </div>
        </div>

        <div className="md:hidden">
          <SearchBar className="mb-2" />
        </div>

        <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-1">
          {barLinks.map((link) => (
            <MotionLink
              key={link.href}
              href={link.href}
              className="nav_a shrink-0"
              variants={childVariants}
              transition={{
                ease: [0.1, 0.25, 0.3, 1],
                duration: 0.4,
              }}
            >
              {link.label}
            </MotionLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
