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
import { useAuth } from "@/components/auth-provider";

export default function LoginDialog() {
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
