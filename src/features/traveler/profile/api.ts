/**
 * features/traveler/profile/api.ts
 *
 * API calls for the traveler profile and trip history.
 */

import { client } from '../../../utils/apiClient';

export const profileApi = {
  getMe: () =>
    client.get('/api/v1/user/me').then((r) => r.data),

  updateMe: (payload: { name?: string; phone?: string }) =>
    client.patch('/api/v1/user/me', payload).then((r) => r.data),

  getUpcomingTrips: () =>
    client.get('/api/v1/user/me/upcoming-trips').then((r) => r.data),

  getPastTrips: () =>
    client.get('/api/v1/user/me/past-trips').then((r) => r.data),

  becomeOrganizer: () =>
    client.post('/api/v1/user/become-organizer').then((r) => r.data),

  logout: () =>
    client.post('/api/v1/auth/logout').then(() => undefined),
};
