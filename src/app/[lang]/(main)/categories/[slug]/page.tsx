import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductListing,
  type SearchParams,
} from "@/components/catalog/product-listing";
import {
  type Crumb,
  PageContainer,
  PageHeader,
} from "@/components/layout/page-header";
import { getDictionary, languageAlternates, toLocale } from "@/i18n";
import { Link } from "@/i18n/link";
import { findCategory, listCategories } from "@/lib/catalog/taxonomy";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<SearchParams>;
};

async function loadCategory(slug: string) {
  const found = findCategory(await listCategories(), slug);
  if (!found) notFound();
  return found;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getDictionary(lang);
  const { category, parent } = await loadCategory(slug);
  const name = parent ? `${category.name} ${parent.name}` : category.name;
  return {
    title: name,
    description: t.category.description(name),
    alternates: languageAlternates(lang, `/categories/${slug}`),
    openGraph: category.cover_image
      ? { images: [category.cover_image] }
      : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const t = getDictionary(lang);
  const { category, parent } = await loadCategory(slug);

  const breadcrumb: Crumb[] = [{ label: t.common.shop, href: "/shop" }];
  if (parent)
    breadcrumb.push({ label: parent.name, href: `/categories/${parent.slug}` });
  breadcrumb.push({ label: category.name });

  const siblings = parent ? parent.children : category.children;
  const parentLink = parent ?? category;

  return (
    <PageContainer>
      <PageHeader title={category.name} breadcrumb={breadcrumb}>
        {siblings.length > 0 && (
          <nav aria-label={t.category.subcategories} className="pt-2">
            {/* Wrapped, not scrolled sideways: every option is visible at once. */}
            <ul className="flex flex-wrap gap-2">
              {[{ ...parentLink, name: t.category.all }, ...siblings].map(
                (c) => {
                  const active = c.slug === category.slug;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/categories/${c.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={
                          active
                            ? "inline-flex min-h-11 items-center rounded-pill border border-ink bg-ink px-4 text-sm font-semibold text-surface"
                            : "inline-flex min-h-11 items-center rounded-pill border border-divider bg-card px-4 text-sm font-medium hover:border-ink-muted"
                        }
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </nav>
        )}
      </PageHeader>
      <ProductListing
        lang={lang}
        searchParams={await searchParams}
        fixed={{ category: slug }}
      />
    </PageContainer>
  );
}
