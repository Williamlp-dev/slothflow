import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useNoteStore } from '@/lib/stores/note-store';
import { updateNote } from '@/actions/note-actions';
import type { Note, SaveStatus, NoteContent } from '@/types';

export function useNoteAutoSave(note: Note, content: NoteContent) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedContent, setLastSavedContent] = useState<NoteContent>({
    title: content.title,
    description: content.description
  });
  const { updateNoteInList } = useNoteStore();
  const noteRef = useRef(note);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    noteRef.current = note;
    setLastSavedContent({ title: note.title, description: note.description });
    setSaveStatus('idle');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [note.id]); 

  const saveNote = useCallback(
    async (dataToSave: NoteContent) => {
      if (dataToSave.title === lastSavedContent.title && dataToSave.description === lastSavedContent.description) {
        return;
      }

      setSaveStatus('saving');

      const formData = new FormData();
      formData.append('id', noteRef.current.id);
      formData.append('title', dataToSave.title || 'Sem Título');
      formData.append('description', dataToSave.description);

      const result = await updateNote(formData);

      if (result.success && result.data) {
        updateNoteInList(result.data);
        setLastSavedContent(dataToSave);
        setSaveStatus('saved');
        timeoutRef.current = setTimeout(() => setSaveStatus('idle'), 1500);
      } else {
        const errorMessage = !result.success ? result.error : 'Erro desconhecido';
        console.error('Falha ao salvar a nota:', errorMessage);
        setSaveStatus('idle');
      }
    },
    [lastSavedContent, updateNoteInList]
  );

  const debouncedSave = useRef(
    debounce(saveNote, 600, { leading: false, trailing: true })
  ).current;

  useEffect(() => {
    const hasChanged = content.title !== lastSavedContent.title || content.description !== lastSavedContent.description;
   
    if (hasChanged) {
      setSaveStatus('saving');
      debouncedSave(content);
    }

    return () => debouncedSave.cancel();
  }, [content, debouncedSave, lastSavedContent]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { saveStatus };
}