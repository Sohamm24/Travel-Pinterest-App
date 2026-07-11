/**
 * features/organizer/trips-dashboard/api.ts
 *
 * API calls for the organizer's trip management dashboard.
 */

import { client } from '../../../utils/apiClient';
import type { OrganizerTrip } from './types';

export const tripsDashboardApi = {
  getOrganizerTrips: async (organizerId: string): Promise<OrganizerTrip[]> => {
    const { data } = await client.get(`/api/v1/organizers/${organizerId}/trips`);
    return data.trips;
  },

  createEmptyDraft: () =>
    client.post('/api/v1/trips/draft').then((r) => r.data),
};
