import { FileText, MoreHorizontal, Trash2 } from 'lucide-react';
import { Note } from '@/lib/stores/note-store';
import { cn } from '@/lib/utils';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  return (
    <SidebarMenuItem>
      <div className="group flex w-full items-center justify-between">
        <SidebarMenuButton
          asChild
          className={cn('flex-1 cursor-pointer justify-start', isSelected && 'bg-accent')}
        >
          <button onClick={() => onSelect(note)}>
            <FileText className="size-4" />
            <span className="truncate">{note.title || 'Sem Título'}</span>
          </button>
        </SidebarMenuButton>

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
              onClick={() => onDelete(note.id)}
              className="text-red-500 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuItem>
  );
}