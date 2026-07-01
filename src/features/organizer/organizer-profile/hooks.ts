import { useQuery } from '@tanstack/react-query';
import { organizerProfileApi } from './api';
import { useUserStore } from '../../../store/userStore';

export function useMyOrganizerProfile() {
  const { organizerId } = useUserStore();
  
  return useQuery({
    queryKey: ['my_organizer_profile', organizerId],
    queryFn: () => organizerProfileApi.getOrganizer(organizerId as string),
    enabled: !!organizerId,
    staleTime: 5 * 60 * 1000,
  });
}
