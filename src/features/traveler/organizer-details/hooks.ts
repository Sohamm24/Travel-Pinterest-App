import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { organizerDetailsApi } from './api';
import type { TripResponse } from './types';

export function useOrganizerDetails(organizerId: string) {
  return useQuery({
    queryKey: ['organizer', organizerId],
    queryFn: () => organizerDetailsApi.getOrganizer(organizerId),
    staleTime: 5 * 60 * 1000,
    enabled: !!organizerId,
  });
}

export function useOrganizerTrips(organizerId: string) {
  const query = useInfiniteQuery({
    queryKey: ['organizer_trips', organizerId],
    queryFn: ({ pageParam = 1 }) => organizerDetailsApi.getOrganizerTrips(organizerId, { page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.trips.length === 0) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!organizerId,
  });

  const trips = useMemo<TripResponse[]>(() => {
    if (!query.data) return [];
    const seen = new Set<string>();
    const result: TripResponse[] = [];
    for (const page of query.data.pages) {
      for (const trip of page.trips) {
        if (!seen.has(trip.trip_id)) {
          seen.add(trip.trip_id);
          result.push(trip);
        }
      }
    }
    return result;
  }, [query.data]);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  return {
    trips,
    isLoading: query.isLoading,
    isFetchingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    loadMore,
  };
}
