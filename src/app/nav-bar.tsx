"use client";

import { Suspense } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Heart, Menu, Search } from "lucide-react";
import { HeartIcon, UserIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/layout/login-dialog";
import LoginSheet from "@/components/layout/login-sheet";
import RegisterDialog from "@/components/layout/register-dialog";
import RegisterSheet from "@/components/layout/register-sheet";
import { useUser } from "@/hooks/use-user";
import AccountDropdown from "@/components/layout/account-dropdown";
import LoginOrRegister from "@/components/layout/login-or-register";

const CATEGORIES = [
  "Complete",
  "Party Dresses",
  "Casual Dresses",
  "Jeans Dresses",
  "Everyday Styles",
  "Promos",
  "New Arrivals",
  "Top Dresses",
  "Shorts",
];

const parentVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: "-4rem" },
};

const childVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: "-2rem" },
};

const MotionLink = motion.create(Link);

function AuthActions({ mobile = false }: { mobile?: boolean }) {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <div className="size-5 animate-pulse bg-muted rounded-full" />;
  }

  if (isAuthenticated) {
    return <AccountDropdown />;
  }

  return <LoginOrRegister />;
}

export default function NavBar() {
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);

  const { scrollY } = useScroll();

  function update(latest: number, prev: number): void {
    if (latest < prev) {
      setHidden(false);
    } else if (latest > 100 && latest > prev) {
      setHidden(true);
    }
  }

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    update(latest, prevScroll);
    setPrevScroll(latest);
  });

  return (
    <motion.nav
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <Link href="/" className="shrink-0">
              <span className="font-logo text-3xl font-extrabold italic md:text-4xl">
                Btq.
              </span>
            </Link>
          </div>

          <div className="hidden min-w-0 justify-center px-2 md:flex">
            <button
              type="button"
              className="flex h-10 w-full max-w-xl items-center gap-2 rounded-pill border border-divider bg-card px-4 text-sm text-ink-muted transition-colors hover:border-ink-disabled"
            >
              <Search size={18} className="shrink-0" />
              <span className="truncate">
                Search items, occasions & categories
              </span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <HeartIcon size={18} />
            <div className="hidden items-center gap-2 md:flex">
              <AuthActions />
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <AuthActions mobile />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className="flex h-10 mb-2 w-full items-center gap-2 rounded-pill border border-divider bg-card px-4 text-sm text-ink-muted transition-colors hover:border-ink-disabled"
          >
            <Search size={18} />
            <span>Search items, occasions & categories</span>
          </button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-1 lg:text-xs lg:font-bold">
          {CATEGORIES.map((category) => (
            <MotionLink
              key={category}
              href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="nav_a shrink-0 text-xs font-bold"
              variants={childVariants}
              transition={{
                ease: [0.1, 0.25, 0.3, 1],
                duration: 0.4,
              }}
            >
              {category}
            </MotionLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
