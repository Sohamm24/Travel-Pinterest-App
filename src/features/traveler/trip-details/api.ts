/**
 * features/traveler/trip-details/api.ts
 *
 * API calls for viewing and interacting with a single trip.
 */

import { client } from '../../../utils/apiClient';

export const tripDetailsApi = {
  getTrip: (tripId: string) =>
    client.get(`/api/v1/trips/${tripId}`).then((r) => r.data),

  markInterested: (tripId: string) =>
    client.post(`/api/v1/trips/${tripId}/interested`).then((r) => r.data),

  removeInterest: (tripId: string) =>
    client.delete(`/api/v1/trips/${tripId}/interested`).then((r) => r.data),

  getItinerary: (tripId: string) =>
    client.get(`/api/v1/trips/${tripId}/itinerary`).then((r) => r.data),
};
