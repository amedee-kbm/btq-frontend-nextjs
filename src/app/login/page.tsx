"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, LockIcon } from "@phosphor-icons/react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
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

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Login = z.infer<typeof schema>;

export default function Login() {
  const { login } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: Login) => {
    try {
      const response = await axios.post("/api/login", value);
      if (response.data?.loggedIn) {
        toast.success("Logged in successfully");
        await login();
        const nextUrl = searchParams.get("next");
        const invalidNextUrl = ["/login", "/register", "/logout"];
        if (nextUrl && nextUrl.startsWith("/") && !invalidNextUrl.includes(nextUrl)) {
          router.replace(nextUrl);
        } else {
          router.replace("/");
        }
      } else {
        toast.error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Invalid credentials");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <span className="text-muted-foreground text-xs uppercase">
        Sign in to access your account
      </span>

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
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

          <Button type="submit" className="w-full mt-4">
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </FieldGroup>
      </form>

      <div className="flex flex-col justify-center items-center mt-4">
        <span className="text-muted-foreground text-xs">
          Don't have an account?
        </span>

        <Button
          size={"sm"}
          variant={"link"}
          onClick={() => router.push("/register")}
        >
          Sign-up
        </Button>
      </div>
    </div>
  );
}
