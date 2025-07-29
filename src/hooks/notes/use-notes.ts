import { useState, useEffect } from 'react';
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

  const handleCreateNote = async () => {
    const formData = new FormData();
    formData.append('title', 'Nova Nota');
    formData.append('description', '');

    const result = await createNote(formData);
    if (result.success && result.data) {
      addNote(result.data);
      setSelectedNote(result.data);
    } else {
      alert('Não foi possível criar a nota.');
    }
  };

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
    notes,
    loading,
    selectedNote,
    handleSelectNote: setSelectedNote,
    handleCreateNote,
    handleDeleteNote,
  };
}