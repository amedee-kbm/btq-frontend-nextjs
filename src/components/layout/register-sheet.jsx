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

export default function RegisterSheet() {
  const { login } = useUser();

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const objectFromForm = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFromForm);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };
    const response = await fetch("/api/register", requestOptions);
    if (response.ok) {
      // Automatic login after registration if desired
    }
  }
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Sign up</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="font-logo text-lg">Btq.</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <LoginForm onSubmit={handleRegisterSubmit} />
      </SheetContent>
    </Sheet>
  );
}
