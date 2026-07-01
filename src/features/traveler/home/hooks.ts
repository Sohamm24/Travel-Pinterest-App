import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { homeApi } from './api';
import type { TripResponse } from './types';

export function useTrips(searchQuery?: string) {
  const query = useInfiniteQuery({
    queryKey: ['trips', searchQuery || ''],
    queryFn: ({ pageParam = 1 }) => {
      const params: any = { page: pageParam };
      if (searchQuery?.trim()) params.search = searchQuery.trim();
      return homeApi.listTrips(params);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.trips.length === 0) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    loadMore,
    refresh: query.refetch,
  };
}
