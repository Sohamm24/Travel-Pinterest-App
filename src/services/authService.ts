import api from './api';
import { setAuthToken, clearAuthToken } from './api';
import type { User } from '../types';

export const authService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/api/users/me');
    return data;
  },

  async updateProfile(payload: { name?: string; bio?: string; avatar_url?: string }): Promise<User> {
    const { data } = await api.put<User>('/api/users/me', payload);
    return data;
  },

  async getStats(): Promise<Record<string, number>> {
    const { data } = await api.get('/api/users/me/stats');
    return data;
  },

  async createBooking(experienceId: number): Promise<{ booking: any; guide_contact: string }> {
    const { data } = await api.post('/api/bookings', { experience_id: experienceId });
    return data;
  },

  async getBookings(): Promise<any[]> {
    const { data } = await api.get('/api/bookings');
    return data;
  },

  setToken: setAuthToken,
  clearToken: clearAuthToken,
};
