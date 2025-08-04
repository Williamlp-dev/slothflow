import { Tree } from "@/components/ui/tree"
import { NoteListItem } from "./note-list-item"
import type { Note } from "@/types"

interface NoteListProps {
  notes: Note[]
  loading: boolean
  selectedNote: Note | null
  onNoteSelect: (note: Note) => void
  onNoteDelete: (noteId: string) => void
}

const NoteListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="h-8 bg-muted rounded animate-pulse" />
    ))}
  </div>
)

export function NoteList({ notes, loading, selectedNote, onNoteSelect, onNoteDelete }: NoteListProps) {
  if (loading) {
    return <NoteListSkeleton />
  }

  if (notes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Nenhuma nota encontrada
      </div>
    )
  }

  return (
    <Tree className="space-y-1">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isSelected={selectedNote?.id === note.id}
          onSelect={onNoteSelect}
          onDelete={onNoteDelete}
        />
      ))}
    </Tree>
  )
}