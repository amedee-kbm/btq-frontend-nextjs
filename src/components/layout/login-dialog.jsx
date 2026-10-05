import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/components/ui/login-form";
import { useUser } from "@/hooks/use-user";

export default function LoginDialog() {
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
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="link" size="xs">
            Log in
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        {/* <DialogHeader className="font-logo text-lg text-center">Sign In</DialogHeader> */}
        <LoginForm onSubmit={handleLoginSubmit} />
      </DialogContent>
    </Dialog>
  );
}
