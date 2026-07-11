import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  profile: any | null;
  isOrganizer: boolean;
  organizerId: string | null;
  isOrganizerMode: boolean;
  isLoading: boolean;
  setProfile: (profile: any) => void;
  setOrganizerId: (id: string) => void;
  setOrganizerMode: (mode: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isOrganizer: false,
      organizerId: null,
      isOrganizerMode: false,
      isLoading: false,

      setProfile: (profile) =>
       set({
           profile,
           isOrganizer: profile?.is_organizer ?? false,
           organizerId: profile?.organizer_id ?? null,
       }),

      setOrganizerId: (id) => set({ organizerId: id, isOrganizer: true }),

      setOrganizerMode: (mode) => set({ isOrganizerMode: mode }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearUser: () => set({
        profile: null,
        isOrganizer: false,
        organizerId: null,
        isOrganizerMode: false,
        isLoading: false,
      }),
    }),
    {
      name: 'travel_user_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        isOrganizer: state.isOrganizer,
        organizerId: state.organizerId,
        isOrganizerMode: state.isOrganizerMode,
      }),
    }
  )
);
