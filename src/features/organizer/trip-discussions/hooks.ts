import { useQuery } from '@tanstack/react-query';
import { discussionsApi } from './api';
import { useUserStore } from '../../../store/userStore';
import type { TripDiscussion } from './types';

export function useOrganizerDiscussions() {
  const { organizerId } = useUserStore();

  return useQuery({
    queryKey: ['organizer_discussions', organizerId],
    queryFn: async () => {
      const res = await discussionsApi.listTrips({ page: 1 });
      const myTrips = organizerId ? res.trips.filter((t: any) => t.organizer_id === organizerId) : res.trips;
      
      const items: TripDiscussion[] = [];
      for (const trip of myTrips) {
        try {
          const disc = await discussionsApi.getTripDiscussions(trip.trip_id);
          items.push({
            trip_id: trip.trip_id,
            title: trip.title,
            location_name: trip.location?.name,
            discussion_id: disc.discussion_id,
            interested_count: trip.interested_count || 0,
            cover_image: trip.cover_image,
            has_new_activity: disc.has_new_activity ?? false,
          });
        } catch {
          items.push({
            trip_id: trip.trip_id,
            title: trip.title,
            location_name: trip.location?.name,
            discussion_id: undefined,
            interested_count: trip.interested_count || 0,
            cover_image: trip.cover_image,
            has_new_activity: false,
          });
        }
      }
      return items;
    },
    staleTime: 2 * 60 * 1000,
  });
}
