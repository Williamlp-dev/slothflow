'use client';
import { Search, Home, Origami, FolderPlus, FilePlus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotes } from '@/hooks/notes/use-notes';
import { useFolders } from '@/hooks/notes/use-folders';
import { FolderList } from '@/components/folders/folder-list';
import { NoteListItem } from '@/components/notes/note-list-item';

const navItems = {
  main: [
    { title: 'Buscar', url: '#', icon: Search },
    { title: 'Página inicial', url: '#', icon: Home },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { allNotes, unfiledNotes, loading: notesLoading, selectedNote, handleSelectNote, handleCreateNote, handleDeleteNote } = useNotes();
  const { folders, loading: foldersLoading, handleSelectFolder, handleCreateFolder, handleRenameFolder, handleDeleteFolder } = useFolders();

  const handleAddNewFolder = () => {
    const folderName = prompt('Digite o nome da nova pasta:');
    if (folderName && folderName.trim() !== '') {
      handleCreateFolder(folderName);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <Origami className="!size-5" />
                <span className="text-base font-semibold">SlothFlow</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-2 p-2">
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
        
        <Separator />

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <div className='flex items-center'>
              <Button variant="ghost" size="sm" onClick={() => handleCreateNote(null)} className="h-6 w-6 p-0" title="Criar Nota">
                <FilePlus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAddNewFolder} className="h-6 w-6 p-0" title="Criar Pasta">
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <SidebarMenu>
            <FolderList
              folders={folders}
              loading={foldersLoading}
              allNotes={allNotes}
              onFolderSelect={handleSelectFolder}
              onFolderDelete={handleDeleteFolder}
              onFolderRename={handleRenameFolder}
              onCreateNoteInFolder={handleCreateNote}
              selectedNote={selectedNote}
              onNoteSelect={handleSelectNote}
              onNoteDelete={handleDeleteNote}
            />
            {folders.length > 0 && unfiledNotes.length > 0 && <Separator className="my-2"/>}
            {notesLoading ? (
              <div></div>
            ) : (
              unfiledNotes.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={selectedNote?.id === note.id}
                  onSelect={handleSelectNote}
                  onDelete={handleDeleteNote}
                />
              ))
            )}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}