/**
 * features/organizer/create-trip/api.ts
 *
 * All API calls for the multi-step trip creation flow,
 * including media upload, presigning, and draft management.
 */

import { client } from '../../../utils/apiClient';
import type {
  Step1Payload,
  ItineraryStepPayload,
  InclusionsStepPayload,
  PricingStepPayload,
  AudienceStepPayload,
  DescriptionStepPayload,
  TripDraftResponse,
} from './types';

export const tripApi = {
  // ── Draft creation ────────────────────────────────────────────────────────

  createDraft: (): Promise<TripDraftResponse> =>
    client.post('/api/v1/trips/draft').then((r) => r.data),

  // ── Step updates ──────────────────────────────────────────────────────────

  updateBasicInfo: (tripId: string, data: Step1Payload): Promise<TripDraftResponse> =>
    client.patch(`/api/v1/trips/${tripId}/step1`, data).then((r) => r.data),

  updateItinerary: (tripId: string, data: ItineraryStepPayload): Promise<TripDraftResponse> =>
    client.patch(`/api/v1/trips/${tripId}/step2`, data).then((r) => r.data),

  updateInclusions: (tripId: string, data: InclusionsStepPayload): Promise<TripDraftResponse> =>
    client.patch(`/api/v1/trips/${tripId}/step3`, data).then((r) => r.data),

  updatePricing: (tripId: string, data: PricingStepPayload): Promise<TripDraftResponse> =>
    client.patch(`/api/v1/trips/${tripId}/step4`, data).then((r) => r.data),

  updateAudience: (tripId: string, data: AudienceStepPayload): Promise<TripDraftResponse> =>
    client.patch(`/api/v1/trips/${tripId}/step5`, data).then((r) => r.data),

  updateDescription: (tripId: string, data: DescriptionStepPayload): Promise<TripDraftResponse> =>
    client.patch(`/api/v1/trips/${tripId}/step6`, data).then((r) => r.data),

  // ── Publish ───────────────────────────────────────────────────────────────

  publish: (tripId: string): Promise<TripDraftResponse> =>
    client.post(`/api/v1/trips/${tripId}/publish`, {}).then((r) => r.data),

  // ── Fetch ─────────────────────────────────────────────────────────────────

  get: (tripId: string): Promise<TripDraftResponse> =>
    client.get(`/api/v1/trips/${tripId}`).then((r) => r.data),

  getDrafts: (): Promise<TripDraftResponse[]> =>
    client.get('/api/v1/trips', { params: { trip_status: 'draft' } }).then((r) => r.data),

  // ── Media upload ──────────────────────────────────────────────────────────

  presign: (data: {
    trip_id: string;
    media_context: 'thumbnail' | 'itinerary';
    mime_type: 'image/jpeg' | 'image/png' | 'image/webp';
    itinerary_slot?: string | null;
  }): Promise<{ presigned_url: string; file_path: string }> =>
    client.post('/api/v1/upload/presign', data).then((r) => r.data),

  confirmUpload: (data: {
    trip_id: string;
    file_path: string;
    media_context: 'thumbnail' | 'itinerary';
    itinerary_slot?: string | null;
  }): Promise<{ public_url: string }> =>
    client.post('/api/v1/upload/confirm', data).then((r) => r.data.data),
};