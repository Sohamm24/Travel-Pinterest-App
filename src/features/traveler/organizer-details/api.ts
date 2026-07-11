/**
 * features/traveler/organizer-details/api.ts
 *
 * API calls for the organizer detail page.
 */

import { client } from '../../../utils/apiClient';

export const organizerDetailsApi = {
  getOrganizer: (id: string) =>
    client.get(`/api/v1/organizers/${id}`).then((r) => r.data),

  getOrganizerTrips: (id: string, params?: any) =>
    client.get('/api/v1/trips/', { params: { organizer_id: id, ...params } }).then((r) => r.data),
};
