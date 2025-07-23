import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/components/dasboard/sidebar/app-sidebar"
import { SiteHeader } from "@/components/dasboard/sidebar/Header/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers() 
})
if(!session) {
  redirect("/login")
}

 return (

    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}