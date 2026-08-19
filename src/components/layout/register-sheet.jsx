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
import { useAuth } from "@/components/auth-provider";

export default function RegisterSheet() {
  const auth = useAuth();

  async function handleLoginSubmit(event) {
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
    const response = await fetch("/api/login", requestOptions);
    console.log("response", response);
    let data = {};
    try {
      data = await response.json();
    } catch (error) {}
    if (response.ok) {
      console.log("logged in");
      auth.login();
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
        <LoginForm onSubmit={handleLoginSubmit} />
      </SheetContent>
    </Sheet>
  );
}
