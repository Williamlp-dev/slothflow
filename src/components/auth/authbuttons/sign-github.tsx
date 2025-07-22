import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";

async function handleSignInWithGithub() {
  await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/dashboard'
  })
}

export default function SignGithub({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      onClick={handleSignInWithGithub}
      variant="outline"
      className={className}
    >
      <Github />
    </Button>
  )
}