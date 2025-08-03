
import { SidebarMenuItem } from '@/components/ui/sidebar';
import { NoteListItem } from './note-list-item';
import type { Note } from '@/types';

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

const NoteListSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <SidebarMenuItem key={i} className="px-2 py-1.5">
        <div className="flex flex-1 animate-pulse items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-700" />
          <div className="h-4 w-20 rounded bg-gray-700" />
        </div>
      </SidebarMenuItem>
    ))}
  </>
);

export function NoteList({
  notes,
  loading,
  selectedNote,
  onNoteSelect,
  onNoteDelete,
}: NoteListProps) {
  if (loading) {
    return <NoteListSkeleton />;
  }

  if (notes.length === 0) {
    return (
      <SidebarMenuItem>
        <div className="px-2 py-1.5 text-sm text-gray-500">Nenhuma nota encontrada</div>
      </SidebarMenuItem>
    );
  }

  return (
    <>
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isSelected={selectedNote?.id === note.id}
          onSelect={onNoteSelect}
          onDelete={onNoteDelete}
        />
      ))}
    </>
  );
}