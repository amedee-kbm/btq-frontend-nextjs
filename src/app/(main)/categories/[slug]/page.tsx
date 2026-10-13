import type { Metadata } from "next";
import Link from "next/link";
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
import { findCategory, listCategories } from "@/lib/catalog/taxonomy";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

async function loadCategory(slug: string) {
  const found = findCategory(await listCategories(), slug);
  if (!found) notFound();
  return found;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, parent } = await loadCategory((await params).slug);
  const name = parent ? `${category.name} ${parent.name}` : category.name;
  return {
    title: name,
    description: `Shop ${name.toLowerCase()} at Btq., Kigali. See sizes, colours and prices, then order on WhatsApp.`,
    openGraph: category.cover_image
      ? { images: [category.cover_image] }
      : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { category, parent } = await loadCategory(slug);

  const breadcrumb: Crumb[] = [{ label: "Shop", href: "/shop" }];
  if (parent)
    breadcrumb.push({ label: parent.name, href: `/categories/${parent.slug}` });
  breadcrumb.push({ label: category.name });

  const siblings = parent ? parent.children : category.children;
  const parentLink = parent ?? category;

  return (
    <PageContainer>
      <PageHeader title={category.name} breadcrumb={breadcrumb}>
        {siblings.length > 0 && (
          <nav
            aria-label="Subcategories"
            className="-mx-4 overflow-x-auto px-4 pt-2"
          >
            <ul className="flex gap-2">
              {[{ ...parentLink, name: "All" }, ...siblings].map((c) => {
                const active = c.slug === category.slug;
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/categories/${c.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "inline-flex h-9 items-center border border-ink bg-ink px-4 text-sm whitespace-nowrap text-surface"
                          : "inline-flex h-9 items-center border border-divider bg-card px-4 text-sm whitespace-nowrap hover:border-ink-muted"
                      }
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </PageHeader>
      <ProductListing
        searchParams={await searchParams}
        fixed={{ category: slug }}
      />
    </PageContainer>
  );
}
