import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getDictionary, languageAlternates } from "@/i18n";
import { Link } from "@/i18n/link";
import { listTags } from "@/lib/catalog/taxonomy";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    title: t.occasions.title,
    description: t.occasions.description,
    alternates: languageAlternates(lang, "/occasions"),
  };
}

export default async function OccasionsPage({ params }: Props) {
  const t = getDictionary((await params).lang);
  const tags = await listTags();
  return (
    <PageContainer>
      <PageHeader
        title={t.occasions.title}
        breadcrumb={[
          { label: t.common.shop, href: "/shop" },
          { label: t.occasions.crumb },
        ]}
      />
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {tags.map((tag) => (
          <li key={tag.slug}>
            <Link
              href={`/occasions/${tag.slug}`}
              className="flex h-full flex-col gap-1 border border-divider bg-card p-5 transition-colors hover:border-ink-muted"
            >
              <span className="font-heading text-xl">{tag.name}</span>
              <span className="text-xs text-ink-muted">
                {t.common.items(tag.product_count)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
