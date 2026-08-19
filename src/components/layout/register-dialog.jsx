import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/components/ui/login-form";
import { useAuth } from "@/components/auth-provider";

export default function RegisterDialog() {
  const auth = useAuth();

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
    const response = await fetch("/api/login", requestOptions);
    let data = {};
    try {
      data = await response.json();
    } catch (error) {}
    if (response.ok) {
      auth.login();
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="xs">
            Sign up
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="font-logo text-lg">Btq.</DialogHeader>
        <LoginForm onSubmit={handleRegisterSubmit} />
      </DialogContent>
    </Dialog>
  );
}
