import { create } from 'zustand'

export type Note = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  folderId: string | null // Adicionado para consistência
}

interface NoteStore {
  notes: Note[]
  selectedNote: Note | null
  selectedFolderId: string | null // Novo estado: ID da pasta selecionada
  
  // Ações básicas
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNoteInList: (updatedNote: Note) => void
  removeNoteFromList: (noteId: string) => void
  setSelectedNote: (note: Note | null) => void
  setSelectedFolderId: (folderId: string | null) => void // Nova ação
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  selectedNote: null,
  selectedFolderId: 'unfiled', // 'unfiled' para notas sem pasta

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

  setSelectedFolderId: (folderId) => set({ selectedFolderId: folderId, selectedNote: null }), // Reseta a nota selecionada ao mudar de pasta
}))