import { useQuery } from '@tanstack/react-query';
import { tripsDashboardApi } from './api';
import { useUserStore } from '../../../store/userStore';

export function useMyOrganizerTrips() {
  const organizerId = useUserStore((s) => s.organizerId);

  return useQuery({
    queryKey: ['my_organizer_trips', organizerId],
    queryFn: () => tripsDashboardApi.getOrganizerTrips(organizerId ?? ''),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!organizerId,
  });
}
