import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/components/dasboard/sidebar/app-sidebar"
import { SiteHeader } from "@/components/dasboard/sidebar/Header/site-header"
import { NoteViewer } from "@/components/notes/note-viewer"
import MiniChat from "@/components/chat/mini-chat"
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
        <div className="flex flex-1 flex-col p-4">
          <NoteViewer />
        </div>
      </SidebarInset>
      <MiniChat />
    </SidebarProvider>
  )
}