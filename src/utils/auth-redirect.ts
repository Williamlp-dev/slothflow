import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function redirectIfAuthenticated(redirectTo: string = "/dashboard"): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(session) {
    redirect(redirectTo)
  }
}

export async function redirectIfNotAuthenticated(redirectTo: string = "/login"): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    redirect(redirectTo)
  }
}