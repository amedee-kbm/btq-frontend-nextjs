import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { listTags } from "@/lib/catalog/taxonomy";

export const metadata: Metadata = {
  title: "Shop by occasion",
  description:
    "Wedding guest, church, office, party: find the right outfit for the occasion at Btq., Kigali.",
};

export default async function OccasionsPage() {
  const tags = await listTags();
  return (
    <PageContainer>
      <PageHeader
        title="Shop by occasion"
        breadcrumb={[{ label: "Shop", href: "/shop" }, { label: "Occasions" }]}
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
                {tag.product_count} {tag.product_count === 1 ? "item" : "items"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
