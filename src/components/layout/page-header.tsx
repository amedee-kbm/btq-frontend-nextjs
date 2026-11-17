"use client";

import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  const { t } = useI18n();
  const crumbs: Crumb[] = [{ label: t.common.home, href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-muted">
        {crumbs.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-ink hover:underline"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumb = [],
  children,
}: {
  title: string;
  description?: string;
  breadcrumb?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-2 pt-6 pb-6 md:pt-10">
      <Breadcrumb items={breadcrumb} />
      <h1 className="font-heading text-3xl md:text-4xl">{title}</h1>
      {description && (
        <p className="max-w-2xl text-sm text-ink-soft">{description}</p>
      )}
      {children}
    </header>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4", className)}>
      {children}
    </div>
  );
}
