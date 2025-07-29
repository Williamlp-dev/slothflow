'use client';
import { useNoteStore } from '@/lib/stores/note-store';
import { NoteForm } from './note-form';

function InitialScreen() {
  return (
    <div className="min-h-screen bg-[#191919] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">
          Selecione ou crie uma nota
        </h1>
        <p className="text-gray-500 text-lg">
          Use o painel à esquerda para começar.
        </p>
      </div>
    </div>
  );
}

export function NoteViewer() {
  const { selectedNote } = useNoteStore();

  if (!selectedNote) {
    return <InitialScreen />;
  }

  return <NoteForm note={selectedNote} />;
}