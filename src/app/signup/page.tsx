import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"
import { SignupForm } from "@/components/auth/signup/signup-form"

export default function Signup() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <SignupForm />
        <div className="text-muted-foreground text-center text-xs text-balance">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  )
}