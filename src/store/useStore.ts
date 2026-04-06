import { create } from 'zustand';
import type { TourismPhoto, User, TourismTypeFilter } from '../types';

interface AppStore {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Feed
  photos: TourismPhoto[];
  setPhotos: (photos: TourismPhoto[]) => void;
  appendPhotos: (photos: TourismPhoto[]) => void;

  // Saved
  savedPhotoIds: Set<number>;
  toggleSaved: (id: number) => void;
  setSavedIds: (ids: number[]) => void;

  // Filter
  selectedType: TourismTypeFilter;
  setSelectedType: (type: TourismTypeFilter) => void;

  // UI
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  error: string | null;
  setError: (e: string | null) => void;
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  photos: [],
  setPhotos: (photos) => set({ photos }),
  appendPhotos: (newPhotos) =>
    set((state) => ({ photos: [...state.photos, ...newPhotos] })),

  savedPhotoIds: new Set(),
  toggleSaved: (id) =>
    set((state) => {
      const next = new Set(state.savedPhotoIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { savedPhotoIds: next };
    }),
  setSavedIds: (ids) => set({ savedPhotoIds: new Set(ids) }),

  selectedType: 'all',
  setSelectedType: (type) => set({ selectedType: type }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),
}));
