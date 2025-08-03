import { Folder } from '@/hooks/notes/use-folders';
import { SidebarMenuItem } from '@/components/ui/sidebar';
import { FolderListItem } from './folder-list-item';
import { Note } from '@/lib/stores/note-store';

interface FolderListProps {
  folders: Folder[];
  loading: boolean;
  allNotes: Note[];
  onFolderSelect: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
  onFolderRename: (folderId: string, newName: string) => Promise<boolean>;
  onCreateNoteInFolder: (folderId: string) => void;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

const FolderListSkeleton = () => (
  <>
    {Array.from({ length: 2 }).map((_, i) => (
      <SidebarMenuItem key={i} className="px-2 py-1.5">
        <div className="flex flex-1 animate-pulse items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-700" />
          <div className="h-4 w-16 rounded bg-gray-700" />
        </div>
      </SidebarMenuItem>
    ))}
  </>
);

export function FolderList({
  folders,
  loading,
  allNotes,
  onFolderSelect,
  onFolderDelete,
  onFolderRename,
  onCreateNoteInFolder,
  selectedNote,
  onNoteSelect,
  onNoteDelete
}: FolderListProps) {
  if (loading) {
    return <FolderListSkeleton />;
  }

  return (
    <>
      {folders.map((folder) => {
        const notesInFolder = allNotes.filter(note => note.folderId === folder.id);
        return (
          <FolderListItem
            key={folder.id}
            folder={folder}
            notesInFolder={notesInFolder}
            isSelected={false} // A seleção ativa é visualmente tratada no botão
            onSelect={onFolderSelect}
            onDelete={onFolderDelete}
            onRename={onFolderRename}
            onCreateNoteInFolder={onCreateNoteInFolder}
            selectedNote={selectedNote}
            onNoteSelect={onNoteSelect}
            onNoteDelete={onNoteDelete}
          />
        )
      })}
    </>
  );
}