import { useMutation, useQuery } from '@tanstack/react-query';
import { draftTripApi } from './api';
import type {
  Step1Payload,
  ItineraryStepPayload,
  InclusionsStepPayload,
  PricingStepPayload,
  AudienceStepPayload,
  DescriptionStepPayload,
  TripResponse,
} from './types';

export function useCreateDraftTrip() {
  return useMutation<TripResponse, any, Step1Payload>({
    mutationFn: async (payload) => {
      const data = await draftTripApi.draftTrip(payload);
      return data;
    },
  });
}

function useStepPatch<T>(stepPath: string) {
  return useMutation<TripResponse, any, { tripId: string; payload: T }>({
    mutationFn: async ({ tripId, payload }) => {
      const { data } = await api.patch(`/trips/${tripId}/${stepPath}`, payload);
      return data;
    },
  });
}

export const useUpdateBasicInfo = () => useStepPatch<Step1Payload>('step1');
export const useUpdateItinerary = () => useStepPatch<ItineraryStepPayload>('step2');
export const useUpdateInclusions = () => useStepPatch<InclusionsStepPayload>('step3');
export const useUpdatePricing = () => useStepPatch<PricingStepPayload>('step4');
export const useUpdateAudience = () => useStepPatch<AudienceStepPayload>('step5');
export const useUpdateDescription = () => useStepPatch<DescriptionStepPayload>('step6');

export function usePublishTrip() {
  return useMutation<TripResponse, any, { tripId: string }>({
    mutationFn: async ({ tripId }) => {
      const { data } = await api.post(`/trips/${tripId}/publish`, {});
      return data;
    },
  });
}

export function useGetTrip(tripId: string | null) {
  return useQuery<TripResponse>({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}`);
      return data;
    },
    enabled: !!tripId,
  });
}

export function useMyDraftTrips() {
  return useQuery<TripResponse[]>({
    queryKey: ['trips', 'draft'],
    queryFn: async () => {
      const { data } = await api.get('/trips/', { params: { trip_status: 'draft' } });
      return data;
    },
  });
}