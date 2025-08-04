"use client"

import { FileText, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TreeItem, TreeItemLabel } from "@/components/ui/tree"
import { useTreeItem } from "@/hooks/use-tree-item"
import type { Note } from "@/types"

interface NoteListItemProps {
  note: Note
  isSelected: boolean
  onSelect: (note: Note) => void
  onDelete: (noteId: string) => void
}

export function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  const noteItem = useTreeItem({
    id: note.id,
    name: note.title || "Sem Título",
    type: "note",
    level: 0,
    isSelected,
    data: note,
  })

  return (
    <TreeItem 
      item={noteItem} 
      className="group w-full cursor-pointer" 
      asChild
    >
      <div onClick={() => onSelect(note)}>
        <TreeItemLabel className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="size-4 text-gray-500" />
            <span className="truncate text-sm">{note.title || "Sem Título"}</span>
          </div>
         
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note.id)
                }}
                className="text-red-500 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TreeItemLabel>
      </div>
    </TreeItem>
  )
}