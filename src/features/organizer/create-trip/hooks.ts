import { useMutation, useQuery } from '@tanstack/react-query';
import { tripApi } from './api';
import type {
  Step1Payload,
  ItineraryStepPayload,
  InclusionsStepPayload,
  PricingStepPayload,
  AudienceStepPayload,
  DescriptionStepPayload,
  TripDraftResponse,
} from './types';

// ─── Draft creation ────────────────────────────────────────────────────────

export const useCreateTripDraft = () =>
  useMutation<TripDraftResponse, any, void>({
    mutationFn: () => tripApi.createDraft(),
  });

// ─── Step mutations ────────────────────────────────────────────────────────

export const useUpdateBasicInfo = () =>
  useMutation<TripDraftResponse, any, { tripId: string; payload: Step1Payload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateBasicInfo(tripId, payload),
  });

export const useUpdateItinerary = () =>
  useMutation<TripDraftResponse, any, { tripId: string; payload: ItineraryStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateItinerary(tripId, payload),
  });

export const useUpdateInclusions = () =>
  useMutation<TripDraftResponse, any, { tripId: string; payload: InclusionsStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateInclusions(tripId, payload),
  });

export const useUpdatePricing = () =>
  useMutation<TripDraftResponse, any, { tripId: string; payload: PricingStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updatePricing(tripId, payload),
  });

export const useUpdateAudience = () =>
  useMutation<TripDraftResponse, any, { tripId: string; payload: AudienceStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateAudience(tripId, payload),
  });

export const useUpdateDescription = () =>
  useMutation<TripDraftResponse, any, { tripId: string; payload: DescriptionStepPayload }>({
    mutationFn: ({ tripId, payload }) => tripApi.updateDescription(tripId, payload),
  });

export const usePublishTrip = () =>
  useMutation<TripDraftResponse, any, { tripId: string }>({
    mutationFn: ({ tripId }) => tripApi.publish(tripId),
  });

// ─── Queries ───────────────────────────────────────────────────────────────

export const useGetTrip = (
  tripId?: string | null,
  enabled = true
) => {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.get(tripId!),
    enabled: !!tripId && enabled,
  });
};

export function useMyDraftTrips() {
  return useQuery<TripDraftResponse[]>({
    queryKey: ['trips', 'draft'],
    queryFn: () => tripApi.getDrafts(),
  });
}