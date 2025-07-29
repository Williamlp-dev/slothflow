'use client';
import { Plus, Search, Trash2, Home, Origami } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotes } from '@/hooks/notes/use-notes';
import { NoteList } from '@/components/notes/note-list';

const navItems = {
  main: [
    { title: 'Buscar', url: '#', icon: Search },
    { title: 'Página inicial', url: '#', icon: Home },
  ],
  footer: [{ title: 'Lixeira', url: '#', icon: Trash2 }],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { notes, loading, selectedNote, handleSelectNote, handleCreateNote, handleDeleteNote } =
    useNotes();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <Origami className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />

      <SidebarContent className="flex flex-col gap-4">
        <div className="px-2">
          <SidebarMenu>
            {navItems.main.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        <div className="px-2">
          <div className="mb-2 flex items-center justify-between">
            <SidebarGroupLabel>Notas</SidebarGroupLabel>
            <Button variant="ghost" size="sm" onClick={handleCreateNote} className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <SidebarMenu>
            <NoteList
              notes={notes}
              loading={loading}
              selectedNote={selectedNote}
              onNoteSelect={handleSelectNote}
              onNoteDelete={handleDeleteNote}
            />
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {navItems.footer.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}