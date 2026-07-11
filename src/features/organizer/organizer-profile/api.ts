/**
 * features/organizer/organizer-profile/api.ts
 *
 * API calls for the organizer's own profile management.
 */

import { client } from '../../../utils/apiClient';

export const organizerProfileApi = {
  getOrganizer: (id: string) =>
    client.get(`/api/v1/organizers/${id}`).then((r) => r.data),

  updateOrganizer: (id: string, payload: { bio?: string; region?: string; profile_pic?: string }) =>
    client.patch(`/api/v1/organizers/${id}`, payload).then((r) => r.data),
};
