import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  profile: any | null;
  isOrganizer: boolean;
  organizerId: string | null;
  isOrganizerMode: boolean;
  upcomingTrips: any[];
  pastTrips: any[];
  interestedTrips: any[];
  isLoading: boolean;
  setProfile: (profile: any) => void;
  setOrganizerId: (id: string) => void;
  setOrganizerMode: (mode: boolean) => void;
  setTrips: (upcoming: any[], past: any[], interested: any[]) => void;
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
      upcomingTrips: [],
      pastTrips: [],
      interestedTrips: [],
      isLoading: false,

      setProfile: (profile) => set({
        profile,
        isOrganizer: profile?.is_organizer || false,
      }),

      setOrganizerId: (id) => set({ organizerId: id, isOrganizer: true }),

      setOrganizerMode: (mode) => set({ isOrganizerMode: mode }),

      setTrips: (upcoming, past, interested) => set({
        upcomingTrips: upcoming,
        pastTrips: past,
        interestedTrips: interested,
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearUser: () => set({
        profile: null,
        isOrganizer: false,
        organizerId: null,
        isOrganizerMode: false,
        upcomingTrips: [],
        pastTrips: [],
        interestedTrips: [],
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
