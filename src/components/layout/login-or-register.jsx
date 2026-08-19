import { UserIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function LoginOrRegister() {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center justify-center gap-1">
        <UserIcon size={22} />
        <span className="text-xs">Sign In / Register</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-4 text-center pt-12">
        <h2 className="text-lg font-bold">We're so happy to see you!</h2>
        <p className="text-ink-muted text-xs">
          Awesome new faves this way. Let's go shopping...
        </p>
        <div className="mt-4 flex flex-col w-full max-w-xs gap-4">
          <Button className="w-full" size="lg">
            <Link className="w-full" href="/login">
              SIGN IN
            </Link>
          </Button>
          <Button className="w-full" variant="outline" size="lg">
            REGISTER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
