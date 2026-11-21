import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/catalog/product-grid";
import {
  Breadcrumb,
  type Crumb,
  PageContainer,
} from "@/components/layout/page-header";
import { ProductView } from "@/components/product/product-view";
import {
  getDictionary,
  type Locale,
  languageAlternates,
  toLocale,
} from "@/i18n";
import { Link } from "@/i18n/link";
import { getProduct, listRelatedProducts } from "@/lib/catalog/products";
import { getSiteSettings } from "@/lib/catalog/settings";
import type { ProductDetail } from "@/lib/catalog/types";
import { formatRWF } from "@/lib/format";

// Rendered on first visit, then cached until the catalog is revalidated.
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getDictionary(lang);
  const [product, settings] = await Promise.all([
    getProduct(slug),
    getSiteSettings(),
  ]);
  const price =
    settings.show_prices && product.effective_price !== null
      ? formatRWF(product.effective_price)
      : undefined;
  const summary = [
    price,
    product.material,
    product.is_sold_out ? t.common.soldOut : t.common.orderOnWhatsApp,
  ]
    .filter(Boolean)
    .join(" · ");
  const description = product.description
    ? `${summary}. ${product.description}`.slice(0, 200)
    : summary;
  const image = product.images[0];
  // Hidden names come blank; the category is the next best title.
  const title =
    product.name || product.categories[0]?.name || t.productPage.fallbackTitle;

  return {
    title,
    description,
    alternates: languageAlternates(lang, `/products/${product.slug}`),
    openGraph: {
      type: "website",
      title: price ? `${title} – ${price}` : title,
      description,
      images: image ? [{ url: image.url, alt: image.alt || title }] : [],
    },
    twitter: { card: "summary_large_image" },
  };
}

function Details({ product, lang }: { product: ProductDetail; lang: Locale }) {
  const t = getDictionary(lang);
  const facts = [
    { label: t.common.material, value: product.material },
    { label: t.common.fit, value: product.fit_note },
  ].filter((f) => f.value);

  return (
    <div className="flex flex-col gap-5 border-t border-divider pt-6">
      {facts.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="contents">
              <dt className="font-bold">{fact.label}</dt>
              <dd className="text-ink-soft">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {product.description && (
        <p className="text-sm leading-relaxed whitespace-pre-line text-ink-soft">
          {product.description}
        </p>
      )}
      {product.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={t.product.occasions}>
          {product.tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/occasions/${tag.slug}`}
                className="inline-flex h-8 items-center rounded-pill bg-bone px-3 text-xs font-medium hover:bg-brand-soft"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function RelatedProducts({
  product,
  lang,
}: {
  product: ProductDetail;
  lang: Locale;
}) {
  const related = await listRelatedProducts(product);
  if (related.length === 0) return null;
  return <ProductGrid products={related} lang={lang} />;
}

export default async function ProductPage({ params }: Props) {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const t = getDictionary(lang);
  const [product, settings] = await Promise.all([
    getProduct(slug),
    getSiteSettings(),
  ]);

  const category = product.categories[0];
  const breadcrumb: Crumb[] = [{ label: t.common.shop, href: "/shop" }];
  if (category?.parent)
    breadcrumb.push({
      label: category.parent.name,
      href: `/categories/${category.parent.slug}`,
    });
  if (category)
    breadcrumb.push({
      label: category.name,
      href: `/categories/${category.slug}`,
    });

  return (
    <PageContainer>
      <Breadcrumb items={breadcrumb} className="hidden py-6 md:block" />
      <ProductView
        product={product}
        settings={{
          show_prices: settings.show_prices,
          whatsapp_number: settings.whatsapp_number,
          whatsapp_template: settings.whatsapp_template,
          whatsapp_restock_template: settings.whatsapp_restock_template,
        }}
      >
        <Details product={product} lang={lang} />
      </ProductView>

      {category && (
        <section className="pt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="pb-6 font-heading text-2xl">
            {t.product.related}
          </h2>
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <RelatedProducts product={product} lang={lang} />
          </Suspense>
        </section>
      )}
    </PageContainer>
  );
}
