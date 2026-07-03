import { api } from '../../../services/api';

import type {
  Step1Payload,
  ItineraryStepPayload,
  InclusionsStepPayload,
  PricingStepPayload,
  AudienceStepPayload,
  DescriptionStepPayload,
} from './types';

export const tripApi = {

  updateBasicInfo: (
    tripId: string,
    data: Step1Payload
  ) =>
    api.updateTripStep1(
      tripId,
      data
    ),

  updateItinerary: (
    tripId: string,
    data: ItineraryStepPayload
  ) =>
    api.updateTripStep2(
      tripId,
      data
    ),

  updateInclusions: (
    tripId: string,
    data: InclusionsStepPayload
  ) =>
    api.updateTripStep3(
      tripId,
      data
    ),

  updatePricing: (
    tripId: string,
    data: PricingStepPayload
  ) =>
    api.updateTripStep4(
      tripId,
      data
    ),

  updateAudience: (
    tripId: string,
    data: AudienceStepPayload
  ) =>
    api.updateTripStep5(
      tripId,
      data
    ),

  updateDescription: (
    tripId: string,
    data: DescriptionStepPayload
  ) =>
    api.updateTripStep6(
      tripId,
      data
    ),

  publish: (tripId: string) =>
    api.publishTrip(tripId),

  get: (tripId: string) =>
    api.getTrip(tripId),

  getDrafts: () =>
    api.getMyDraftTrips(),

  presign: (data: {
    trip_id: string;
    media_context: 'thumbnail' | 'itinerary';
    mime_type: 'image/jpeg' | 'image/png' | 'image/webp';
    itinerary_slot?: string | null;
  }) =>
    api.getPresignedUrl(data),

  confirmUpload: (data: {
    trip_id: string;
    file_path: string;
    media_context: 'thumbnail' | 'itinerary';
    itinerary_slot?: string | null;
  }) =>
    api.confirmMediaUpload(data),
};