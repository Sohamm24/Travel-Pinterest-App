/**
 * features/traveler/home/api.ts
 *
 * API calls for the traveler home/landing feed.
 */

import { client } from '../../../utils/apiClient';
import type { TripListResponse } from './types';

export const homeApi = {
  listTrips: (params?: any): Promise<TripListResponse> =>
    client.get('/api/v1/trips/', { params }).then((r) => r.data),

  searchTrips: (q: string): Promise<any[]> =>
    client.get('/api/v1/search/trips', { params: { q } }).then((r) => r.data.data),
};
