import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado')
  }
  
  return session.user
}

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers()
  })
}

export async function redirectIfAuthenticated(redirectTo: string = "/dashboard"): Promise<void> {
  const session = await getSession()
  if (session) {
    redirect(redirectTo)
  }
}

export async function redirectIfNotAuthenticated(redirectTo: string = "/login"): Promise<void> {
  const session = await getSession()
  if (!session) {
    redirect(redirectTo)
  }
}