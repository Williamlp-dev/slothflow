import { Tree } from "@/components/ui/tree"
import { FolderListItem } from "./folder-list-item"
import type { Folder, Note } from "@/types"

interface FolderListProps {
  folders: Folder[]
  loading: boolean
  allNotes: Note[]
  onFolderSelect: (folderId: string) => void
  onFolderDelete: (folderId: string) => void
  onFolderRename: (folderId: string, newName: string) => Promise<boolean>
  onCreateNoteInFolder: (folderId: string) => void
  selectedNote: Note | null
  onNoteSelect: (note: Note) => void
  onNoteDelete: (noteId: string) => void
}

const FolderListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="h-8 bg-muted rounded animate-pulse" />
    ))}
  </div>
)

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
  onNoteDelete,
}: FolderListProps) {
  if (loading) {
    return <FolderListSkeleton />
  }

  return (
    <Tree className="space-y-1">
      {folders.map((folder) => {
        const notesInFolder = allNotes.filter((note) => note.folderId === folder.id)
        return (
          <FolderListItem
            key={folder.id}
            folder={folder}
            notes={notesInFolder}
            onFolderSelect={onFolderSelect}
            onFolderDelete={onFolderDelete}
            onFolderRename={onFolderRename}
            onCreateNoteInFolder={onCreateNoteInFolder}
            selectedNote={selectedNote}
            onNoteSelect={onNoteSelect}
            onNoteDelete={onNoteDelete}
          />
        )
      })}
    </Tree>
  )
}