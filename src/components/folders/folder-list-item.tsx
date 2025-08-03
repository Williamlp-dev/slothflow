import { useState, useRef, useEffect } from 'react';
import { Folder, MoreHorizontal, Plus, ChevronDown, ChevronRight, FileText, Trash2, Edit, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Folder as FolderType, Note } from '@/types';

interface FolderListItemProps {
  folder: FolderType;
  notesInFolder: Note[];
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  onDelete: (folderId: string) => void;
  onRename: (folderId: string, newName: string) => Promise<boolean>;
  onCreateNoteInFolder: (folderId: string) => void;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

export function FolderListItem({
  folder,
  notesInFolder,
  isSelected,
  onSelect,
  onDelete,
  onRename,
  onCreateNoteInFolder,
  selectedNote,
  onNoteSelect,
  onNoteDelete
}: FolderListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editingName, setEditingName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStartRename = () => {
    setEditingName(folder.name);
    setIsRenaming(true);
  };

  const handleCancelRename = () => {
    setEditingName(folder.name);
    setIsRenaming(false);
  };

  const handleConfirmRename = async () => {
    const trimmedName = editingName.trim();
    
    if (!trimmedName) {
      alert('O nome da pasta não pode estar vazio');
      return;
    }

    if (trimmedName === folder.name) {
      setIsRenaming(false);
      return;
    }

    const success = await onRename(folder.id, trimmedName);
    if (success) {
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  return (
    <SidebarMenuItem className="flex flex-col items-start">
      <div className="group flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <button
            onClick={toggleExpanded}
            className="flex items-center justify-center p-1 hover:bg-accent/50 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
          
          {isRenaming ? (
            <div className="flex-1 ml-1">
              <Input
                ref={inputRef}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleConfirmRename}
                className="h-8 text-sm"
                maxLength={50}
              />
            </div>
          ) : (
            <SidebarMenuButton
              asChild
              className={cn('flex-1 cursor-pointer justify-start ml-1', isSelected && 'bg-accent')}
            >
              <button onClick={() => onSelect(folder.id)} className="flex items-center gap-2">
                <Folder className="size-4" />
                <span className="truncate">{folder.name}</span>
              </button>
            </SidebarMenuButton>
          )}
        </div>

        {!isRenaming && (
          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStartRename}>
                  <Edit className="mr-2 h-4 w-4" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onCreateNoteInFolder(folder.id)}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Criar Nota
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(folder.id)}
                  className="text-red-500 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {isExpanded && notesInFolder.length > 0 && (
        <div className="ml-4 mt-1 w-full space-y-1">
          {notesInFolder.map((note) => (
            <div
              key={note.id}
              className="group flex w-full items-center justify-between rounded-md hover:bg-accent/50"
            >
              <button
                onClick={() => onNoteSelect(note)}
                className={cn(
                  'flex flex-1 items-center gap-2 rounded-md p-2 text-left text-sm transition-colors',
                  selectedNote?.id === note.id && 'bg-accent'
                )}
              >
                <FileText className="h-3 w-3" />
                <span className="truncate">{note.title || 'Sem Título'}</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onNoteDelete(note.id)}
                    className="text-red-500 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}