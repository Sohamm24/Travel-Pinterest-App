import { useMutation, useQuery } from '@tanstack/react-query';
import { tripApi } from './api';
import type {
  Step1Payload,
  ItineraryStepPayload,
  InclusionsStepPayload,
  PricingStepPayload,
  AudienceStepPayload,
  DescriptionStepPayload,
  TripResponse,
} from './types';


export const useUpdateBasicInfo = () =>
  useMutation<TripResponse, any, { tripId: string; payload: Step1Payload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateBasicInfo(tripId, payload),
  });

export const useUpdateItinerary = () =>
  useMutation<TripResponse, any, { tripId: string; payload: ItineraryStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateItinerary(tripId, payload),
  });

export const useUpdateInclusions = () =>
  useMutation<TripResponse, any, { tripId: string; payload: InclusionsStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateInclusions(tripId, payload),
  });

export const useUpdatePricing = () =>
  useMutation<TripResponse, any, { tripId: string; payload: PricingStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updatePricing(tripId, payload),
  });

export const useUpdateAudience = () =>
  useMutation<TripResponse, any, { tripId: string; payload: AudienceStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateAudience(tripId, payload),
  });

export const useUpdateDescription = () =>
  useMutation<TripResponse, any, { tripId: string; payload: DescriptionStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateDescription(tripId, payload),
  });

export function usePublishTrip() {
  return useMutation<TripResponse, any, { tripId: string }>({
    mutationFn: ({ tripId }) => tripApi.publish(tripId),
  });
}

export function useGetTrip(tripId: string | null) {
  return useQuery<TripResponse>({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.get(tripId!),
    enabled: !!tripId,
  });
}

export function useMyDraftTrips() {
  return useQuery<TripResponse[]>({
    queryKey: ['trips', 'draft'],
    queryFn: () => tripApi.getDrafts(),
  });
}