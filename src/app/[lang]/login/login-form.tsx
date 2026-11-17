"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, LockIcon } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useUser } from "@/hooks/use-user";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { authQuery, finishAuth } from "@/lib/auth-redirect";

const makeSchema = (t: Dictionary) =>
  z.object({
    email: z.email(t.auth.invalidEmail),
    password: z.string().min(6, t.auth.passwordMin),
  });

type Login = z.infer<ReturnType<typeof makeSchema>>;

export function LoginForm() {
  const { lang, t, href } = useI18n();
  const { login } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(makeSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: Login) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.loggedIn) {
        // The backend's message is in English; only show it in English.
        toast.error(
          (lang === "en" && data.message) || t.login.invalidCredentials,
        );
        return;
      }
      const { next, savedFavorite } = await finishAuth(searchParams, href("/"));
      await login();
      toast.success(savedFavorite ? t.login.signedInSaved : t.login.signedIn);
      router.replace(next);
      router.refresh();
    } catch {
      toast.error(t.auth.somethingWrong);
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">{t.common.signIn}</h1>
      <span className="text-xs text-muted-foreground uppercase">
        {t.login.subtitle}
      </span>

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">{t.auth.email}</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <EnvelopeIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">{t.auth.password}</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <LockIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
            {isSubmitting ? t.login.signingIn : t.common.signIn}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-4 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">
          {t.login.noAccount}
        </span>
        <Link
          href={`/register${authQuery(searchParams)}`}
          className={buttonVariants({ size: "sm", variant: "link" })}
        >
          {t.common.register}
        </Link>
      </div>
    </div>
  );
}
