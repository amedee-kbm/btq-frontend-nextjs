import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-heading text-2xl">This item isn't available anymore</p>
      <p className="max-w-sm text-sm text-ink-muted">
        It may have been removed from the shop. Have a look at what's new.
      </p>
      <Link href="/shop" className={buttonVariants({ size: "lg" })}>
        Shop all
      </Link>
    </div>
  );
}
