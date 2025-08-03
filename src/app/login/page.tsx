import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/auth/login/login-form"
import { redirectIfAuthenticated } from "@/utils/auth-utils"

export default async function Login() {

    await redirectIfAuthenticated()

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          SlothFlow
        </Link>
        <LoginForm />
        <div className="text-muted-foreground text-center text-xs text-balance">
          Não tem uma conta?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  )
}