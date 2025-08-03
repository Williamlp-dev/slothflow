import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNoteStore, Note } from '@/lib/stores/note-store';
import { getNotes, deleteNote, createNote } from '@/actions/note-actions';

export function useNotes() {
  const [loading, setLoading] = useState(true);
  const {
    notes,
    setNotes,
    addNote,
    removeNoteFromList,
    selectedNote,
    setSelectedNote,
    selectedFolderId,
  } = useNoteStore();

  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [setNotes]);

  const filteredNotes = useMemo(() => {
    if (selectedFolderId === 'unfiled') {
      return notes.filter(note => !note.folderId);
    }
    // Retornamos todas as notas para que o componente da pasta possa filtrar por si mesmo
    return notes;
  }, [notes, selectedFolderId]);

  const unfiledNotes = useMemo(() => {
    return notes.filter(note => !note.folderId);
  }, [notes]);

  const handleCreateNote = useCallback(async (folderId?: string | null) => {
    const formData = new FormData();
    formData.append('title', 'Nova Nota');
    formData.append('description', '');
    
    // Usa o folderId passado como argumento, ou o selecionado globalmente, ou nenhum.
    const targetFolderId = folderId !== undefined ? folderId : selectedFolderId;

    if (targetFolderId && targetFolderId !== 'unfiled') {
      formData.append('folderId', targetFolderId);
    }

    const result = await createNote(formData);
    if (result.success && result.data) {
      addNote(result.data);
      setSelectedNote(result.data);
    } else {
      alert('Não foi possível criar a nota.');
    }
  }, [selectedFolderId, addNote, setSelectedNote]);

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) return;

    const result = await deleteNote(noteId);
    if (result.success) {
      removeNoteFromList(noteId);
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } else {
      alert(`Erro ao deletar nota: ${result.error}`);
    }
  };

  return {
    allNotes: notes, // expõe todas as notas
    unfiledNotes, // expõe apenas as notas sem pasta
    loading,
    selectedNote,
    handleSelectNote: setSelectedNote,
    handleCreateNote,
    handleDeleteNote,
  };
}