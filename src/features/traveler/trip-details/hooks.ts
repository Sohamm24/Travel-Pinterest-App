import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripDetailsApi } from './api';

export function useTripDetails(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripDetailsApi.getTrip(tripId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!tripId,
  });
}

export function useToggleInterest(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isInterested: boolean) =>
      isInterested
        ? tripDetailsApi.removeInterest(tripId)
        : tripDetailsApi.markInterested(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

export function useItinerary(tripId: string) {
  return useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => tripDetailsApi.getItinerary(tripId),
    staleTime: 5 * 60 * 1000,
    enabled: !!tripId,
  });
}
