import { useState, useEffect } from 'react';
import { useNoteStore, Note } from '@/lib/stores/note-store';
import { useNoteAutoSave } from '@/hooks/notes/use-note-autosave';

interface NoteFormProps {
  note: Note;
}

function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status !== 'saving') return null;

  return (
    <div className="fixed bottom-4 right-4 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
      Salvando...
    </div>
  );
}

export function NoteForm({ note }: NoteFormProps) {
  const [content, setContent] = useState({
    title: note.title,
    description: note.description,
  });
  
  const { saveStatus } = useNoteAutoSave(note, content);
  const { updateNoteInList } = useNoteStore();

  useEffect(() => {
    setContent({ title: note.title, description: note.description });
  }, [note.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
    if (name === 'title') {
      updateNoteInList({ ...note, title: value || 'Sem Título' });
    }
  };

  return (
    <div className="min-h-screen bg-[#191919] text-white">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <input
          name="title"
          value={content.title}
          onChange={handleInputChange}
          placeholder="Sem título"
          className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder:text-gray-500 mb-4 py-2"
          autoFocus
        />
        <textarea
          name="description"
          value={content.description}
          onChange={handleInputChange}
          placeholder="Digite aqui..."
          className="w-full min-h-[600px] bg-transparent border-none outline-none placeholder:text-gray-500 text-lg leading-relaxed resize-none py-2"
        />
        <SaveIndicator status={saveStatus} />
      </div>
    </div>
  );
}