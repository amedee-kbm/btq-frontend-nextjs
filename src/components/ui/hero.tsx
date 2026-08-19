"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRight,
  Truck,
  Sparkles,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const IMG = {
  main: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
  topRight:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
  bottomRight:
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=700&q=80",
};

export default function Hero() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // wire up to search/catalog route
    console.log("[v0] search submitted:", query);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-4xl bg-gradient-to-br from-secondary via-background to-card ring-1 ring-border">
        <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-10 lg:p-14">
          {/* Left: content */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-border">
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              Free shipping on orders over $75
            </span>

            <h1 className="mt-6 text-pretty font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Style that shows up,{" "}
              <span className="italic text-primary">effortlessly.</span>
            </h1>

            <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Curated pieces from independent designers and elevated everyday
              essentials — delivered fast, with returns made easy.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-lg items-center gap-2 rounded-full bg-card p-1.5 pl-5 shadow-sm ring-1 ring-border focus-within:ring-2 focus-within:ring-primary"
            >
              <Search
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="hero-search" className="sr-only">
                Search for clothing, shoes, accessories
              </label>
              <input
                id="hero-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dresses, denim, sneakers..."
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                className="shrink-0 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
              >
                Search
              </Button>
            </form>

            {/* Secondary action + CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Style me
              </button>
              <p className="text-sm text-muted-foreground">
                Describe an occasion. We build the outfit for you.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button className="rounded-full bg-primary px-7 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                Shop new arrivals
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <a
                href="#collections"
                className="group inline-flex items-center gap-1.5 text-base font-semibold text-foreground"
              >
                Explore collections
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Feature row */}
            <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { icon: Truck, label: "Delivery in 2–4 days" },
                { icon: RotateCcw, label: "Free 30-day returns" },
                { icon: ShieldCheck, label: "Secure checkout" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: image collage */}
          <div className="relative grid grid-cols-2 grid-rows-[1.3fr_1fr] gap-4">
            <div className="row-span-2 overflow-hidden rounded-3xl bg-muted">
              <img
                src={IMG.main || "/placeholder.svg"}
                alt="Model wearing a tailored autumn outfit"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-primary/15">
              <img
                src={IMG.topRight || "/placeholder.svg"}
                alt="Shopping bags from a fashion boutique"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-muted">
              <img
                src={IMG.bottomRight || "/placeholder.svg"}
                alt="A curated rack of seasonal clothing"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Floating status badge, echoing the reference */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg">
                <Truck className="h-4 w-4 text-primary" aria-hidden="true" />
                Arriving Thursday
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
