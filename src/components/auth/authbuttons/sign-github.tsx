"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SignGithub({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignInWithGithub() {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard'
      });
    } catch (error) {
      console.error('GitHub sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleSignInWithGithub}
      variant="outline"
      className={className}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <Github />}
    </Button>
  );
}