import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import LoginForm from "@/components/ui/login-form";
import { useUser } from "@/hooks/use-user";

export default function LoginSheet() {
  const { login } = useUser();

  async function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const objectFromForm = Object.fromEntries(formData);
    const payload = {
      username: objectFromForm.email || objectFromForm.username,
      password: objectFromForm.password,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch("/api/login", requestOptions);
    if (response.ok) {
      await login();
    }
  }
  return (
    <Sheet>
      <SheetTrigger render={<Button>Log in</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="font-logo text-lg">Btq.</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <LoginForm onSubmit={handleLoginSubmit} />
      </SheetContent>
    </Sheet>
  );
}
