import { useQuery } from '@tanstack/react-query';
import { organizersApi } from './api';

export function useOrganizers(searchQuery?: string) {
  return useQuery({
    queryKey: ['organizers', searchQuery],
    queryFn: () => organizersApi.listOrganizers({ search: searchQuery || undefined }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
