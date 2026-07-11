import { useQuery, useMutation } from '@tanstack/react-query';
import { confirmTripApi, CreateHoldPayload } from './api';

export function useConfirmationData(tripId: string) {
  return useQuery({
    queryKey: ['trip-confirmation-data', tripId],
    queryFn: () => confirmTripApi.getConfirmationData(tripId),
    staleTime: 0, // Always load fresh price/availability
    enabled: !!tripId,
  });
}

export function useCreateHold() {
  return useMutation({
    mutationFn: (payload: CreateHoldPayload) => confirmTripApi.createHold(payload),
  });
}
