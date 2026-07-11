import { useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from './api';
import { useUserStore } from '../../../store/userStore';

export function useProfile() {
  const setProfile = useUserStore((s) => s.setProfile);

  return useQuery({
    queryKey: ['my_profile'],
    queryFn: async () => {
      const user = await profileApi.getMe();
      setProfile(user);
      return user;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useTripHistory() {
  return useQuery({
    queryKey: ['my_trip_history'],
    queryFn: async () => {
      const [upcoming, past] = await Promise.allSettled([
        profileApi.getUpcomingTrips(),
        profileApi.getPastTrips(),
      ]);
      return {
        upcoming: upcoming.status === 'fulfilled' ? upcoming.value : [],
        past: past.status === 'fulfilled' ? past.value : [],
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

const DUMMY_SAVED_TRIPS = [
  { trip_id: 'd1', title: 'Manali Winter Trek', location: { name: 'Manali, HP' }, budget: 12000, start_date: '2025-12-10', end_date: '2025-12-17', cover_image: undefined, interested_count: 34 },
  { trip_id: 'd2', title: 'Goa Beach Escape', location: { name: 'Goa, India' }, budget: 8500, start_date: '2026-01-05', end_date: '2026-01-10', cover_image: undefined, interested_count: 89 },
];

export function useSavedTrips() {
  return useQuery({
    queryKey: ['saved_trips'],
    queryFn: async () => {
      return DUMMY_SAVED_TRIPS;
    },
    staleTime: 10 * 60 * 1000,
  });
}
