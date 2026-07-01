import { api } from '../../../services/api';

export const tripDetailsApi = {
  getTrip: (tripId: string) => api.getTrip(tripId),
  markInterested: (tripId: string) => api.markInterested(tripId),
  removeInterest: (tripId: string) => api.removeInterest(tripId),
  getItinerary: (tripId: string) => api.getItinerary(tripId),
};
