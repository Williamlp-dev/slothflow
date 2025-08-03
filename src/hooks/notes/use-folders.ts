import { useState, useEffect } from 'react';
import { getFolders, createFolder, deleteFolder, updateFolder } from '@/actions/folder-actions';
import { useNoteStore } from '@/lib/stores/note-store';

export type Folder = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedFolderId, setSelectedFolderId } = useNoteStore();

  useEffect(() => {
    async function loadFolders() {
      try {
        setLoading(true);
        const fetchedFolders = await getFolders();
        setFolders(fetchedFolders);
      } catch (error) {
        console.error('Erro ao carregar pastas:', error);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    }
    loadFolders();
  }, []);

  const handleCreateFolder = async (name: string) => {
    const formData = new FormData();
    formData.append('name', name);

    const result = await createFolder(formData);
    if (result.success && result.data) {
      setFolders((prev) => [...prev, result.data].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      alert(`Não foi possível criar a pasta: ${result.error}`);
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    const formData = new FormData();
    formData.append('id', folderId);
    formData.append('name', newName);

    const result = await updateFolder(formData);
    if (result.success && result.data) {
      setFolders((prev) => 
        prev.map(folder => 
          folder.id === folderId ? result.data : folder
        ).sort((a, b) => a.name.localeCompare(b.name))
      );
      return true;
    } else {
      alert(`Erro ao renomear pasta: ${result.error}`);
      return false;
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pasta? As notas dentro dela não serão excluídas.')) return;
    
    const result = await deleteFolder(folderId);
    if (result.success) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      if (selectedFolderId === folderId) {
        setSelectedFolderId('unfiled');
      }
    } else {
      alert(`Erro ao deletar pasta: ${result.error}`);
    }
  };

  return {
    folders,
    loading,
    selectedFolderId,
    handleSelectFolder: setSelectedFolderId,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
  };
}