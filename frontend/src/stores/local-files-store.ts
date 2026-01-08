import { create } from "zustand";

interface LocalFilesState {
  pendingFiles: Map<string, File[]>; // taskId -> files
  setPendingFiles: (taskId: string, files: File[]) => void;
  getPendingFiles: (taskId: string) => File[] | undefined;
  clearPendingFiles: (taskId: string) => void;
}

export const useLocalFilesStore = create<LocalFilesState>((set, get) => ({
  pendingFiles: new Map(),
  
  setPendingFiles: (taskId: string, files: File[]) => {
    set((state) => {
      const newPendingFiles = new Map(state.pendingFiles);
      newPendingFiles.set(taskId, files);
      return { pendingFiles: newPendingFiles };
    });
  },
  
  getPendingFiles: (taskId: string) => {
    return get().pendingFiles.get(taskId);
  },
  
  clearPendingFiles: (taskId: string) => {
    set((state) => {
      const newPendingFiles = new Map(state.pendingFiles);
      newPendingFiles.delete(taskId);
      return { pendingFiles: newPendingFiles };
    });
  },
}));