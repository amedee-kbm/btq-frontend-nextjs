import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/i18n";
import { RegisterForm } from "./register-form";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary((await params).lang);
  return { title: t.common.register, robots: { index: false } };
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
