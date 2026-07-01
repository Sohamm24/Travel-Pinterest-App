import { api } from '../../../services/api';

export const discussionsApi = {
  listTrips: (params?: any) => api.listTrips(params),
  getTripDiscussions: (tripId: string) => api.getTripDiscussions(tripId),
};
