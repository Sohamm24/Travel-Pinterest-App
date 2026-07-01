import { api } from '../../../services/api';
import type { TripListResponse } from './types';

export const homeApi = {
  listTrips: (params?: any): Promise<TripListResponse> => api.listTrips(params),
  searchTrips: (q: string) => api.searchTrips(q),
};
