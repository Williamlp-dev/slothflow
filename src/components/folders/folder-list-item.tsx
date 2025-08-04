"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Folder, FolderOpen, FileText, MoreHorizontal, Trash2, Edit, FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TreeItem, TreeItemLabel } from "@/components/ui/tree"
import { useTreeItem } from "@/hooks/use-tree-item"
import type { Folder as FolderType, Note } from "@/types"

interface FolderListItemProps {
  folder: FolderType
  notes: Note[]
  onFolderSelect: (folderId: string) => void
  onFolderDelete: (folderId: string) => void
  onFolderRename: (folderId: string, newName: string) => Promise<boolean>
  onCreateNoteInFolder: (folderId: string) => void
  selectedNote: Note | null
  onNoteSelect: (note: Note) => void
  onNoteDelete: (noteId: string) => void
}

// Componente separado para as notas para evitar problemas com hooks
function FolderNoteItem({ 
  note, 
  selectedNote, 
  onNoteSelect, 
  onNoteDelete 
}: {
  note: Note
  selectedNote: Note | null
  onNoteSelect: (note: Note) => void
  onNoteDelete: (noteId: string) => void
}) {
  const noteItem = useTreeItem({
    id: note.id,
    name: note.title || "Sem Título",
    type: "note",
    level: 1,
    isSelected: selectedNote?.id === note.id,
    data: note,
  })

  return (
    <TreeItem 
      item={noteItem} 
      className="group w-full cursor-pointer" 
      asChild
    >
      <div onClick={() => onNoteSelect(note)}>
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
                  onNoteDelete(note.id)
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

export function FolderListItem({
  folder,
  notes,
  onFolderSelect,
  onFolderDelete,
  onFolderRename,
  onCreateNoteInFolder,
  selectedNote,
  onNoteSelect,
  onNoteDelete,
}: FolderListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)
  const [isRenameInProgress, setIsRenameInProgress] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const folderItem = useTreeItem({
    id: folder.id,
    name: folder.name,
    type: "folder",
    level: 0,
    isExpanded,
    data: folder,
  })

  // Sincronizar o nome quando a pasta mudar
  useEffect(() => {
    setNewName(folder.name)
  }, [folder.name])

  // Focar no input quando entrar em modo de renomeação
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isRenaming])

  const handleStartRename = () => {
    setNewName(folder.name)
    setIsRenaming(true)
  }

  const handleCancelRename = () => {
    setNewName(folder.name)
    setIsRenaming(false)
    setIsRenameInProgress(false)
  }

  const handleConfirmRename = async () => {
    if (isRenameInProgress) return

    const trimmedName = newName.trim()
    
    // Se o nome não mudou ou está vazio, cancela
    if (!trimmedName || trimmedName === folder.name) {
      handleCancelRename()
      return
    }

    try {
      setIsRenameInProgress(true)
      const success = await onFolderRename(folder.id, trimmedName)
      
      if (success) {
        setIsRenaming(false)
        setIsRenameInProgress(false)
      } else {
        // Se falhou, volta ao nome original
        setNewName(folder.name)
        setIsRenameInProgress(false)
      }
    } catch (error) {
      console.error('Erro ao renomear pasta:', error)
      setNewName(folder.name)
      setIsRenameInProgress(false)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation() // Impede que o evento suba para o TreeItem
    
    if (e.key === "Enter") {
      e.preventDefault()
      handleConfirmRename()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancelRename()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value)
  }

  const handleInputBlur = () => {
    // Só confirma se não estiver sendo cancelado pelo ESC
    if (isRenaming) {
      handleConfirmRename()
    }
  }

  const handleFolderClick = () => {
    if (!isRenaming) {
      setIsExpanded(!isExpanded)
      onFolderSelect(folder.id)
    }
  }

  return (
    <div className="w-full">
      <TreeItem 
        item={folderItem} 
        className="group w-full cursor-pointer" 
        asChild
      >
        <div onClick={handleFolderClick}>
          <TreeItemLabel className="flex w-full items-center justify-between pr-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {isExpanded ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}
              
              {isRenaming ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  className="flex-1 bg-transparent border border-border rounded px-1 outline-none text-sm focus:ring-1 focus:ring-ring"
                  disabled={isRenameInProgress}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="truncate text-sm font-medium">{folder.name}</span>
              )}
              
              <span className="text-xs text-muted-foreground">({notes.length})</span>
            </div>

            {!isRenaming && (
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartRename()
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem
                       onClick={(e) => {
                    e.stopPropagation()
                    onCreateNoteInFolder(folder.id)
                  }}
                    >
                      <FilePlus className="h-3 w-3 mr-2" />
                      Criar Nota
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onFolderDelete(folder.id)
                      }}
                      className="text-red-500 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </TreeItemLabel>
        </div>
      </TreeItem>

      {isExpanded && notes.length > 0 && (
        <div className="ml-4 mt-1 space-y-0.5">
          {notes.map((note) => (
            <FolderNoteItem
              key={note.id}
              note={note}
              selectedNote={selectedNote}
              onNoteSelect={onNoteSelect}
              onNoteDelete={onNoteDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}