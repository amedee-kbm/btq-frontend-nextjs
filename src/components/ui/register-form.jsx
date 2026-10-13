import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterForm({ onSubmit }) {
  function handleSubmit(event) {
    const form = event.currentTarget;
    const password = form.elements.namedItem("password");
    const passwordConfirmation = form.elements.namedItem(
      "passwordConfirmation",
    );

    passwordConfirmation.setCustomValidity(
      password.value === passwordConfirmation.value
        ? ""
        : "Passwords must match.",
    );

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    onSubmit(event);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full flex-col rounded-xl bg-card p-6 text-left text-sm text-muted-foreground sm:p-8"
    >
      <h2 className="mb-9 text-center text-xl font-bold text-foreground">
        Create your Btq. account
      </h2>
      <div className="my-2 flex items-center gap-1 rounded border border-border bg-muted pl-2">
        <svg
          className="text-muted-foreground"
          width="18"
          height="18"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
            stroke="currentColor"
            strokeOpacity=".6"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
            stroke="currentColor"
            strokeOpacity=".6"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <input
          className="w-full bg-transparent py-2.5 outline-none"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
      </div>
      {[
        ["password", "Password", "new-password"],
        ["passwordConfirmation", "Repeat Password", "new-password"],
      ].map(([name, placeholder, autoComplete]) => (
        <div
          className="mt-2 flex items-center gap-1 rounded border border-border bg-muted pl-2"
          key={name}
        >
          <svg
            className="text-muted-foreground"
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              fill="currentColor"
            />
          </svg>
          <input
            className="w-full bg-transparent py-2.5 outline-none"
            type="password"
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            minLength={8}
            required
            onInput={(event) => {
              if (name === "passwordConfirmation") {
                event.currentTarget.setCustomValidity("");
              }
            }}
          />
        </div>
      ))}
      <div className="mb-6" />
      <Button type="submit" className="w-full">
        Register
      </Button>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link className="text-primary underline" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
