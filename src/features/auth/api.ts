/**
 * features/auth/api.ts
 *
 * API calls for authentication (login and registration).
 */

import { client } from '../../utils/apiClient';

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    client.post('/api/v1/auth/login', payload).then((r) => r.data),

  register: (payload: { name: string; email: string; phone?: string; password: string }) =>
    client.post('/api/v1/auth/register', payload).then((r) => r.data),

  logout: () =>
    client.post('/api/v1/auth/logout').then(() => undefined),
};
