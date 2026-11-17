import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/i18n";
import { LoginForm } from "./login-form";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary((await params).lang);
  return { title: t.common.signIn, robots: { index: false } };
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
