import { PageContainer } from "@/components/layout/page-header";
import { ProductGridSkeleton } from "./product-grid";

export function ListingSkeleton() {
  return (
    <PageContainer>
      <div
        className="flex flex-col gap-3 pt-6 pb-6 md:pt-10"
        aria-hidden="true"
      >
        <div className="h-3 w-32 animate-pulse bg-bone" />
        <div className="h-9 w-56 animate-pulse bg-bone" />
      </div>
      <div className="flex gap-8">
        <div className="hidden w-64 shrink-0 animate-pulse bg-bone/60 lg:block" />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between pb-4">
            <div className="h-9 w-20 animate-pulse bg-bone" />
            <div className="h-9 w-40 animate-pulse bg-bone" />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
      <output className="sr-only">Loading products…</output>
    </PageContainer>
  );
}
