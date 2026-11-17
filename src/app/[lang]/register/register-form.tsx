"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, LockIcon, UserIcon } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
  z
    .object({
      email: z.email(t.auth.invalidEmail),
      password: z.string().min(6, t.auth.passwordMin),
      passwordConfirmation: z.string().min(6, t.register.confirmRequired),
      username: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t.register.mismatch,
      path: ["passwordConfirmation"],
    });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function RegisterForm() {
  const { lang, t, href } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(makeSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      username: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        // The backend's message is in English; only show it in English.
        setError("root", {
          message: (lang === "en" && body.detail) || t.register.failed,
        });
        return;
      }
      if (!body.loggedIn) {
        // Account exists but auto-login failed: sign in manually.
        toast.success(t.register.created);
        router.replace(href(`/login${authQuery(searchParams)}`));
        return;
      }
      const { next, savedFavorite } = await finishAuth(searchParams, href("/"));
      await login();
      toast.success(
        savedFavorite ? t.register.welcomeSaved : t.register.welcome,
      );
      router.replace(next);
      router.refresh();
    } catch {
      setError("root", { message: t.register.networkError });
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">{t.common.register}</h1>
      <span className="text-xs text-muted-foreground uppercase">
        {t.register.subtitle}
      </span>

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">
                  {t.register.preferredName}
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <UserIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder={t.register.optional}
                    autoComplete="name"
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
                    autoComplete="new-password"
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
            name="passwordConfirmation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="passwordConfirmation">
                  {t.register.confirmPassword}
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <LockIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="passwordConfirmation"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {errors.root && (
            <div role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </div>
          )}
          <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
            {isSubmitting ? t.register.creating : t.common.register}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-4 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">
          {t.register.haveAccount}
        </span>
        <Link
          href={`/login${authQuery(searchParams)}`}
          className={buttonVariants({ size: "sm", variant: "link" })}
        >
          {t.common.signIn}
        </Link>
      </div>
    </div>
  );
}
