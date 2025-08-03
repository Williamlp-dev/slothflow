import { create } from 'zustand'
import type { Note } from '@/types'

interface NoteStore {
  notes: Note[]
  selectedNote: Note | null
  selectedFolderId: string | null
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNoteInList: (updatedNote: Note) => void
  removeNoteFromList: (noteId: string) => void
  setSelectedNote: (note: Note | null) => void
  setSelectedFolderId: (folderId: string | null) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  selectedNote: null,
  selectedFolderId: 'unfiled',

  setNotes: (notes) => set({ notes }),
  
  addNote: (note) => set((state) => ({ 
    notes: [note, ...state.notes] 
  })),
  
  updateNoteInList: (updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      ),
    })),
  
  removeNoteFromList: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== noteId),
    })),
  
  setSelectedNote: (note) => set({ selectedNote: note }),

  setSelectedFolderId: (folderId) => set({ 
    selectedFolderId: folderId, 
    selectedNote: null 
  }),
}))