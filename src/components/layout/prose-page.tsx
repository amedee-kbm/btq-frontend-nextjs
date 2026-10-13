import { PageContainer, PageHeader } from "./page-header";

export function ProsePage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: title }]}
      />
      <div className="prose prose-sm max-w-none text-ink-soft prose-headings:font-heading prose-headings:font-normal prose-headings:text-ink prose-a:text-ink prose-strong:text-ink md:prose-base">
        {children}
      </div>
    </PageContainer>
  );
}
